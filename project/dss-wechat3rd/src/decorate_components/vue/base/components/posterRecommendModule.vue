<template>
  <div class="poster-recommend-module">
    <div
      class="activit-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        'border-radius': dataSource.radius + 'px',
      }"
    >
      <div class="img-module" v-if="dataSource.showPoster">
        <img :src="dataSource.wkPosterUrl" class="poster" />
      </div>
      <div class="title" :style="{ padding: (dataSource.posterTitlePaddingUpDown || 10) + 'px 5px' }" v-else>
        {{ dataSource.posterTitle }}
      </div>
      <component :is="componentsType" :data-source="dataSource" :list="list" :type="goodsTypeEnum.product" />
    </div>
  </div>
</template>

<script>
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import ImageFilter from './image-filter';
  import Retail from '../base_style_components/industry_style_components/retail.vue';
  import Tourism from '../base_style_components/industry_style_components/tourism.vue';
  import Estate from '../base_style_components/industry_style_components/estate.vue';
  export default {
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      Retail,
      Tourism,
      Estate,
    },
    data() {
      return {
        list: [],
        goodsTypeEnum,
      };
    },

    computed: {
      componentsType() {
        /**
         * 根据type类型判断行业模板
         */
        const type = new Map([
          ['product', 'retail'],
          ['server', 'tourism'],
          ['rooms', 'tourism'],
          ['ticket', 'tourism'],
          ['estate', 'estate'],
        ]);

        // 默认零售行业
        if (!type.get(this.goodsTypeEnum.product.type)) {
          return 'retail';
        }

        return type.get(this.goodsTypeEnum.product.type);
      },
    },

    watch: {
      'dataSource.limitNum': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.getList(newVal);
        },
      },
      'dataSource.posterUrl': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          let tmp = '';
          if (this.dataSource.posterUrl) {
            const originImage = this.dataSource.posterUrl;
            tmp = ImageFilter(originImage);
          }
          // eslint-disable-next-line vue/no-mutating-props
          this.dataSource.wkPosterUrl = tmp;
        },
      },
    },

    methods: {
      getList(limitNum) {
        const length = this.list.length;
        if (length > limitNum) {
          this.list.splice(0, length - limitNum);
        } else {
          for (let i = 0; i < limitNum - length; i++) {
            this.list.push({
              thumbnail: 'https://image.res.meizu.com/image/dss-wshop/698b054c0d5a438abd305d6f17e6aedbz/auto',
              wkThumbnail: '/image/dss-wshop/698b054c0d5a438abd305d6f17e6aedbz/auto',
              name: '模拟商品，小程序展示真实数据',
              labelPrice: '12900',
              salePrice: '9900',
            });
          }
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .poster-recommend-module {
    .activit-module {
      // background: rgba(255, 255, 255, 1);
      overflow: hidden;
      .poster {
        width: 100%;
        height: 120px;
        // border-radius: 8px 8px 0 0;
      }
      .title {
        font-size: 18px;
        color: #343434;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        letter-spacing: 1px;
        padding: 5px 10px 10px;
        box-sizing: border-box;
      }
    }
    .no-data {
      width: 100%;
      height: 193px;
      background-color: rgb(78, 123, 229);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: white;
    }
  }
</style>
