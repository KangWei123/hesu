<template>
  <div class="product-serve-container">
    <div
      v-if="(computeData && computeData.length) || (dataSource.posterData && dataSource.posterData.length)"
      class="activit-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        'border-radius': dataSource.radius + 'px',
      }"
    >
      <div class="img-module" v-if="dataSource.showPoster">
        <img v-for="(item, index) in dataSource.posterData" :key="index" :src="item.wkSrc" class="poster" />
      </div>
      <text-nav-module v-else :data-source="dataSource.textNavSource"></text-nav-module>
      <div class="goods-module">
        <Retail :data-source="dataSource" :list="goodsData" :show-all="false" />
      </div>
    </div>
    <div class="no-data" v-else>
      <div>点击编辑促销活动</div>
    </div>
  </div>
</template>

<script>
  import textNavModule from './textNavModule.vue';
  import discountApi from '@/dss-wechat3rd/src/api/discount.js';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import ImageFilter from './image-filter';
  import Retail from '../base_style_components/industry_style_components/retail.vue';

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
    components: {
      textNavModule,
      Retail,
    },

    watch: {
      computeData: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal.length) {
            this.getList();
          }
        },
      },
      'dataSource.posterData': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'src', 'wkSrc');
          }
        },
      },
      'dataSource.limitNum': {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.getList();
          }
        },
      },
    },

    computed: {
      computeData() {
        return this.dataSource.data ? this.dataSource.data : null;
      },
    },

    data() {
      return {
        goodsData: [],
      };
    },

    mounted() {},

    methods: {
      getList() {
        if (!this.dataSource.data[0]) {
          return;
        }
        const params = {
          moreDiscountActivityId: this.dataSource.data[0].id,
          pageNo: 1,
          pageSize: this.dataSource.limitNum,
        };
        discountApi.query_item(params).then(res => {
          this.goodsData = utils.saveAvailableFields(res.data, fields.goods);
          this.addWkbImage(this.goodsData, 'thumbnail', 'wkThumbnail');
        });
      },

      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            // item[addKey] = originImage.replace(reg, '');
            item[addKey] = ImageFilter(originImage);
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .product-serve-container {
    .img-module {
      height: 150px;
      background: rgba(255, 255, 255, 1);
      .poster {
        width: 100%;
        height: 150px;
      }
    }
    .goods-module {
      margin-top: 10px;
    }
    .activit-module {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 24px 0px rgba(34, 37, 46, 0.08);
      overflow: hidden;
    }
    .no-data {
      width: 100%;
      height: 193px;
      background-color: #f1f4f9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #303133;
    }
  }
</style>
