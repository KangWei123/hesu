<template>
  <tree-select-dialog
    :title="activeTabs.length === 1 ? `选择${activeTabs[0].label}分类` : '选择分类'"
    v-model="showSelectGoodsDialog"
    class="dss-dialog"
    enable-multiple
    width="660px"
    :inner-dialog="true"
    :api-url="apiUrl"
    :selected-list="selectedList"
    :query-params="queryParams"
    :tree-props="treeProps"
    @choose="onCategoryChoosed"
  >
    <el-tabs
      v-if="activeTabs.length > 1"
      v-model="computeActiveTab"
      class="classify-tab"
      @tab-click="handleTabChange"
      slot="filter"
    >
      <el-tab-pane
        v-for="goodsTab in activeTabs"
        :key="goodsTab.label"
        :label="goodsTab.label + '分类'"
        :name="goodsTab.type"
      />
    </el-tabs>
  </tree-select-dialog>
</template>

<script>
  import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi';
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
  import TreeSelectDialog from '@/business-common/components/tree-select-dialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import './index.less';

  /**
   * 管理商品的商品列表
   */
  export default {
    mixins: [AdapterIfr.AdapterMixins],
    name: 'ClassfiySelectDialog',
    model: {
      prop: 'value',
    },
    components: { TreeSelectDialog },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      /* 展示的商品类型，需要从goodsTypeEnum中选择商品类型，如服务、产品等 */
      activeTabs: {
        type: Array,
        default: function () {
          return [goodsTypeEnum.server, goodsTypeEnum.product];
        },
      },
      selectedList: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    data() {
      return {
        loading: false,
        showSelectGoodsDialog: false,
        tableData: [],
        apiUrl: classfiyApi.queryCategoryList,
        queryParams: {
          filterCategoryName: '',
          level: 3,
          type: 0,
        },
        treeProps: {
          nodeKey: 'id',
          label: 'category',
          children: 'childrenCategory',
        },
      };
    },

    computed: {
      computeActiveTab: {
        get() {
          return this.activeTab.type;
        },
      },
    },
    watch: {
      value(newVal, oldVal) {
        this.showSelectGoodsDialog = newVal;
        this.adapterIfmMask(newVal);
      },
      showSelectGoodsDialog(newVal, oldVal) {
        this.$emit('input', newVal);
        this.adapterIfmMask(newVal);
      },
    },

    mounted() {
      this.handleTabChange({ ...this.activeTabs[0], name: this.activeTabs[0].type });
    },

    methods: {
      handleTabChange(targetTab) {
        const goodsType = targetTab.name;
        this.activeTab = goodsTypeEnum[goodsType];
        this.queryParams.type = this.activeTab.value;
      },

      onCategoryChoosed(selectedRows) {
        this.$emit('choosed', selectedRows);
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .el-tabs__nav-wrap {
    padding: 0 20px;
  }
</style>
