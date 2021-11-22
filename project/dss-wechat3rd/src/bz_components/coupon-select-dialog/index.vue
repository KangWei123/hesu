<template>
  <table-select-dialog
    v-model="mShowDialog"
    class="coupon-select-dialog"
    :enable-multiple="enableMultiple"
    :columns="columns"
    :columns-handler="enableMultiple ? null : columnsHandler"
    :api-url="apiUrl"
    :selected-list="selectedCoupons"
    :union-keys="['id']"
    :query-params="allQueryParams"
    :limit="limit"
    @choose="onCouponChoosed"
  >
    <div slot="filter" class="coupon-filter">
      <span class="filter-title">选择优惠券：</span>
      <el-input
        class="filter-input"
        v-model.trim="filterCouponName"
        placeholder="搜索优惠券名称"
        maxlength="30"
        @input="onFilter"
        style="width: 200px"
      ></el-input>
      <template v-if="isShowStores">
        <span class="filter-title" style="margin: 0 10px">活动门店</span>
        <store-select
          :select-stores.sync="selectStores"
          :show-dept="isEnterManger"
          :show-store="!isEnterManger"
          class="store-select"
          @change="onFilter"
        />
      </template>
    </div>
  </table-select-dialog>
</template>

<script>
  import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
  import ChooseColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
  import dialogMixin from '@/dss-common/mixins/dialog-mixin.js';
  import columnsConfig from './columnsConfig';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

  export default {
    name: 'CouponSelectDialog',
    mixins: [dialogMixin],
    components: {
      TableSelectDialog,
      StoreSelect,
    },
    props: {
      limit: {
        type: Number,
        default: 0,
      },
      selectedCoupons: {
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
      type: {
        type: String,
        default: '',
      },
      // 是否显示门店选择
      isShowStores: {
        type: Boolean,
        default: false,
      },
      // 是否管理员，管理员展示组织架构选择
      isEnterManger: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      const type = this.type || 'default';

      let columns = columnsConfig[type];
      if (type === 'coupon-v2') columns = columnsConfig.default;
      const url = {
        default: '/wp/coupon/list',
        lucky: '/wp/coupon/list',
        'card-pack': '/wp/coupon/listDetial',
        'coupon-v2': '/wp/coupon/listV2', // 优惠券权限改造需求
      }[type];

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
                if (!that.checkFunction(couponItem)) return false;
                that.$emit('single-choosed', couponItem);
                that.mShowDialog = false;
              },
            },
          });
        },
        apiUrl: url,
        filterCouponName: null,
        queryParams: {
          status: couponEnum.status.VALID,
          couponCentreStatus: 0, // 默认筛选营销专用优惠券
        },
        selectStores: [],
      };
    },
    computed: {
      allQueryParams() {
        return { ...this.queryParams, ...(this.extParams || {}) };
      },
    },
    methods: {
      onFilter() {
        this.queryParams = {
          ...this.queryParams,
          name: this.filterCouponName,
        };
        if (this.isShowStores) this.queryParams.storeIds = this.selectStores.toString() || null;
      },
      onCouponChoosed(selectedRows) {
        this.$emit('selected', selectedRows);
      },
    },
  };
</script>

<style lang="less">
  .coupon-select-dialog {
    .coupon-filter {
      border-bottom: 1px solid rgba(235, 235, 235, 1);
      padding-bottom: 10px;
      margin-bottom: 19px;
      text-align: left;
      span {
        display: inline-block;
      }
      .filter-input {
        margin: 0px;
      }
      .filter-title {
        margin: 0 10px;
      }
    }

    .store-select {
      width: 220px;
    }
  }
</style>
