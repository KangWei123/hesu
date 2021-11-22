<template>
  <el-form inline>
    

    <!-- 商品名称 -->
    <el-form-item v-if="showItemName" label="活动名称：">
      <el-input class="order-search"
                v-model.trim="marketingName"
                placeholder="活动名称搜索"
                @input="checkFilterParam('marketingName', 10, true)"></el-input>
    </el-form-item>

    <!-- 手机号码 -->
    <el-form-item v-if="showPhone" label="是搜集号码：">
      <el-input class="order-search"
                v-model.trim="phone"
                @input="checkFilterParam('phone', 11)"
                @keyup.enter.native="onPhoneSearch"
                placeholder="请输入会员手机号码"></el-input>
    </el-form-item>

    <el-form-item v-if="showUserKeyword" label="手机号码：">
      <el-input class="order-search"
                v-model.trim="userKeyword"
                @input="checkFilterParam('userKeyword', 11)"
                @keyup.enter.native="onPhoneSearch"
                placeholder="请输入会员手机号码"></el-input>
    </el-form-item>

    <!-- 订单号 -->
    <el-form-item v-if="!showCustomizeOrderNo" label="订单号：">
      <el-input class="order-search"
                style="width: 200px;"
                v-model.trim="orderNo"
                placeholder="订单号搜索"></el-input>
    </el-form-item>

    <el-form-item label="订单时间:">
      <el-date-picker class="dss-filter-input"
                      v-model="dateRange"
                      type="daterange"
                      range-separator="至"
                      @change="onQueryTimeChange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions">
      </el-date-picker>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 class="search-btn"
                 @click="onPhoneSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import utils from '@/dss-common/utils';
import regex from '@/dss-common/utils/regexps';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';
import orderFilterDateRange from './orderFilterDateRange';

