<template>
  <table-select-dialog
    v-model="mShowDialog"
    class="member-select-dialog"
    title="选择会员"
    :columns="columns"
    :column-type-props="columnTypeProps"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="handleRequest"
    :selected-list="selected"
    :union-keys="['id']"
    :query-params="queryParams"
    :limit="limit"
    :enable-multiple="enableMultiple"
    width="1100px"
    @choose="onChoosed"
  >
    <div slot="filter" class="app-filter">
      <span class="filter-title" style="margin-right: 10px">会员信息：</span>
      <el-input
        class="filter-input"
        v-model.trim="filter.searchKeyWord"
        placeholder="搜索用户名/手机号"
        maxlength="30"
        @input="onFilter"
        style="width: 200px"
      />
      <span class="filter-title" style="margin: 0 10px">会员ID：</span>
      <el-input
        class="filter-input"
        v-model.trim="filter.memberId"
        placeholder="请输入会员ID"
        maxlength="30"
        @input="onFilter"
        style="width: 200px"
      />
    </div>
  </table-select-dialog>
</template>

<script>
  import TableSelectDialog from '@/business-common/components/table-select-dialog/index';
  import ChooseColumn from '@/business-common/components/table-select-dialog/common-component/chooseBtn';
  import memberApi from '@/mod-member/src/api/memberAPI';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin';
  import columnsConfig from './columns';

  /**
   * 批量操作
   */
  export default {
    name: 'SelectMemberDialog',
    components: { TableSelectDialog },
    mixins: [dialogMixin],
    props: {
      selectedList: {
        type: Array,
        default: () => {
          return [];
        },
      },
      disabledColumn: {
        type: Array,
        default: () => {
          return [];
        },
      },
      limit: {
        type: Number,
        default: 0,
      },
      checkFunction: {
        type: Function,
        default() {
          return true;
        },
      },
      enableMultiple: {
        type: Boolean,
        default: false,
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
      selectedList(v) {
        this.selected = v;
      },
    },
    data() {
      return {
        columns: columnsConfig.default,
        columnsHandler: cols => {
          const that = this;
          return cols.concat({
            align: 'left',
            sortable: false,
            component: ChooseColumn,
            disabledTip: '该用户已被选中，无法再次选择',
            canAbled: this.checkFunction,
            listeners: {
              'choose-item'(item) {
                if (!that.checkFunction(item)) return false;
                that.$emit('selected', [item]);
                that.mShowDialog = false;
              },
            },
          });
        },
        columnTypeProps: {},
        selected: [],
        filter: {
          memberId: null,
          searchKeyWord: null,
        },
        queryParams: {},
      };
    },
    methods: {
      show() {
        this.mShowDialog = true;
      },
      onChoosed(selectedRows) {
        this.$emit('selected', selectedRows);
      },
      handleRequest(params) {
        const newPparams = { ...params };
        // 牛逼的后端不改接口，前端修改入参兼容
        if (newPparams.memberId) {
          newPparams.memberIdList = [newPparams.memberId];
        } else {
          newPparams.memberIdList = [];
        }
        // 查询激活会员列表
        return memberApi.memberCenter.getList({ ...newPparams, status: 1 });
      },
      onFilter(...args) {
        this.queryParams = {
          ...this.queryParams,
          ...this.filter,
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .member-select-dialog {
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
