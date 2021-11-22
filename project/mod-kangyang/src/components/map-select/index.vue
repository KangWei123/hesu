<template>
  <div :id="`mapid-${id}`" :class="['map-selector', { disabled }]" style="height: 550px; margin-top: 10px"></div>
</template>

<script>
  import { Map } from '@/register/wechat3rd';

  let uid = 0;

  /**
   * 地图选择器
   */
  export default {
    props: {
      value: {
        // latitude
        // longitude
        // address
        // city
        type: Object,
        default: () => ({}),
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        id: uid++,
        areas: {},
      };
    },
    mounted() {
      Map.initMap({
        htmlId: `mapid-${this.id}`,
        onClickMap: this.handleClickMap,
        onMapLocation: this.handleMapLocation,
        // 搜索
        installSearchInvoke: cb => {
          this._searchInvoke = cb;
          this.getlatLng();
        },
        onCityLocation: addressComponents => {
          // 未设定城市, 跳转到城市
          if (this.value.province == null) {
            this.handleMapLocation(null, addressComponents);
          }
        },
        Circle: cb => {
          this.doCircle = cb;
        },
        onAdressToLocationComplete: this.onAdressToLocationComplete,
      });
    },
    methods: {
      /**
       * 定位到指定地址
       */
      locationToAddress(address) {
        this._searchInvoke(address).then(poi => {
          if (poi) {
            const item = poi[0];
            Map.locationLatLng(item.latLng);
            this.doCircle(item.latLng, 0, true);
            this.handleClickMap(item.latLng.lat, item.latLng.lng);
          }
        });
      },

      locationTo(loc) {
        Map.locationLatLng(loc);
        Map.getCityLocation(loc);
        this.handleClickMap(loc.lat, loc.lng);
        this.doCircle(loc, 0, true);
      },

      // 地址检索，获取多个地址信息
      async querySearch(keyWord) {
        if (!keyWord || keyWord.trim() === '') {
          return [];
        }

        if (!!this._searchInvoke && keyWord) {
          return this._searchInvoke(keyWord).then(poi => {
            if (poi && poi.length) {
              return poi.map(item => {
                return { ...item, value: item.address ? item.address + '—' + item.name : item.name, id: item.latLng };
              });
            }

            return [];
          });
        }

        return [];
      },

      getlatLng() {
        if (this._searchInvoke && this.value.address) {
          this._searchInvoke(this.value.address)
            .then(poi => {
              if (poi && poi.length) {
                const address = poi[0];
                // 当前地址的经纬度
                this.latLng = address.latLng;
                this.setCenter();
              }
            })
            .catch(() => {
              const { longitude, latitude } = this.value;
              if (!!longitude && !!latitude) {
                this.latLng = {
                  lat: parseFloat(latitude),
                  lng: parseFloat(longitude),
                };
                this.setCenter();
              }
            });
        }
      },
      setCenter() {
        if (this.value.latitude && this.value.longitude) {
          const latLng = {
            lat: parseFloat(this.value.latitude),
            lng: parseFloat(this.value.longitude),
          };
          Map.locationLatLng(latLng);
          this.doCircle(latLng, 0, true);
        }
      },
      // 地图点击
      handleClickMap(latitude, longitude) {
        if (this.disabled) {
          return;
        }
        this.$emit('input', { ...this.value, latitude, longitude });
      },
      /**
       * 地图位置信息定为后回调
       * @param {string} address
       */
      async handleMapLocation(address, addressComponents) {
        if (address != null) {
          const value = { ...this.value };
          value.address = address.startsWith('中国') ? address.slice(2) : address;
          value.city = addressComponents.city;
          this.$emit('input', value);
        }
      },

      geoAddress(address) {
        Map.addressToLatLng(address);
      },

      onAdressToLocationComplete(result, errMsg) {
        if (!result) {
          this.$message({
            message: errMsg,
            type: 'warning',
          });
          return;
        }
        const value = { ...this.value };
        value.city = result.addressComponents.city;
        const { lat, lng } = result.location;
        value.latitude = lat;
        value.longitude = lng;
        this.latLng = {
          lat: lat,
          lng: lng,
        };
        Map.locationLatLng(this.latLng);
        this.doCircle(this.latLng, 0, true);
        this.$emit('input', value);
      },
    },
  };
</script>

<style lang="less" scoped>
  .map-selector.disabled::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgb(128 128 128 / 14%);
    z-index: 1;
  }
</style>
