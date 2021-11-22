/* eslint-disable */
/**
 * Created by love on 18/9/15.
 * @author trumpli<李志伟>
 */

const AK = 'BSNBZ-4C2LP-ONWDL-VLMU5-4QC47-4TBLX';

const MAP_CONST = {
  maps: null,
};

let overlaysArray = []; //覆盖物容器,用于清除覆盖物

function initialization() {
  return new Promise(function (resolve, reject) {
    if (!!MAP_CONST.maps) {
      resolve(MAP_CONST.maps);
    } else {
      window.dss_t_callback = function () {
        MAP_CONST.maps = window.qq.maps;
        resolve(MAP_CONST.maps);
        delete window.dss_t_callback;
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//map.qq.com/api/js?v=2.exp&callback=dss_t_callback&key=' + AK;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
}

function initializationMap(htmlId) {
  return new Promise(function (resolve, reject) {
    initialization().then(maps => {
      //获取dom元素添加地图信息
      const map = new maps.Map(htmlId, {
        zoom: 11, //设置地图缩放级别
        mapTypeId: maps.MapTypeId.ROADMAP, //设置地图样式详情参见MapType
      });

      let searchResolve, searchReject;
      //逆地址解析(经纬度到地名转换)
      const geocoder = new qq.maps.Geocoder({
        complete: function (result) {
          let addressComponents = result.detail.addressComponents;
          if (addressComponents.province === addressComponents.city) {
            addressComponents.province = '中国';
          }
          let first = {
            latLng: result.detail.location,
            addressComponents: addressComponents,
          };
          if (!!searchResolve) {
            searchResolve(first);
          }
        },
        //若服务请求失败，则运行以下函数
        error: function () {
          if (!!searchReject) {
            searchReject();
          }
        },
      });
      const latLngBounds = new qq.maps.LatLngBounds();
      //设置Poi检索服务，用于本地检索、周边检索
      const searchService = new qq.maps.SearchService({
        pageIndex: 0,
        pageCapacity: 50,
        autoExtend: true,
        //检索成功的回调函数
        complete: function (results) {
          console.log('searchService', results);
          if (results.detail.pois) {
            latLngBounds.extend(results.detail.pois[0].latLng);
            //调整地图视野
            map.fitBounds(latLngBounds);
            searchResolve(results.detail.pois);
          } else {
            searchResolve();
          }
        },
        //若服务请求失败，则运行以下函数
        error: function () {
          if (!!searchReject) {
            searchReject();
          }
        },
      });

      //清除覆盖物
      function clearOverlays(oversArray) {
        if (overlaysArray) {
          for (let i in oversArray) {
            overlaysArray[i].setMap(null);
          }
        }
      }

      //画圆
      function doCircle(latLng, radius, isCenter) {
        clearOverlays(overlaysArray);
        let center = new qq.maps.LatLng(latLng.lat, latLng.lng);
        let circle = new qq.maps.Circle({
          map: map,
          center: center,
          radius: radius,
          strokeWeight: 1,
          strokeColor: '#00f',
          strokeWeight: 3,
        });
        overlaysArray.push(circle);
        circle.setMap(map);
        if (isCenter) {
          map.setCenter(center);
          if (radius < 5000) {
            map.setZoom(13);
          }
        }
        circle.setVisible(true);
      }

      function searchKeyword(keyword, location) {
        if (location) searchService.setLocation(location);
        searchService.search(keyword);
        return new Promise((res, rej) => {
          searchResolve = res;
          searchReject = rej;
        });
      }

      //自动定位
      const cs = new qq.maps.CityService();
      cs.setComplete(result => {
        console.log(result);
        map.setCenter(result.detail.latLng);
        resolve({
          instance: map,
          Class: maps,
          searchKeyword,
          Circle: doCircle,
        });
      });
      //请求失败回调函数
      cs.setError(function () {
        resolve({
          instance: map,
          Class: maps,
          searchKeyword,
          Circle: doCircle,
        });
      });
      cs.searchLocalCity();
    });
  });
}

export default { initializationMap };
