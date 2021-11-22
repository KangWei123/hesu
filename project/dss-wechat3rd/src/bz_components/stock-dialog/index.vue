<template>
  <table-select-dialog v-model="isShowDialog"
                       enable-multiple
                       :columns="columns"
                       :api-url="apiUrl"
                       :selected-list="selectedList"
                       :union-keys="['batchNo', 'barcode']"
                       :query-params="queryParams"
                       @choose="onChooseProduct">

    <goods-list-filter :goods-type="goodsTypeEnum.product"
                       slot="filter"
                       class="list-filter"
                       @filter="onFilter" />

  </table-select-dialog>
</template>

<script>
import { mapState } from 'vuex';
import GoodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import GoodsNameColumn from './goodsNameColumn.vue';
import bathColumn from './bathColumn.vue';

// import './index.less';

/**
 * 选择库存弹窗
 */
const columns = [
  {
    label: '名称',
    prop: 'itemName',
    width: 250,
    component: GoodsNameColumn
  },

  {
    label: '单位',
    prop: 'itemUnit',
    propsHandler: Handler.propsHandler
  },

  {
    label: '批次',
    prop: 'batchNo',
    component: bathColumn
  },

  {
    label: '实物库存',
    prop: 'stock',
    propsHandler: Handler.propsHandler,
    align: 'center'
  },

  {
    label: '可用库存',
    prop: 'usableStock',
    propsHandler: Handler.propsHandler,
    align: 'center'
  }
];

export default {
  name: 'stock-dialog',

  components: {
    GoodsListFilter,
    TableSelectDialog
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },

    enableMultiple: {
      type: Boolean,
      default: false
    },

    selectedList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    params: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  data() {
    return {
      goodsTypeEnum,
      columns,
      apiUrl: '/wp/warehouse/stock/list',
      queryParams: {
        status: 1,
        type: 1
      }
    };
  },

  computed: {
    ...mapState({
      env: 'env'
    }),
    isShowDialog: {
      get() {
        return this.showDialog;
      },
      set(val) {
        this.$emit('update:showDialog', val);
      }
    }
  },

  watch: {
    params: function(newVal, oldVal) {
      if (!!newVal) {
        this.queryParams = {
          ...this.queryParams,
          ...this.params
        };
      }
    }
  },

  methods: {
    onFilter(filter) {
      this.queryParams = {
        ...this.queryParams,
        ...filter,
        ...this.params
      };
    },

    onChooseProduct(selectedRows) {
      this.$emit('selected', selectedRows);
    }
  }
};
</script>

<style lang="less" scoped>
.list-filter {
  margin-left: 32px;
}
.goodsDialog {
  /deep/ .el-dialog__headerbtn {
    z-index: 123;
  }
}
</style>
