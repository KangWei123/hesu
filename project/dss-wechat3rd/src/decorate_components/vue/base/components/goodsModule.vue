<template>
  <div
    class="product-serve-container"
    :style="{
      padding: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
      borderRadius: dataSource.radius + 'px',
      background: dataSource.backgroundColor || 'white',
    }"
  >
    <text-nav-module v-if="dataSource.showNav" :data-source="dataSource.textNavSource"></text-nav-module>
    <div
      class="goods-module"
      :style="{ padding: '0 ' + dataSource.componentsPadding + 'px' }"
      v-if="computeDataList && computeDataList.length"
    >
      <component :is="componentsType" :data-source="dataSource" :list="computeDataList" :type="type" />
    </div>
    <div class="no-data" v-else>
      <div>点击编辑{{ type.label }}</div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/index';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import addImg from '@/dss-wechat3rd/src/images/ic-add-cart.png';
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

      type: {
        type: Object,
        default: null,
      },
    },
    components: {
      textNavModule,
      Retail,
      Tourism,
      Estate,
    },
    data() {
      return {
        addImg,
        goodsTypeEnum: goodsTypeEnum,
      };
    },
    watch: {
      computeDataList: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.addWkbImage(newVal, 'thumbnail', 'wkThumbnail');
          }
        },
      },
    },

    computed: {
      ...mapState({
        env: 'env',
        curApp: 'curApp',
        curStore: 'curStore',
      }),
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
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
        if (!type.get(this.type.type)) {
          return 'retail';
        }

        return type.get(this.type.type);
      },
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        const data = this.dataSource.data;
        if (data && data.length) {
          console.log(utils.pickUpItemNos(data, 'itemNo').join(','));
          service
            .itemNosForGoodsList({
              itemNo: utils.pickUpItemNos(data, 'itemNo').join(','),
            })
            .then(res => {
              // eslint-disable-next-line vue/no-mutating-props
              this.dataSource.data = utils.saveAvailableFields(res.data, fields.goods);
            });
        }
      },

      addWkbImage(items, originKey, addKey) {
        (items || []).forEach(item => {
          if (item.hasOwnProperty(originKey)) {
            const originImage = item[originKey];
            // const reg = new RegExp('https://.*?com', '');
            if (originImage) {
              // item[addKey] = originImage.replace(reg, '');
              item[addKey] = ImageFilter(originImage);
            }
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .product-serve-container {
    background-color: white;
    overflow: hidden;

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
