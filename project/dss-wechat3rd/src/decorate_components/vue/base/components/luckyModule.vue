<template>
  <div class="product-serve-container">
    <div
      class="lucky-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        'border-radius': dataSource.radius + 'px',
      }"
      v-if="dataSource && dataSource.data && dataSource.data.id"
    >
      <div class="img-module">
        <div :style="'background-image: url(' + dataSource.wkImg || luckyLayoutImg + ')'" class="poster" />
        <!-- <img :src="dataSource.img||luckyLayoutImg" class="poster" /> -->
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑幸运转盘</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import addImg from '@/dss-wechat3rd/src/images/add.png';
  import luckyLayoutImg from '../images/lucky-layout.jpg';
  import ImageFilter from './image-filter';
  export default {
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
      type: {
        type: Object,
        default: null,
      },
    },
    data() {
      return { addImg, luckyLayoutImg };
    },
    watch: {
      'dataSource.img': {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(this.dataSource, 'img', 'wkImg');
          }
        },
      },
    },
    components: {
      textNavModule,
    },
    methods: {
      addWkbImage(dataSource, originKey, addKey) {
        const originImage = dataSource[originKey];
        if (originImage.indexOf(process.env.VUE_APP_CDN_DOMAIN) === -1) {
          dataSource[addKey] = ImageFilter(originImage);
        } else {
          dataSource[addKey] = originImage;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .product-serve-container {
    .lucky-module {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 24px 0px rgba(34, 37, 46, 0.08);
      overflow: hidden;
      .poster {
        width: 100%;
        height: 125px;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
    }
    .no-data {
      width: 100%;
      height: 125px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
