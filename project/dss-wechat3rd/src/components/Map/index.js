/**
 * Created by love on 18/9/13.
 * @author trumpli<李志伟>
 */

import TMap from './TMap/index';

let marker,
  cityLocation,
  initLatLng,
  ignoreCallback,
  TMapClass,
  mapInstance,
  onClickMap,
  onMapLocation,
  fixedMarker, // 固定marker，仅作展示时
  Geocoder, //获取根据坐标详细地址
  onCityLocation; //获取省市区

function location(latLng) {
  if (!ignoreCallback) {
    onClickMap(latLng.lat, latLng.lng);
  }

  if (!!marker) {
    if (!fixedMarker) {
      marker.moveTo(latLng);
    }
  } else {
    marker = new TMapClass.Marker({ map: mapInstance, position: latLng });
  }
  // cityLocation.searchCityByLatLng(latLng);
  Geocoder.getAddress(latLng);
}

function getCityLocation(latLng) {
  cityLocation.searchCityByLatLng(latLng);
}

function locationLatLng(latLng) {
  if (!!Geocoder) {
    location(new TMapClass.LatLng(latLng.lat, latLng.lng));
    ignoreCallback = true;
    initLatLng = null;
  } else {
    initLatLng = latLng;
  }
}

function initMap(options) {
  marker = null;
  cityLocation = null;
  initLatLng = null;
  ignoreCallback = false;
  TMapClass = null;
  mapInstance = null;
  Geocoder = null;
  fixedMarker = options.fixedMarker || null;

  onClickMap = options.onClickMap;
  onMapLocation = options.onMapLocation;
  onCityLocation = options.onCityLocation;

  TMap.initializationMap(options.htmlId).then(opt => {
    TMapClass = opt.Class;
    mapInstance = opt.instance;
    cityLocation = new TMapClass.CityService();
    Geocoder = new TMapClass.Geocoder();

    Geocoder.setComplete(result => {
      let addressComponents = result.detail.addressComponents;
      if (addressComponents.province === addressComponents.city) {
        addressComponents.province = '中国';
      }

      let detail = result.detail.address;
      if (!ignoreCallback) {
        onMapLocation(detail, addressComponents);
      } else {
        //仅仅生效一次
        ignoreCallback = false;
      }
    });

    //城市定位，获取省市区
    cityLocation.setComplete(result => {
      const { detail, latLng } = result.detail;
      let details = detail.split(',');
      let addressComponents = {
        province: details[2],
        city: details[1] || '',
        district: details[0] || ''
      };
      onCityLocation(addressComponents);
    });

    //搜索
    if (!!options.installSearchInvoke) {
      options.installSearchInvoke(opt.searchKeyword);
    }

    //画圆
    if (!!options.Circle) {
      options.Circle(opt.Circle);
    }

    //点击定位
    TMapClass.event.addListener(mapInstance, 'click', e => {
      location(e.latLng);
    });

    //初始化定位
    if (initLatLng) {
      location(new TMapClass.LatLng(initLatLng.lat, initLatLng.lng));
      ignoreCallback = true;
      initLatLng = null;
    }
  });
}

export default {
  initMap,
  getCityLocation,
  locationLatLng
};
