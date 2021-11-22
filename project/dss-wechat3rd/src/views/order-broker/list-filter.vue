<template>
  <el-form inline class="filter-container">

    <!-- 代客订单编号 -->
    <el-form-item label="代客订单号:" label-width="90px">
      <el-input
        class="order-search"
        style="width: 200px;"
        v-model.trim="filter.valetOrderNoStr"
        placeholder="代客订单编号搜索"
      ></el-input>
    </el-form-item>

    <!-- 线上订单号 -->
    <el-form-item label="订单号:" label-width="90px">
      <el-input
        class="order-search"
        style="width: 200px;"
        v-model.trim="filter.orderNoStr"
        placeholder="订单号搜索"
      ></el-input>
    </el-form-item>

    <!-- 手机号码 -->
    <el-form-item label="号码搜索:" label-width="90px">
      <el-input
        class="order-search"
        v-model.trim="filter.userPhone"
        placeholder="会员（客户）手机号码"
      ></el-input>
    </el-form-item>

    <!-- 订单归属 -->
    <el-form-item label="订单归属:" label-width="90px">
      <el-select v-model="filter.guideId" filterable clearable placeholder="请选择导购" @change="onSearch">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in guideList"
          :key="item.id"
          :label="item.name || item.cropName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 审核人员 -->
    <el-form-item label="审核人:" label-width="90px">
      <el-select v-model="filter.storeKeeperId" filterable clearable placeholder="请选择审核人" @change="onSearch">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in storeKeeperList"
          :key="item.id"
          :label="item.name || item.cropName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 订单类型 -->
    <el-form-item label="支付模式:" label-width="90px">
      <el-select v-model="filter.paymentMethod" @change="onSearch">
        <el-option class="dss-query-select-dropdown__item" label="全部" :value="null"> </el-option>

        <el-option class="dss-query-select-dropdown__item" label="线上支付" :value="0" />
        <el-option class="dss-query-select-dropdown__item" label="线下支付" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item label="选择门店:" label-width="90px" v-if="isManager || isMultiStoreManager">
      <store-select
        :select-stores.sync="checkedDepList"
        :show-dept="isManager"
        :show-store="isMultiStoreManager"
        class="store-select"
        @change="onSearch" />
    </el-form-item>

    <el-form-item label="下单时间:" label-width="90px">
      <el-date-picker
        class="dss-filter-input"
        v-model="filter.dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="onSearch"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" class="search-btn" @click="onSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import utils from '@/dss-common/utils';
import regex from '@/dss-common/utils/regexps';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import { CHANNEL as cardPackCHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum';
import { mapState } from 'vuex';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

export default {
  components: { StoreSelect },
  props: {
    guideList: {
      type: Array,
      default: () => []
    },
    storeKeeperList: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      filter: {
        guideId: null,
        dateRange: null,
        valetOrderNoStr: '',
        userPhone: '',
        paymentMethod: null,
        orderNoStr: '',
        storeKeeperId: null,
        storeIdList: null
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      checkedDepList: []
    };
  },

  computed: {
    ...mapState({
      storeList: state => state.storeList,
      roleList: 'roleList'
    }),
    // 管理员
    isManager() {
      return !!~this.roleList.split(',').indexOf('common_role_enterprise');
    },
    // 经销商 或 区管
    isMultiStoreManager() {
      const isAreaManager = !!~this.roleList.split(',').indexOf('common_role_area_manager');
      const isDealer = !!~this.roleList.split(',').indexOf('common_role_dealer_manager');
      const isOperator = !!~this.roleList.split(',').indexOf('common_role_operator');
      return isAreaManager || isDealer || isOperator;
    }
  },

  methods: {
    onSearch() {
      this.filter.startDate = null;
      this.filter.endDate = null;

      if (this.filter.dateRange && this.filter.dateRange.length === 2) {
        this.filter.startDate = utils.timeFormat(this.filter.dateRange[0], 'YYYY-MM-DD');
        this.filter.endDate = utils.timeFormat(this.filter.dateRange[1], 'YYYY-MM-DD');
      }

      // 选中门店
      if (this.isManager || this.isMultiStoreManager) {
        this.filter.storeIdList = (this.checkedDepList || []).join(',') || null;
      }

      this.$emit('filter', this.filter);
    }
  }
};
</script>

<style lang="less">
.filter-container {
  font-size: 12px;
  position: relative;
  padding: 16px 24px;

  .filter-tab {
    display: inline-block;
    margin-left: 30px;
    vertical-align: middle;
  }
  .filter-tab:first-child {
    margin-left: 0px;
  }
  .order-search, .el-select {
    width: 200px;
  }
}

.filter-select-store {
  width: 200px;

  .el-input.el-input--suffix {
    width: 200px;
  }
}
</style>