export default {
  name: 'OrderFilter',
  components: {
    orderFilterDateRange
  },
  props: {
    filterType: {
      type: String,
      default: 'order'
    },
    marketingType: {
      type: [Object, Array],
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      dateRange: null,
      orderNo: null,
      refundOrderNo: null,
      outBoundNo: null,
      customizeOrderNo: null,
      marketingName: null,
      itemType: null,
      itemTypeList: null,
      marketingID: null,
      phone: null,
      keyword: null,
      userKeyword: null,
      preSell: false,
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
      }
    };
  },

  computed: {
    //根据行业类型获取订单类型
    orderTypes() {
      let orderTypes = null;
      if (this.$store.state.env.RETAIL) {
        orderTypes = [
          {
            type: 'all',
            value: '',
            label: '所有订单'
          },
          orderStatusEnum.ORDER_TYPE.PRODUCT,
          orderStatusEnum.ORDER_TYPE.GROUP,
          orderStatusEnum.ORDER_TYPE.GIFT
        ];
      } else {
        orderTypes = [
          {
            type: 'all',
            value: '',
            label: '所有订单'
          },
          orderStatusEnum.ORDER_TYPE.PRODUCT,
          orderStatusEnum.ORDER_TYPE.GROUP,
          orderStatusEnum.ORDER_TYPE.NUM_CARD,
          orderStatusEnum.ORDER_TYPE.GIFT
        ];
      }
      //储值列表：充值卡和手动充值
      if (this.filterType === 'storedVal') {
        orderTypes = [
          {
            type: 'all',
            value: '',
            label: '所有订单'
          },
          orderStatusEnum.ORDER_TYPE.CHARGE,
          orderStatusEnum.ORDER_TYPE.MANUAL_CHARGE
        ];
      }
      return orderTypes;
    },

    // 查询的时间类型
    timeType() {
      return this.filterType === 'order' ? '下单' : '退款';
    },

    /**
     * 是否展示订购单号搜索，否则展示订单号搜索
     */
    showCustomizeOrderNo() {
      if (this.filterType === 'micro_order') {
        return true;
      }
      return false;
    },

    /**
     * 是否展示商品名称搜索
     */
    showItemName() {
      if (this.filterType === 'offline') {
        return false;
      }
      return true;
    },

    /**
     * 是否展示订单类型搜索
     */
    showOrderTypes() {
      if (this.filterType === 'order' || this.filterType === 'storedVal') {
        return true;
      }
      return false;
    },

    /**
     * 是否展示预售订单搜索
     */
    showPreSell() {
      if (this.filterType === 'order') {
        return true;
      }
      return false;
    },

    /**
     * 是否展示会员手机号码搜索
     */
    showPhone() {
      if (this.filterType === 'refund-order') {
        return true;
      }
      return false;
    },

    /**
     * 是否展示收件人手机号码或姓名搜索
     */
    showUserKeyword() {
      if (this.filterType === 'refund-order') {
        return false;
      }
      return true;
    }
  },
  watch: {
    // 校验订购单号进行实时模糊查询
    customizeOrderNo(newVal, oldVal) {
      if (newVal || newVal === '') {
        // 订单号最大长度为19，所以截取19个字符
        if (newVal.length > 19) {
          this.customizeOrderNo = newVal.substr(0, 19);
        }
        this.$nextTick(() => {
          this.customizeOrderNo = regex.limitNumberInput(this.customizeOrderNo);
          this.onFilter();
        });
      }
    },

    // 校验订单号进行实时模糊查询
    orderNo(newVal, oldVal) {
      if (newVal || newVal === '') {
        // 订单号最大长度为19，所以截取19个字符
        if (newVal.length > 19) {
          this.orderNo = newVal.substr(0, 19);
        }
        this.$nextTick(() => {
          this.orderNo = regex.limitNumberInput(this.orderNo);
          this.onFilter();
        });
      }
    },

    // 校验退款单号进行实时模糊查询
    refundOrderNo(newVal, oldVal) {
      if (newVal || newVal === '') {
        // 退款单号最大长度为19，所以截取19个字符
        if (newVal.length > 19) {
          this.refundOrderNo = newVal.substr(0, 19);
        }
        this.$nextTick(() => {
          this.refundOrderNo = regex.limitNumberInput(this.refundOrderNo);
          this.onFilter();
        });
      }
    },

    // 校验出库单号进行实时模糊查询
    outBoundNo(newVal, oldVal) {
      if (newVal || newVal === '') {
        // 出库单号最大长度为19，所以截取19个字符
        if (newVal.length > 19) {
          this.outBoundNo = newVal.substr(0, 19);
        }
        this.$nextTick(() => {
          this.outBoundNo = regex.limitNumberInput(this.outBoundNo);
          this.onFilter();
        });
      }
    }
  },

  mounted() {
    if (this.filterType === 'order') {
      this.onOrderTypeChange('');
    }
  },

  methods: {
    // 校验输入字段搜索进行实时模糊查询(不包括字段校验)
    checkFilterParam(param, maxlength, isQuery = false) {
      // 参数存在，且最大长度为maxlength，所以截取maxlength个字符
      if (this[param] && this[param].length > maxlength) {
        this[param] = this[param].substr(0, maxlength);
      }
      // 判断是否实时查询
      if (isQuery) {
        this.onFilter();
      }
    },

    // 根据下单时间进行查询
    onQueryTimeChange(date) {
      this.dateRange = date;
      this.onFilter();
    },

    // 根据订单类型进行查询
    onOrderTypeChange(val) {
      // val = 0 为预售订订单
      if (val || val === 0) {
        this.itemTypeList = [val];
      } else {
        let types = [];
        this.orderTypes.forEach(item => {
          if (item.value || item.value === 0) {
            types.push(item.value);
          }
        });
        this.itemTypeList = types;
      }
      this.onFilter();
    },

    onMarketingTypeChange() {
      this.onFilter();
    },

    onFrontMoneyChange() {
      this.onFilter();
    },

    // 根据手机号码进行查询
    onPhoneSearch() {
      // if (!!this.phone && !/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.phone)) {
      //   this.$message.error('请输入正确的手机号码');
      //   return;
      // }
      this.onFilter();
    },

    // 改变查询条件通知父组件进行查询
    onFilter() {
      let filterParams = {};

      if (this.customizeOrderNo) {
        const reg = /^\d{1,20}$/g;
        if (!!this.customizeOrderNo && !reg.test(this.customizeOrderNo)) {
          this.$message.error('请输入正确的订购单号');
          return;
        }
      }

      // 下单时间
      if (this.dateRange) {
        filterParams.startDate = utils.timeFormat(this.dateRange[0], 'YYYY-MM-DD');
        filterParams.endDate = utils.timeFormat(this.dateRange[1], 'YYYY-MM-DD');
      }

      // 订单编号
      if (this.orderNo) {
        filterParams.orderNo = this.orderNo;
      }

      if (this.marketingName) {
        filterParams.marketingName = this.marketingName;
      }

      // 订单类型
      if (this.itemTypeList) {
        this.itemTypeList.forEach((item, index) => {
          filterParams['itemTypeList[' + index + ']'] = item;
        });
      }

      // 手机号码
      if (this.phone) {
        filterParams.phone = this.phone;
      }

      // 会员手机号码
      if (this.userKeyword) {
        filterParams.userKeyword = this.userKeyword;
      }

      //console.log(filterParams);
      this.$emit('filter', filterParams);
    }
  }
};
</script>

<style lang="less">
.order-filter-container {
  font-size: 12px;
  position: relative;

  .filter-tab {
    display: inline-block;
    margin-left: 30px;
    vertical-align: middle;
  }
  .filter-tab:first-child {
    margin-left: 0px;
  }
  .order-search {
    width: 200px;
  }
}
</style>
