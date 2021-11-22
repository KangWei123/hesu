<template>
  <table-select-dialog
    v-model="mShowDialog"
    class="app-select-dialog"
    title="选择应用"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :column-type-props="columnTypeProps"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="handleRequest"
    :selected-list="selectedList"
    :union-keys="['id']"
    :query-params="allQueryParams"
    :limit="limit"
    @choose="onChoosed"
  >
    <div slot="filter" class="app-filter">
      <span class="filter-title" style="margin-right: 10px">应用名称：</span>
      <el-input
        class="filter-input"
        v-model.trim="filter.appName"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        maxlength="30"
        @input="onFilter"
        style="width: 200px"
      />
      <span class="filter-title" style="margin: 0 10px">对应业态：</span>
      <industry-select v-model="filter.industryId" placeholder="请选择业态" @change="onFilter" clearable />
    </div>
  </table-select-dialog>
</template>

<script>
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index';
  import ChooseColumn from '@/business-common/components/table-select-dialog/common-component/chooseBtn';
  import IndustrySelect from '@/business-common/components/industry-select';
  import { sharedAppApi } from '@/business-common/api';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin';
  import columnsConfig from './columns';

  export default {
    name: 'AppSelectDialog',
    mixins: [dialogMixin],
    components: {
      IndustrySelect,
      TableSelectDialog,
    },
    props: {
      limit: {
        type: Number,
        default: 0,
      },
      selectedList: {
        type: Array,
        default: function () {
          return [];
        },
      },
      enableMultiple: {
        type: Boolean,
        default: true,
      },
      extParams: {
        type: Object,
        default: function () {
          return {};
        },
      },
      checkFunction: {
        type: Function,
        default() {
          return true;
        },
      },
      disabledColumn: {
        type: Array,
        default: () => {
          return [];
        },
      },
    },
    watch: {
      disabledColumn: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.columnTypeProps = {
              selection: {
                selectable(row, index) {
                  return !newVal.includes(row.id);
                },
              },
            };
          }
        },
      },
    },
    data() {
      const columns = columnsConfig.default;

      return {
        columns,
        columnsHandler: cols => {
          const that = this;
          return cols.concat({
            align: 'left',
            sortable: false,
            component: ChooseColumn,
            listeners: {
              'choose-item'(item) {
                if (!that.checkFunction(item)) return false;
                that.$emit('single-choosed', item);
                that.mShowDialog = false;
              },
            },
          });
        },
        columnTypeProps: {},
        filter: {
          appName: null,
          industryId: null,
        },
        queryParams: {},
        selectStores: [],
      };
    },
    computed: {
      allQueryParams() {
        return { ...this.queryParams, ...(this.extParams || {}) };
      },
    },
    methods: {
      /**
       * 初始化
       */
      async initial(ids) {
        const { data } = await sharedAppApi.listAllApp();
        return data.filter(i => ids.findIndex(j => String(j) === String(i.id)) !== -1);
      },
      handleRequest(params) {
        return sharedAppApi.listAllApp(params);
      },
      onFilter() {
        this.queryParams = {
          ...this.queryParams,
          ...this.filter,
        };
      },
      onChoosed(selectedRows) {
        this.$emit('selected', selectedRows);
      },
    },
  };
</script>

<style lang="less">
  .app-select-dialog {
    .app-filter {
      border-bottom: 1px solid #dce1e6;
      padding-bottom: 18px;
      padding-left: 20px;
      text-align: left;
      span {
        display: inline-block;
      }
      .filter-input {
        margin: 0px;
      }
    }

    .store-select {
      width: 220px;
    }

    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
      background-color: #f2f6fc !important;
      border-color: #dcdfe6 !important;
    }
  }
</style>
