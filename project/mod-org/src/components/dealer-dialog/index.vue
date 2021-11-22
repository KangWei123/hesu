<template>
  <table-select-dialog
    v-model="isShowDialog"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :columns-handler="columnsHandler"
    :api-url="apiUrl"
    :selected-list="selectedList"
    :union-keys="['batchNo', 'barcode']"
    :query-params="queryParams"
    @choose="onChooseProduct"
  >
  </table-select-dialog>
</template>

<script>
  import { mapState } from 'vuex';
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index';
  import Handler from '@/business-common/components/table-select-dialog/handler';
  import ChooseBtn from '@/business-common/components/table-select-dialog/common-component/chooseBtn';

  // import './index.less';

  /**
   * 选择库存弹窗
   */
  const columns = [
    {
      label: '经销商名称',
      prop: 'dealerName',
      propsHandler: Handler.propsHandler,
    },

    {
      label: '经销商编号',
      prop: 'dealerNo',
      propsHandler: Handler.propsHandler,
      align: 'center',
    },
    {
      label: '负责人',
      prop: 'chargePerson',
      propsHandler: Handler.propsHandler,
      align: 'center',
    },
    {
      label: '门店数',
      prop: 'storeCount',
      propsHandler: Handler.propsHandler,
      align: 'center',
    },
  ];

  export default {
    name: 'StockDialog',

    components: {
      TableSelectDialog,
    },

    props: {
      showDialog: {
        type: Boolean,
        default: false,
      },

      enableMultiple: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {
        columns,
        apiUrl: '/org/dealer/queryList',
        queryParams: {
          dealerName: null,
        },
      };
    },

    computed: {
      ...mapState({
        env: 'env',
      }),
      isShowDialog: {
        get() {
          return this.showDialog;
        },
        set(val) {
          this.$emit('update:showDialog', val);
        },
      },
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
            listeners: {
              'choose-item'(row) {
                _this.isShowDialog = false;
                _this.$emit('single-choosed', row);
              },
            },
          });
        }
      },

      onFilter(filter) {
        this.queryParams = {
          ...this.queryParams,
          ...filter,
          ...this.params,
        };
      },

      onChooseProduct(selectedRows) {
        this.$emit('selected', selectedRows);
      },
    },
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
