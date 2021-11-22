<template>
  <table-select-dialog
    v-model="mShowDialog"
    class="staff-select-dialog"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="apiUrl"
    :selected-list="selectedStaffs"
    :union-keys="['id']"
    :query-params="allQueryParams"
    :limit="limit"
    @choose="onStaffChoosed"
  >
    <div slot="filter" class="coupon-filter">
      <span class="filter-title" style="margin-right: 10px">{{ label }}</span>
      <el-input
        class="filter-input"
        v-model.trim="queryParams.keyword"
        placeholder="输入账号或名称"
        style="width: 200px"
        size="mini"
      >
      </el-input>
    </div>
  </table-select-dialog>
</template>

<script>
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
import constants from '@/dss-wechat3rd/src/constants/index.js';

const columns = [
  {
    prop: 'name',
    label: '名称',
    propsHandler: Handler.propsHanler
  },

  {
    prop: 'phone',
    label: '账号',
    propsHandler: Handler.propsHanler
  }
];
export default {
  name: 'CouponSelectDialog',
  mixins: [dialogMixin],
  components: {
    TableSelectDialog
  },
  props: {
    limit: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      default: '选择员工'
    },
    selectedStaffs: {
      type: Array,
      default: function() {
        return [];
      }
    },
    enableMultiple: {
      type: Boolean,
      default: true
    },
    extParams: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      columns,
      columnsHandler: cols => {
        const that = this;
        return cols.concat({
          align: 'left',
          sortable: false,
          component: ChooseColumn,
          listeners: {
            'choose-item'(couponItem) {
              that.$emit('single-choosed', couponItem);
              that.mShowDialog = false;
            }
          }
        });
      },
      apiUrl: constants.Api.staff.staffList,
      filterStaffName: null,
      queryParams: {
        keyword: '',
        status: 1
      }
    };
  },
  computed: {
    allQueryParams() {
      return { ...this.queryParams, ...(this.extParams || {}) };
    }
  },
  methods: {
    onStaffChoosed(selectedRows) {
      this.$emit('selected', selectedRows);
    }
  }
};
</script>

<style lang="less">
.staff-select-dialog {
  .coupon-filter {
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    padding-bottom: 10px;
    margin-bottom: 19px;
  }
}
</style>
