<template>
  <el-form class="filter-form order-filter-container">
    <!-- 订单号 -->
    <el-form-item label="订购搜索:" label-width="80px" v-if="showCustomizeOrderNo">
      <el-input class="order-search" v-model.trim="customizeOrderNo" placeholder="请输入订购单号"></el-input>
    </el-form-item>

    <!-- 订单号 -->
    <el-form-item label="订单搜索:" label-width="80px" v-if="!showCustomizeOrderNo">
      <el-input class="order-search" v-model.trim="orderNo" placeholder="请输入订单号"></el-input>
    </el-form-item>

    <!-- 退款单号 -->
    <el-form-item label="退款搜索:" label-width="80px" v-if="showRefundOrderNo">
      <el-input class="order-search" v-model.trim="refundOrderNo" placeholder="请输入退款单号"></el-input>
    </el-form-item>

    <!-- 出库单号 -->
    <el-form-item label="出库搜索:" label-width="80px" v-if="showOutBoundNo">
      <el-input class="order-search" v-model.trim="outBoundNo" placeholder="请输入出库单号"></el-input>
    </el-form-item>

    <!-- 物流单号 -->
    <el-form-item label="物流搜索:" label-width="80px" v-if="showOutBoundNo">
      <el-input class="order-search" v-model.trim="shippingNo" placeholder="请输入物流单号"></el-input>
    </el-form-item>

    <!-- 商品名称 -->
    <el-form-item :label="`${goodsLabel}名称:`" label-width="80px" v-if="showItemName">
      <el-input
        class="order-search"
        v-model.trim="itemName"
        placeholder="请输入"
        @input="checkFilterParam('itemName', 10, true)"
      ></el-input>
    </el-form-item>

    <!-- 手机号码 -->
    <el-form-item label="手机号码:" label-width="80px" v-if="showPhone">
      <el-input
        class="order-search"
        v-model.trim="phone"
        @input="checkFilterParam('phone', 11)"
        @keyup.enter.native="onPhoneSearch"
        placeholder="请输入会员手机号码"
      ></el-input>
    </el-form-item>

    <el-form-item label="姓名搜索:" label-width="80px" v-if="showKeyword">
      <el-input
        class="order-search"
        v-model.trim="keyword"
        @input="checkFilterParam('keyword', 11)"
        @keyup.enter.native="onPhoneSearch"
        placeholder="请输入收件人手机或姓名"
      ></el-input>
    </el-form-item>

    <el-form-item label="手机号码:" label-width="80px" v-if="showUserKeyword">
      <el-input
        class="order-search"
        v-model.trim="userKeyword"
        @input="checkFilterParam('userKeyword', 11)"
        @keyup.enter.native="onPhoneSearch"
        placeholder="请输入会员手机号码"
      ></el-input>
    </el-form-item>

    <!-- 订单类型 -->
    <el-form-item label-width="80px" label="订单类型:" v-if="showOrderTypes">
      <el-select v-model="itemType" @change="onOrderTypeChange" placeholder="所有订单">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in orderTypes"
          :key="item.type"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 营销订单类型 -->
    <el-form-item label-width="80px" label="营销类型:" v-if="showPreSell">
      <el-select v-model="marketingID" @change="onMarketingTypeChange" placeholder="所有订单">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in marketingTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label-width="80px" label="代客下单:" v-if="showValetSell">
      <el-select v-model="valetSell" @change="onValetTypeChange" clearable placeholder="代客下单类型">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in valetSellTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label-width="80px" label="物流类型:" v-if="showDeliveryTypes">
      <el-select v-model="shippingType" @change="onDeliveryTypeChange" placeholder="物流类型">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in deliveryTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <!-- 订单归属 -->
    <el-form-item label-width="80px" label="订单归属:" v-if="showEmployee">
      <el-select v-model="employeeIds" @change="onEmployeeIdsChange" filterable clearable placeholder="请选择导购">
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

    <!-- 支付模式 -->
    <el-form-item label-width="80px" label="支付模式:" v-if="showOrderTypes">
      <el-select v-model="queryFrontMoney" @change="onFrontMoneyChange">
        <el-option class="dss-query-select-dropdown__item" label="全部" :value="null"> </el-option>
        <el-option class="dss-query-select-dropdown__item" label="全额模式" :value="false"> </el-option>
        <el-option class="dss-query-select-dropdown__item" label="定金模式" :value="true"> </el-option>
        <!-- <el-option class="dss-query-select-dropdown__item" label="积分模式" :value="true"> </el-option> -->
      </el-select>
    </el-form-item>

    <!-- 订单渠道 -->
    <el-form-item label-width="80px" label="订单渠道:" v-if="showOrderChannel">
      <el-select v-model="channel" @change="onFilter" placeholder="全部渠道">
        <el-option
          class="dss-query-select-dropdown__item"
          v-for="item in channelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label-width="80px" label="选择门店:" v-if="showStoreFilter && (isManager || isMultiStoreManager)">
      <store-select
        ref="storeSelect"
        :select-stores.sync="checkedDepList"
        :show-dept="isManager"
        :show-store="isMultiStoreManager"
        class="store-select"
        @change="onFilter"
      />
    </el-form-item>

    <el-form-item label-width="80px" label="下单时间:">
      <el-date-picker
        class="dss-filter-input"
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        @change="onQueryTimeChange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item v-if="showPreSell">
      <el-checkbox v-model="preSell" @change="onFilter">预售订单</el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" size="small" class="search-btn" @click="onPhoneSearch">搜索</el-button>
      <el-button size="small" @click="reset">重置</el-button>
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
    name: 'OrderFilter',
    components: {
      StoreSelect,
    },
    props: {
      filterType: {
        type: String,
        default: 'order',
      },
      goodsLabel: {
        type: String,
        default: '商品',
      },
      guideList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dateRange: null,
        orderNo: null,
        refundOrderNo: null,
        outBoundNo: null,
        customizeOrderNo: null,
        itemName: null,
        itemType: null,
        itemTypeList: null,
        marketingID: null,
        phone: null,
        keyword: null,
        userKeyword: null,
        queryFrontMoney: null,
        employeeIds: null,
        preSell: false,
        valetSell: null,
        tag3: null,
        shippingNo: null,
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                // start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        // 物流方式
        shippingType: '',
        deliveryTypes: [
          {
            label: '全部方式',
            value: 'all',
          },
          {
            label: '门店自提',
            value: orderStatusEnum.express_type.self_extraction,
          },
          {
            label: '同城配送',
            value: orderStatusEnum.express_type.city_delivery,
          },
          {
            label: '快递',
            value: orderStatusEnum.express_type.express,
          },
        ],

        // 订单渠道
        channel: null,
        channelOptions: [
          {
            value: null,
            label: '全部渠道',
          },
          ...Object.values(cardPackCHANNEL),
        ],
        checkedDepList: [],
      };
    },

    computed: {
      ...mapState({
        storeList: state => state.storeList,
        roleList: 'roleList',
      }),

      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },

      // 经销商 或 区管 或 运营
      isMultiStoreManager() {
        const isAreaManager = !!~this.roleList.split(',').indexOf('common_role_area_manager');
        const isDealer = !!~this.roleList.split(',').indexOf('common_role_dealer_manager');
        const isOperator = !!~this.roleList.split(',').indexOf('common_role_operator');
        return isAreaManager || isDealer || isOperator;
      },

      // 根据行业类型获取订单类型
      orderTypes() {
        let orderTypes = null;
        if (this.$store.state.env.RETAIL) {
          orderTypes = [
            {
              type: 'all',
              value: '',
              label: '所有订单',
            },
            orderStatusEnum.ORDER_TYPE.PRODUCT,
            orderStatusEnum.ORDER_TYPE.GROUP,
            orderStatusEnum.ORDER_TYPE.GIFT,
            orderStatusEnum.ORDER_TYPE.CUSTOM_GOODS,
          ];
        } else {
          orderTypes = [
            {
              type: 'all',
              value: '',
              label: '所有订单',
            },
            orderStatusEnum.ORDER_TYPE.PRODUCT,
            orderStatusEnum.ORDER_TYPE.GROUP,
            orderStatusEnum.ORDER_TYPE.NUM_CARD,
            orderStatusEnum.ORDER_TYPE.GIFT,
            orderStatusEnum.ORDER_TYPE.CUSTOM_GOODS,
          ];
        }
        // 储值列表：充值卡和手动充值
        if (this.filterType === 'storedVal') {
          orderTypes = [
            {
              type: 'all',
              value: '',
              label: '所有订单',
            },
            orderStatusEnum.ORDER_TYPE.CHARGE,
            orderStatusEnum.ORDER_TYPE.MANUAL_CHARGE,
          ];
        }
        return orderTypes;
      },

      // 查询营销订单
      marketingTypes() {
        const marketingTypes = [
          {
            type: 'all',
            value: '',
            label: '所有订单',
          },
          orderStatusEnum.MARKETING_ORDER.GROUP,
          orderStatusEnum.MARKETING_ORDER.SECKILL,
          orderStatusEnum.MARKETING_ORDER.HAGGLE,
          orderStatusEnum.MARKETING_ORDER.INTEGRAL,
          orderStatusEnum.MARKETING_ORDER.DISTRIBUTION,
          orderStatusEnum.MARKETING_ORDER.XYFOLD,
          orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT,
          orderStatusEnum.MARKETING_ORDER.ONEPRICE,
        ];

        return marketingTypes;
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
       * 是否展示退款单号搜索
       */
      showRefundOrderNo() {
        if (this.filterType === 'refund-order') {
          return true;
        }
        return false;
      },

      /**
       * 是否展示出库单号搜索
       */
      showOutBoundNo() {
        if (this.filterType === 'order' || this.filterType === 'refund-order') {
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
       * 是否展示代客订单搜索
       */
      showValetSell() {
        if (this.filterType === 'order' || this.filterType === 'refund-order') {
          return true;
        }
        return false;
      },

      /**
       * 是否展示订单归属
       */
      showEmployee() {
        if (this.filterType === 'order' || this.filterType === 'refund-order') {
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
      showKeyword() {
        if (this.filterType === 'order' || this.filterType === 'refund-order' || this.filterType === 'micro_order') {
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
      },

      /**
       * 是否展示物流方式搜索
       */
      showDeliveryTypes() {
        if (this.filterType === 'order') {
          return true;
        }
        return false;
      },

      /**
       * 是否展示订单渠道搜索
       */
      showOrderChannel() {
        return this.filterType === 'card-pack';
      },

      valetSellTypes() {
        return [
          {
            label: '全部代客下单',
            value: 'all',
          },
          {
            label: '代客下单线下付款',
            value: 64,
          },
          {
            label: '代客下单线上付款',
            value: 2,
          },
        ];
      },

      showStoreFilter() {
        const showType = ['order', 'storedVal', 'giftCard', 'card-pack', 'refund-order'];
        return !!~showType.indexOf(this.filterType);
      },
    },
    watch: {
      // 校验订购单号进行实时模糊查询
      customizeOrderNo(newVal, gldVal) {
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
      },
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
          const types = [];
          this.orderTypes.forEach(item => {
            if (item.value || item.value === 0) {
              types.push(item.value);
            }
          });
          this.itemTypeList = types;
        }
        this.onFilter();
      },

      onMarketingTypeChange(e) {
        this.onFilter();
      },

      onValetTypeChange() {
        this.onFilter();
      },

      onFrontMoneyChange() {
        this.onFilter();
      },

      onEmployeeIdsChange() {
        this.onFilter();
      },

      // 根据手机号码进行查询
      onPhoneSearch() {
        if (!!this.phone && !/^1[3|4|5|6|7|8][0-9]\d{8}$/.test(this.phone)) {
          this.$message.error('请输入正确的手机号码');
          return;
        }
        this.onFilter();
      },
      reset() {
        this.customizeOrderNo = null;
        this.orderNo = null;
        this.refundOrderNo = null;
        this.outBoundNo = null;
        this.shippingNo = null;
        this.itemName = null;
        this.phone = null;
        this.keyword = null;
        this.userKeyword = null;
        this.itemType = null;
        this.marketingID = null;
        this.valetSell = null;
        this.shippingType = null;
        this.employeeIds = null;
        this.queryFrontMoney = null;
        this.channel = null;
        this.dateRange = null;
        this.preSell = null;
        if (this.checkedDepList.length !== 0) {
          this.$refs.storeSelect.reset();
        }
        this.onPhoneSearch();
        this.onOrderTypeChange();
      },
      // 根据物流方式进行查询
      onDeliveryTypeChange() {
        this.onFilter();
      },

      // 改变查询条件通知父组件进行查询
      onFilter() {
        const filterParams = {};

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

        // 订单编号
        if (this.orderNo) {
          filterParams.orderNo = this.orderNo;
        }

        // 退款单号
        if (this.refundOrderNo) {
          filterParams.refundOrderNo = this.refundOrderNo;
        }

        // 出库单号
        if (this.outBoundNo) {
          filterParams.outBoundNo = this.outBoundNo;
        }

        // 商品名称
        if (this.itemName) {
          filterParams.itemName = this.itemName;
        }

        // 预售订单，判断只有展示预售订单搜索时才添加preSell为请求参数
        if (this.showPreSell) {
          filterParams.preSell = this.preSell ? 1 : 0;
        }

        // 代客订单，判断只有展示代客订单搜索时才添加valetSell为请求参数
        if (this.showValetSell) {
          if (this.valetSell === 'all') {
            // 全部
            filterParams.queryAllValetOrder = true;
          } else if (this.valetSell === 2) {
            // 线上
            filterParams.tag3 = 2;
          } else if (this.valetSell === 64) {
            // 线下
            filterParams.tag3 = 4;
          }
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

        // 收货人手机号码
        if (this.keyword) {
          filterParams.keyword = this.keyword;
        }

        // 会员手机号码
        if (this.userKeyword) {
          filterParams.userKeyword = this.userKeyword;
        }

        // 物流方式
        if (this.shippingType !== '' && this.shippingType !== 'all') {
          filterParams.shippingType = this.shippingType;
        }

        // 物流单号
        if (this.shippingNo) {
          filterParams.shippingNo = this.shippingNo;
        }

        // 定金
        filterParams.queryFrontMoney = this.queryFrontMoney;

        // 导购id
        filterParams.employeeIds = this.employeeIds;

        // 营销类型订单
        filterParams.marketingID = this.marketingID;

        // 促销活动类型
        if (filterParams.marketingID === orderStatusEnum.MARKETING_ORDER.XYFOLD.value) {
          filterParams.marketingID = orderStatusEnum.MARKETING_ORDER.XYFOLD.type;
          filterParams.marketingTag = orderStatusEnum.MARKETING_ORDER.XYFOLD.tag;
        }

        if (filterParams.marketingID === orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.value) {
          filterParams.marketingID = orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.type;
          filterParams.marketingTag = orderStatusEnum.MARKETING_ORDER.FULLXDISCOUNT.tag;
        }

        if (filterParams.marketingID === orderStatusEnum.MARKETING_ORDER.ONEPRICE.value) {
          filterParams.marketingID = orderStatusEnum.MARKETING_ORDER.ONEPRICE.type;
          filterParams.marketingTag = orderStatusEnum.MARKETING_ORDER.ONEPRICE.tag;
        }
        // 订单渠道
        filterParams.channel = this.channel;

        // 选中门店
        if (this.showStoreFilter && (this.isManager || this.isMultiStoreManager)) {
          filterParams.storeIds = (this.checkedDepList || []).join(',') || null;
        }

        // console.log(filterParams);
        this.$emit('filter', filterParams);
      },
    },
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
    .order-search,
    .el-select {
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
