<template>
  <table-select-dialog v-model="mShowDialog"
                       class="coupon-select-dialog"
                       :enable-multiple="enableMultiple"
                       :columns="columns"
                       :columns-handler="enableMultiple ? null : columnsHandler"
                       :api-url="apiUrl"
                       :selected-list="selectedCoupons"
                       :union-keys="['id']"
                       :query-params="allQueryParams"
                       :limit="limit"
                       @choose="onCouponChoosed">

    <div slot="filter"
         class="coupon-filter">
      <span class="filter-title"
            style="margin-right: 10px">选择充值卡</span>
      <!-- todo 需要后端接口 -->
      <!-- <el-input class="filter-input"
                v-model.trim="filterChargeName"
                placeholder="搜索充值卡名称"
                @input="onFilter"
                style="width: 200px"
                size="mini">
      </el-input> -->
    </div>
  </table-select-dialog>
</template>

<script>
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import PriceColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/priceColumn.vue';
import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';

const columns = [
  {
    prop: 'name',
    label: '名称',
    propsHandler: Handler.propsHanler
  },

  {
    prop: 'salePrice',
    label: '充值卡面值',
    component: PriceColumn
  },

  {
    prop: 'giftAmount',
    label: '赠送金额',
    component: PriceColumn
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
      apiUrl: '/wp/wx_item_card/query_list',
      filterChargeName: null,
      queryParams: {
        status: couponEnum.status.VALID,
        type: 4
      }
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
        name: this.filterChargeName
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
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    padding-bottom: 10px;
    margin-bottom: 19px;
  }
}
</style>
