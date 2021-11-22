<template>
  <table-select-dialog
    class="dss-dialog"
    :title="title"
    v-model="mShowDialog"
    :enable-multiple="enableMultiple"
    :columns="column"
    :api-url="apiUrl"
    :request-method="requestMethod"
    :union-keys="unionKeys"
    :columns-handler="columnsHandler"
    :query-params="params"
    :width="column.length < 3 ? '700px' : width"
    :selected-list="selectedList"
    @choose="onChooseProduct"
    :inner-dialog="innerDialog"
    :close-on-click-modal="closeOnClickModal"
  >
    <!-- 商品条件筛选器 -->
    <goods-list-filter
      v-if="!hiddenFilter"
      class="list-filter"
      :goods-type="goodsType"
      show-store
      show-activity
      :show-label="showLabel"
      :goods-type-tab-list="goodsTypeTabList"
      @filter="onFilter"
      slot="filter"
    />
    <!-- 非商品的条件筛选器 -->
    <normal-filter
      v-if="showNormalFilter"
      :show-keyword="showKeyword"
      :goods-type="goodsType"
      :show-label="showLabel"
      :filter-list="normalFilterList"
      :key="goodsType.type"
      @filter="onFilter"
      slot="filter"
    />

    <!-- 限制条件筛选 -->
    <limit-list :limit-params="limitParams" v-if="showLimit" slot="limit" />
  </table-select-dialog>
</template>

