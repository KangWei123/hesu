<template>
  <div class="product-serve-container">
    <div
      class="activit-module"
      :style="{
        margin: dataSource.marginUp + 'px ' + dataSource.marginLeftRight + 'px ' + dataSource.marginDown + 'px',
        'border-radius': dataSource.radius + 'px',
      }"
      v-if="computeData && computeData.wxItemList"
    >
      <div class="img-module" v-if="dataSource.showPoster">
        <img :src="computeData.wkTopicImgUrl" class="poster" />
      </div>
      <div class="title" v-else>{{ computeData.topicName }}</div>
      <component
        :is="componentsType"
        :data-source="dataSource"
        :list="computeData.wxItemList"
        :type="goodsTypeEnum.product"
      />
    </div>
    <div class="no-data" v-else>
      <div>点击编辑专题活动</div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import textNavModule from './textNavModule.vue';
  import service from '@/dss-wechat3rd/src/api/activity';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields';
  import ImageFilter from './image-filter';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
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
    watch: {
      computeData: {
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
        curStore: 'curStore',
      }),

      /**
       * 是否为门店账号
       */
      isStoreAccount() {
        return !!this.curStore && !this.curStore.parentId && this.curStore.parentId !== 0;
      },

      computeData() {
        return this.dataSource.data ? this.dataSource.data : null;
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
        if (!type.get(this.goodsTypeEnum.product.type)) {
          return 'retail';
        }

        return type.get(this.goodsTypeEnum.product.type);
      },
    },

    mounted() {
      this.getList();
    },

    data() {
      return {
        goodsTypeEnum,
      };
    },

    methods: {
      getList() {
        const activityId = this.dataSource.activityId;
        if (activityId) {
          const params = {
            topicId: this.dataSource.activityId,
            itemCount: this.dataSource.limitNum,
          };

          if (this.isStoreAccount) {
            params.queryAllChildStore = true;
          }

          service.supplier.topic_with_items(params).then(res => {
            if (res.data && res.data.wxItemList && res.data.wxItemList.length) {
              res.data.wxItemList = utils.saveAvailableFields(res.data.wxItemList, fields.activity);
            }
            // eslint-disable-next-line vue/no-mutating-props
            this.dataSource.data = res.data;
          });
        }
      },
      addWkbImage(items, originKey, addKey) {
        // const reg = new RegExp('https://.*?com', '');
        if (items.topicImgUrl) {
          items.wkTopicImgUrl = ImageFilter(items.topicImgUrl);
          // items.wkTopicImgUrl = items.topicImgUrl.replace(reg, '');
        }
        (items.wxItemList || []).forEach(item => {
          if (item[originKey]) {
            const originImage = item[originKey];
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
    .activit-module {
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 6px 24px 0px rgba(34, 37, 46, 0.08);
      overflow: hidden;
      .poster {
        width: 100%;
        height: 120px;
      }
      .title {
        font-size: 16px;
        color: rgba(69, 69, 69, 1);
        padding: 5px 10px;
      }
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
