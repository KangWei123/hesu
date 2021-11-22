<style lang="less">
  .poster-module {
    .poster-module-container {
      .paved {
        width: 100%;
        font-size: 0px;

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .no-data {
      width: 100%;
      height: 230px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>

<template>
  <div class="poster-module">
    <div
      class="poster-module-container"
      v-if="(dataSource.bgMode === 'custom' && dataSource.bgUrl) || dataSource.bgMode === 'default'"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      }"
    >
      <div class="paved">
        <img
          :style="{ borderRadius: dataSource.radius + 'px' }"
          :src="dataSource.bgMode === 'default' ? defaultScanUrl : dataSource.wkBgUrl"
        />
      </div>
    </div>
    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <div>添加扫码购图标</div>
      <div>建议尺寸750px*460px</div>
    </div>
  </div>
</template>
<script>
  import defaultScanUrl from '../images/scan/ic-scan-buy.png';
  import ImageFilter from './image-filter';
  export default {
    name: 'ScanModule',
    props: {
      dataSource: {
        type: Object,
        default: {},
      },
    },
    data() {
      return {
        defaultScanUrl,
      };
    },

    watch: {
      'dataSource.bgUrl': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(this.dataSource, 'bgUrl', 'wkBgUrl');
          }
        },
      },
    },

    methods: {
      addWkbImage(dataSource, originKey, addKey) {
        const originImage = dataSource[originKey];
        // const reg = new RegExp('https://.*?com', '');
        // dataSource[addKey] = originImage.replace(reg, '');
        dataSource[addKey] = ImageFilter(originImage);
      },
    },
  };
</script>
