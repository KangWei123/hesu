<template>
  <div
    class="pre-sale-module"
    :style="{
      margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      :style="{ 'padding-left': dataSource.componentsPadding + 'px' }"
      v-if="dataSource.data && dataSource.data.length"
    >
      <div class="pre-sale-swiper-module">
        <div
          v-for="(item, index) in dataSource.data"
          :key="index"
          class="pre-sale-item"
          :style="item.wkPreSaleImg | bgImage"
        ></div>
      </div>
    </div>
    <div class="no-data" v-else>点击编辑预售产品</div>
  </div>
</template>

<script>
  // require styles
  import 'swiper/dist/css/swiper.css';
  import textNavModule from './textNavModule.vue';
  import { swiper, swiperSlide } from 'vue-awesome-swiper';
  import ImageFilter from './image-filter';
  export default {
    name: 'PreSaleModule',
    props: {
      dataSource: {
        type: Object,
        default: function () {
          return null;
        },
      },

      title: {
        type: String,
        default: function () {
          return null;
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
            this.addWkbImage(newVal, 'preSaleImg', 'wkPreSaleImg');
          }
        },
      },
    },

    components: {
      swiper,
      swiperSlide,
      textNavModule,
    },

    data() {
      return {
        env: true,
        swiperOption: {
          // 所有配置均为可选（同Swiper配置）
          slidesPerView: 2.5,
          spaceBetween: 10,
          freeMode: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        },
      };
    },

    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      },
    },

    filters: {
      bgImage(val) {
        if (val) {
          return {
            backgroundImage: 'url(' + val + ')',
          };
        }
      },
    },

    methods: {
      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            if (originImage) {
              // const reg = new RegExp('https://.*?com', '');
              // item[addKey] = originImage.replace(reg, '');
              item[addKey] = ImageFilter(originImage);
            }
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .pre-sale-module {
    background-color: white;
    overflow: hidden;
    padding-bottom: 10px;
    box-sizing: border-box;
    margin-right: 0 !important;

    .pre-sale-swiper-module {
      font-size: 0;
      white-space: nowrap;

      .pre-sale-item {
        display: inline-block;
        margin-right: 10px;
        width: 335px;
        height: 100px;
        position: relative;
        background-size: cover;
        background: no-repeat center;
        border-radius: 4px;
      }
    }

    .no-data {
      width: 100%;
      height: 100px;
      background-color: rgb(78, 123, 229);
      line-height: 100px;
      text-align: center;
      color: white;
    }
  }
</style>
