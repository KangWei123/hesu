<template>
  <div
    class="vr-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      background: dataSource.bgMode != 'default' ? dataSource.backgroundColor : '',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>

    <div class="vr-module-container" v-if="showList">
      <div
        class="item"
        v-for="(item, index) in dataSource.data.filter(item => item.wkSrc)"
        :key="index"
        :style="{ borderRadius: dataSource.radius + 'px' }"
      >
        <div class="img-box" :style="{ 'background-image': 'url(' + item.wkSrc + ')' }">
          <img :src="item.thumbnail" />
          <div class="vr-label" v-if="item.VRLink"></div>
        </div>
        <div class="vr-title limit-line-ellipsis" v-if="item.VRTitle">
          {{ item.VRTitle }}
        </div>
      </div>
    </div>

    <!-- 没有数据的时候 -->
    <div v-else class="no-data">
      <div>点击编辑VR展示</div>
    </div>
  </div>
</template>
<script>
  import ImageFilter from './image-filter';

  export default {
    name: 'VRModule',
    props: {
      dataSource: {
        type: Object,
        default() {
          return {};
        },
      },
    },

    watch: {
      'dataSource.data': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.nowIndex = 0;
          if (newVal) {
            this.addWkbImage(newVal, 'imgUrl', 'wkSrc');
          }
        },
      },
    },

    computed: {
      showList() {
        return this.dataSource.data.length && this.dataSource.data.some(item => item.imgUrl);
      },
    },

    methods: {
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
  };
</script>
<style lang="less" scoped>
  .vr-module {
    .item {
      margin: 0 10px 10px;
      background: #fff;
      box-shadow: 0pt 2pt 5pt 0pt rgba(82, 96, 112, 0.11);
      overflow: hidden;
    }
    .img-box {
      position: relative;
      height: 195px;
      background-size: cover;
      background-position: center;
    }
    .vr-label {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 118px;
      height: 38px;
      background: url(../../../../images/marketing/micro-decorate/icon-vr.png) no-repeat center/100% 100%;
      transform: translate(-50%, -50%);
    }
    .vr-title {
      padding: 10px;
      line-height: normal;
      font-size: 15px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #33373e;
    }

    .no-data {
      width: 100%;
      height: 150px;
      background-color: rgb(78, 123, 229);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
    }
  }
</style>
