<template>
  <table-select-dialog
    v-model="mShowDialog"
    v-if="activeTab"
    class="goods-select-dialog"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :api-url="apiUrl"
    :selected-list="selectedList"
    :union-keys="unionKeys"
    :query-params="allQueryParams"
    :columns-handler="columnsHandler"
    @choose="onChooseProduct"
  >
    <el-tabs
      v-model="computeActiveTab"
      :class="activeTabList.length === 1 ? 'hidden-tab' : ''"
      @tab-click="handleTabChange"
      type="card"
      slot="filter"
    >
      <el-tab-pane
        v-for="goodsTab in activeTabList"
        :key="goodsTab.value"
        :label="goodsTab.label"
        :name="goodsTab.type"
      >
        <goods-list-filter
          class="list-filter"
          :ref="goodsTab.type"
          :goods-type="goodsTab"
          :goods-type-tab-list="goodsTypeTabList"
          show-barcode
          @filter="filter => onFilter(goodsTab.type, filter)"
        />
      </el-tab-pane>
    </el-tabs>
  </table-select-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import goodsTypeEnum from '@/mod-member/src/enum/goodsTypeEnum';
  import constApis from '@/mod-member/src/components/goods-select-dialog/index';
  import giftApi from '@/mod-member/src/components/goods-select-dialog/gift';
  import Handler from '@/business-common/components/table-select-dialog/handler';
  import SalePriceColumn from './sale-price-column.vue';
  import ItemSkuColumn from './item-sku-column.vue';
  import ItemSpuColumn from './item-spu-column.vue';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin';
  import { industryHelperMixin } from '@/register/wechat3rd';
  import ChooseBtn from '@/business-common/components/table-select-dialog/common-component/chooseBtn.vue';
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index.vue';
  import GoodsListFilter from '@/mod-member/src/components/goods-select-dialog/GoodsListFilter.vue';

  /**
   * 商品选择弹窗：
   * 可以选择商品sku维度，也可以选择spu维度
   * 支持单选和多选
   * 支持指定tab中有哪几种类型的商品：产品、服务等
   * 具体使用可以根据props定义
   * example:
   * 单选示例：砍价的选择sku商品
   * 多选示例：入库选择多个sku商品
   */
  export default {
    name: 'GoodsSelectDialog',
    mixins: [industryHelperMixin, dialogMixin],
    components: {
      GoodsListFilter,
      TableSelectDialog,
    },

    props: {
      // 是否过滤线下商品
      filterOffline: {
        type: Boolean,
        default: false,
      },

      /* 是否多选 */
      enableMultiple: {
        type: Boolean,
        default: false,
      },

      // 是否允许选择商品对话弹框子组件的显示商品类型tab切换
      showGoodsTypeTab: {
        type: Boolean,
        default: false,
      },

      // 商品归属于门店或品牌总店
      goodsBelong: {
        type: String,
        default: '',
      },

      /* 展示的商品类型，需要从goodsTypeEnum中选择商品类型，如服务、产品等 */
      activeTabs: {
        type: Array,
        default: function () {
          return [];
        },
      },
      /* 是否选择sku */
      chooseSku: {
        type: Boolean,
        default: false,
      },
      /* 额外的请求参数信息 */
      extParams: {
        type: Object,
        default: function () {
          return {};
        },
      },
      unionKeys: {
        type: Array,
        default: function () {
          return ['itemNo', 'skuId'];
        },
      },
      /* 初始化选中的列表 */
      selectedList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      // 禁止单项选择回调钩子，默认返回true,参数接收该行数据对象
      enableHandler: {
        type: Function,
        default: function () {
          return row => {
            return true;
          };
        },
      },
      // 禁止选择的提示语
      disabledTip: {
        type: String,
        default: '该条目禁止选择',
      },
    },

    data() {
      return {
        goodsTypeEnum,
        activeTabList: [],
        activeTab: null,
        queryParams: {
          status: 1,
          type: goodsTypeEnum.server.value,
        },
        filterDataMap: {},
      };
    },

    computed: {
      ...mapState({
        env: 'env',
      }),
      columns() {
        if (this.chooseSku) {
          const skuColumns = [
            {
              label: '名称',
              prop: 'itemName',
              component: ItemSkuColumn,
            },
            {
              label: '企业售价(￥)',
              prop: 'salePrice',
              component: SalePriceColumn,
            },
          ];
          if (this.activeTab.type === goodsTypeEnum.product.type || this.activeTab.type === goodsTypeEnum.gift.type) {
            skuColumns.push({
              label: '单位',
              prop: 'unit',
              propsHandler: Handler.propsHandler,
            });
            skuColumns.push({
              label: '条形码',
              prop: 'barcode',
              propsHandler: Handler.propsHandler,
            });
          }
          return skuColumns;
        } else {
          const spuColumns = [
            {
              label: '名称',
              prop: 'name',
              component: ItemSpuColumn,
            },

            {
              label: '企业售价(￥)',
              prop: 'salePrice',
              component: SalePriceColumn,
            },
          ];
          if (this.activeTab.type === goodsTypeEnum.product.type) {
            spuColumns.push({
              label: '单位',
              prop: 'unit',
              propsHandler: Handler.propsHandler,
            });
          }
          return spuColumns;
        }
      },
      apiUrl() {
        if (this.goodsBelong === 'store') {
          return constApis.Api.store.queryStoreItems; // 返回门店商品查询接口
        }

        // 如果是赠品查询接口
        if (this.activeTab.type === this.goodsTypeEnum.gift.type) {
          return giftApi.list;
        }

        // 返回品牌商品查询接口
        return this.chooseSku ? constApis.Api.goods.epSkuList : constApis.Api.goods.list;
      },
      allQueryParams() {
        return { ...this.queryParams, ...(this.extParams || {}) };
      },
      computeActiveTab: {
        get() {
          return this.activeTab.type;
        },
        set(goodsType) {
          //
        },
      },

      // 传给选择商品对话弹框子组件的商品类型tab数据集合
      goodsTypeTabList() {
        if (
          this.showGoodsTypeTab && // 允许子组件显示商品类型tab切换
          this.activeTab === goodsTypeEnum.product // 商品类型为产品
        ) {
          return [goodsTypeEnum.product, goodsTypeEnum.combinationItem]; // 商品类型tab数据集合
        }
        return [];
      },
    },
    mounted() {
      if (this.activeTabs && this.activeTabs.length) {
        this.activeTabList = this.activeTabs;
      } else {
        this.activeTabList = this.mGetGoodsSelectDialogActiveTabs();
      }
      this.activeTab = this.activeTabList[0];
      this.queryParams.type = this.activeTab.value;
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
            width: '108px',
            component: ChooseBtn,
            disabledTip: this.disabledTip,
            canAbled: row => {
              // 过滤 线下咨询商品
              if (row.type === 1 && this.filterOffline && !!row.salesType) {
                return false;
              }
              // 过滤商品禁用的sku
              if (row.type === 1 && row.notOptional === 1) {
                return false;
              }

              return this.enableHandler(row);
            },
            listeners: {
              'choose-item'(row) {
                _this.mShowDialog = false;
                _this.$emit('single-choosed', row);
              },
            },
          });
        }
      },

      onFilter(goodsType, filter) {
        if (goodsType === this.activeTab.type) {
          this.filterDataMap[goodsType] = filter;
          this.queryParams = {
            ...filter,
            name: filter.itemName,
          };
        }
      },

      onChooseProduct(selectedRows) {
        this.$emit('selected', selectedRows);
      },
      handleTabChange(targetTab) {
        const goodsType = targetTab.name;
        this.activeTab = goodsTypeEnum[goodsType];
        const filter = this.filterDataMap[goodsType] || {};
        this.queryParams = {
          status: 1,
          type: this.activeTab.value,
          ...filter,
          name: filter.itemName,
        };
      },
    },
  };
</script>

<style lang="less">
  .goods-select-dialog {
    .el-tabs--card > .el-tabs__header {
      padding-left: 20px;
      padding-top: 16px;
      border-bottom: none;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-bottom: 1px solid #dce1e6;
      background: #f5f7fa;
    }
    .el-tabs__item.is-active {
      border-bottom-color: #fff !important;
      background: #fff !important;
    }
    /deep/ .el-dialog__headerbtn {
      z-index: 123;
    }
    .list-filter {
      text-align: left;
      margin-bottom: 16px;
      .el-form-item {
        margin-bottom: 0;
      }
      .title-box {
        display: block;
      }
      .el-form-item:nth-child(2) {
        margin-left: -14px;
      }
      .el-table .cell {
        text-overflow: clip;
      }
    }
    .hidden-tab {
      .el-tabs__nav-scroll {
        display: none;
      }
    }
    .el-dialog__header {
      padding: 0px !important;
    }
    tbody {
      tr > td:last-child > .cell {
        width: 222px;
      }
    }
  }
</style>
