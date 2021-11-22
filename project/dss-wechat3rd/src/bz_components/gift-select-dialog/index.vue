<template>
  <table-select-dialog v-model="mShowDialog"
                       class="coupon-select-dialog"
                       :openRefresh='true'
                       :enable-multiple="enableMultiple"
                       :columns="columns"
                       :columns-handler="enableMultiple ? null : columnsHandler"
                       :api-url="apiUrl"
                       :selected-list="selectedCoupons"
                       :union-keys="['giftNo']"
                       :query-params="allQueryParams"
                       :limit="limit"
                       @choose="onCouponChoosed">
    <div slot="filter"
         class="coupon-filter">
      <span class="coupon-filter-title">同步赠品</span>
      <span class="filter-title" style="margin-right: 10px">赠品名称：</span>
      <el-input class="filter-input"
                prefix-icon="el-icon-search"
                v-model.trim="filterCouponName"
                placeholder="搜索赠品名称"
                maxlength="30"
                @input="onFilter"
                style="width: 200px"
                size="mini"></el-input>
    </div>
  </table-select-dialog>
</template>

<script>
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import NameColumn from './name-column.vue';
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';

const columns = [
  {
    prop: 'name',
    label: '赠品名称',
    component: NameColumn
  },

  {
    prop: 'unit',
    label: '单位',
    propsHandler: Handler.propsHanler
  }
];
export default {
  name: 'giftSelectDialog',
  mixins: [dialogMixin],
  components: {
    TableSelectDialog
  },
  props: {
    limit: {
      type: Number,
      default: 0
    },
    selectedCoupons: {
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
    },
    checkFunction: {
      type: Function,
      default() {
        return true;
      }
    }
  },
  data() {
    return {
      activeTab: true,
      columns,
      columnsHandler: cols => {
        const that = this;
        return cols.concat({
          align: 'left',
          sortable: false,
          component: ChooseColumn,
          listeners: {
            'choose-item'(couponItem) {
              if (!that.checkFunction(couponItem)) return false;
              that.$emit('single-choosed', couponItem);
              that.mShowDialog = false;
            }
          }
        });
      },
      apiUrl: '/wp/gift_activity/listGift',
      filterCouponName: null,
      queryParams: {}
    };
  },
  computed: {
    allQueryParams() {
      return { ...this.queryParams, ...(this.extParams || {}) };
    }
  },
  methods: {
    onFilter() {
      this.queryParams = {
        name: this.filterCouponName
      };
    },
    onCouponChoosed(selectedRows) {
      this.$emit('selected', selectedRows);
    }
  }
};
</script>

<style lang="less">
.coupon-select-dialog {
  .coupon-filter {
    position: relative;
    border-bottom: none;
    // padding-bottom: 10px;
    margin-bottom: 10px;
    padding-left: 24px;
    padding-top: 18px;
    .coupon-filter-title {
      display: block;
      position: absolute;
      height: 26px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #303133;
      line-height: 26px;
      top: -15px;
    }
  }
  .el-table thead th {
    .cell {
      text-align: left;
    }
  } 
  .el-table {
    padding-top: 0px;
  }
}
</style>
