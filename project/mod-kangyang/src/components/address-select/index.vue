<template>
  <div class="address-selector">
    <div class="input">
      <el-autocomplete
        type="input"
        class="address"
        :value="value.address"
        placeholder="详细地址"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        :disabled="disabled"
        style="width: 300px"
        @select="handleAddressSelect"
        @input="handleAddressInput"
      ></el-autocomplete>
    </div>

    <div style="position: relative">
      <map-selector ref="map" :value="value" :disabled="disabled" @input="onMapLocationChangeh"></map-selector>
      <div class="info">
        <div>纬度: {{ value.latitude || '-' }}</div>
        <div>经度: {{ value.longitude || '-' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import MapSelector from '../map-select';

  /**
   * 地址选择器
   */
  export default {
    name: 'AddressSelector',
    components: {
      MapSelector,
    },
    props: {
      value: {
        /**
         * latitude
         * longitude
         * address
         */
        type: Object,
        default: () => ({}),
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      /**
       * 输入关键字搜索地址时，清除经纬度
       */
      clearLatLngWhenType: {
        type: Boolean,
        default: false,
      },
      getLatLng: {
        type: Boolean,
        default: false,
      },
    },

    methods: {
      handleAddressInput(evt) {
        const value = { ...(this.value || {}), address: evt };
        if (this.clearLatLngWhenType) {
          value.latitude = '';
          value.longitude = '';
        }
        this.$emit('input', value);
      },
      handleAddressSelect(evt) {
        if (this.$refs.map) {
          this.$refs.map.locationTo(evt.id);
          this.$nextTick(() => {
            this.handleInput({ address: evt.value });
          });
        }
      },
      onMapLocationChangeh(evt) {
        this.handleInput({
          ...(evt || {}),
          address: this.value.address,
        });
      },
      async querySearch(query, cb) {
        if (this.$refs.map) {
          const list = await this.$refs.map.querySearch(query);
          cb(list);
        } else {
          const list = [];
          cb(list);
        }
      },
      onClickGetLatLng() {
        const { address = '' } = this.value;
        if (!address) {
          return;
        }
        this.$refs.map.geoAddress(address);
      },
      handleInput(evt) {
        const value = { ...(this.value || {}), ...(evt || {}) };
        this.$emit('input', value);
      },
    },
  };
</script>

<style lang="less" scoped>
  .address-selector {
    width: 780px;

    .input {
      display: flex;
    }

    .info {
      position: absolute;
      left: 102%;
      top: 0;
    }

    .info > div {
      white-space: nowrap;
    }
  }
</style>