<script>
  import './index.less';
  import tableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
  import goodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter';
  import normalFilter from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/normal-filter';
  import limitList from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/limitList';
  import columns from './columns.js';
  import ChooseBtn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import distcountEnum from '@/dss-wechat3rd/src/constants/distcountEnum.js';

  export default {
    name: 'SelectDialog',
    mixins: [dialogMixin],
    components: {
      tableSelectDialog,
      goodsListFilter,
      limitList,
      normalFilter,
    },

    props: {
      innerDialog: {
        type: Boolean,
        default: false,
      },
      closeOnClickModal: {
        type: Boolean,
        default: true,
      },
      title: {
        type: String,
        default: '',
      },
      goodsType: {
        type: Object,
        default: function () {
          return null;
        },
      },
      showLabel: {
        type: Boolean,
        default: true,
      },

      // 是否允许选择商品对话弹框子组件的显示商品类型tab切换
      showGoodsTypeTab: {
        type: Boolean,
        default: false,
      },
      isAreaManger: {
        type: Boolean,
        default: false,
      },

      limitParams: {
        type: Array,
        default: function () {
          return [];
          /**
           * [{
           *    label: '图文分类',  //弹窗中显示的限制参数名
           *    name: target && target.categoryName, //弹窗中显示的限制参数值
           *    requestName: 'categoryId' , //请求参数名
           *    requestValue: this.dataSource.textNavSource.categroy  //请求参数值
           * }]
           */
        },
      },

      filterList: {
        type: Array,
        default: function () {
          return [];
        },
      },

      enableMultiple: {
        type: Boolean,
        default: true,
      },

      width: {
        type: String,
        default: '1100px',
      },
      /* 初始化选中的列表 */
      selectedList: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    computed: {
      column() {
        if (this.goodsType) {
          if (['group', 'seckill', 'haggle'].includes(this.goodsType.type) && !this.isAreaManger) {
            const column = columns[this.goodsType.type].column;
            const index = column.findIndex(item => item.label == '活动类型');
            if (index > -1) column.splice(index, 1);
          }
          return columns[this.goodsType.type].column;
        }
        return [];
      },
      apiUrl() {
        if (this.goodsType) {
          return columns[this.goodsType.type].url;
        }
      },

      requestMethod() {
        if (this.goodsType) {
          return columns[this.goodsType.type].requestMethod;
        }
        return 'get';
      },

      hiddenFilter() {
        if (this.goodsType) {
          return columns[this.goodsType.type].hiddenFilter;
        }
        return false;
      },

      showLimit() {
        if (this.goodsType) {
          return columns[this.goodsType.type].showLimit;
        }
        return false;
      },

      normalFilterList() {
        if (this.goodsType && columns[this.goodsType.type].filterList) {
          return columns[this.goodsType.type].filterList;
        }
        return this.filterList;
      },

      showNormalFilter() {
        if (this.goodsType) {
          return columns[this.goodsType.type].showNormalFilter;
        }
      },

      showKeyword() {
        if (this.goodsType) {
          return columns[this.goodsType.type].showKeyword;
        }
      },

      params() {
        if (!this.goodsType) {
          return;
        }
        let params = null;
        if (this.goodsType) {
          const limitParams = {};
          this.limitParams.forEach(item => {
            if (item.requestName) {
              limitParams[item.requestName] = item.requestValue;
            }
          });

          // 拼团/秒杀/砍价权限管理
          if (['lucky', 'micro-decorate'].indexOf(this.goodsType.type) > -1) {
            if (!this.isAreaManger) {
              // 非区管(品牌管理员)屏蔽筛选框，只能看见品牌活动
              (this.filterList[0] || []).type = null;
              if (this.goodsType.type === 'haggle') {
                delete this.identityParams.activityLevel;
                this.identityParams.createStoreId = suitStoreTypeEnum.activity.cutPriceBrand;
              } else {
                delete this.identityParams.createStoreId;
                if (this.goodsType.type === 'micro-decorate') {
                  this.identityParams.activityLevel = suitStoreTypeEnum.activity.microDecorateBrand;
                } else {
                  this.identityParams.activityLevel = suitStoreTypeEnum.activity.brand;
                }
              }
            } else {
              if (this.goodsType.type !== 'micro-decorate') {
                this.identityParams.activityLevelListStr = '1,10';
              }
              this.filterList[0].type = 'select';
            }
          }

          params = {
            ...{
              type: this.goodsType.value,
              status: 1,
            },
            ...limitParams,
            ...this.queryParams,
            ...this.identityParams,
          };

          // 判断商品类型是秒杀商品时，则用传进来的statusList作为请求的参数，删除参数中原有的status参数
          if (this.goodsType.type === 'seckill') {
            delete params.status;
          }
          this.queryParams = null;
        }
        const config = columns[this.goodsType.type];
        if (config && config.exParams) {
          params = Object.assign({}, params, config.exParams);
        }
        return params;
      },
      unionKeys() {
        if (this.goodsType && columns[this.goodsType.type] && columns[this.goodsType.type].unionKeys) {
          return columns[this.goodsType.type].unionKeys;
        }
        return ['itemNo', 'skuId'];
      },

      // 传给选择商品对话弹框子组件的商品类型tab数据集合
      goodsTypeTabList() {
        if (
          this.showGoodsTypeTab && // 允许子组件显示商品类型tab切换
          this.goodsType === goodsTypeEnum.product // 商品类型为产品
        ) {
          return [goodsTypeEnum.product, goodsTypeEnum.combinationItem]; // 商品类型tab数据集合
        }
        if (
          this.showGoodsTypeTab && // 允许子组件显示商品类型tab切换
          this.goodsType === goodsTypeEnum.promotion // 商品类型为促销活动
        ) {
          return [
            distcountEnum.activityTypeEnum.SECOND_HALF,
            distcountEnum.activityTypeEnum.FIXED_PRICE,
            distcountEnum.activityTypeEnum.MUCH_BY_MORE_DISCOUNT,
          ];
          // 促销活动类型tab数据集合
        }
        return [];
      },
    },

    data() {
      return {
        queryParams: null,
        identityParams: {},
      };
    },

    methods: {
      columnsHandler(cols) {
        if (this.enableMultiple) {
          return null;
        } else {
          const _this = this;
          return cols.concat({
            label: '操作',
            align: 'left',
            component: ChooseBtn,
            disabledTip: '不在活动时间范围',
            canAbled: row => {
              return !row.activityEndTime || +new Date(row.activityEndTime) > Date.now();
            },

            listeners: {
              'choose-item'(row) {
                if (_this.goodsType.type === 'card-pack') {
                  row.thumbnail = row.itemImageUrls[0];
                }
                _this.$emit('choosed', row);
                _this.mShowDialog = false;
              },
            },
          });
        }
      },

      onFilter(filter) {
        // 拼团/秒杀/优惠券新增参数createStoreId 品牌=>0  门店=>1
        if (['group', 'seckill'].indexOf(this.goodsType.type) > -1) {
          if (filter && filter.activityLevel === 1) {
            this.identityParams.createStoreId = 0;
          } else if (filter && filter.activityLevel === 10) {
            this.identityParams.createStoreId = 1;
          }
        }
        console.log(filter);
        // this.queryParams = filter;
        this.queryParams = { ...filter };
        if (this.queryParams.store) {
          this.queryParams.storeId = this.queryParams.store.id;
        } else {
          delete this.queryParams.storeId;
        }

        if (this.queryParams.merchantStoreId) {
          this.queryParams.storeId = this.queryParams.merchantStoreId;
        }

        // 促销活动的搜索，如果没有切换tab，不传type
        if (this.goodsType === goodsTypeEnum.promotion) {
          this.queryParams.name = this.queryParams.itemName;
          if (!this.showGoodsTypeTab) {
            this.queryParams.type = null;
          }
        }

        delete this.queryParams.store;
        delete this.queryParams.merchantStoreId;
      },

      onChooseProduct(row) {
        this.$emit('choosed', row);
      },
    },
    mounted() {},
  };
</script>

<style lang="less"></style>
