<template>
  <div class="left">
    <dashbord :fields="target" is-business>
      <template #title>
        <span style="font-weight: 600">数据统计</span>
        <date-range-picker
          v-model="time"
          :disabled="!statisticsReady"
          type="daterange"
          :picker-options="pickerOptions"
        />
      </template>
    </dashbord>
    <div class="agency-affairs" v-if="curStore.id">
      <div class="_title">待办事宜</div>
      <div class="_body">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(item, index) in agency" :key="index">
            <el-popover
              v-if="!allowEnter"
              placement="top-start"
              width="150"
              trigger="hover"
              content="该角色暂无权限访问"
            >
              <div slot="reference" class="agency-tab" style="cursor: not-allowed">
                <span class="key">{{ item.name }}</span>
                <span class="value">{{ item.value }}</span>
              </div>
            </el-popover>
            <div class="agency-tab" v-if="allowEnter" @click="clickAgency(item)">
              <span class="key">{{ item.name }}</span>
              <span class="value">{{ item.value }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="flex-item">
      <div class="data-analysis">
        <div class="_title">数据报表</div>
        <el-popover
          :disabled="allowEnter"
          placement="top-start"
          width="150"
          trigger="hover"
          content="该角色暂无权限访问"
        >
          <div
            slot="reference"
            class="analysis-item"
            :style="allowEnter ? {} : { cursor: 'not-allowed' }"
            @click="gotoSale"
          >
            <div class="item-icon-box">
              <img class="item-icon" src="../../images/console/icon-sale.png" />
            </div>
            <span class="item-name">销售概览</span>
          </div>
        </el-popover>

        <el-popover
          :disabled="allowEnter"
          placement="top-start"
          width="150"
          trigger="hover"
          content="该角色暂无权限访问"
        >
          <div
            slot="reference"
            class="analysis-item"
            :style="allowEnter ? {} : { cursor: 'not-allowed' }"
            @click="gotoMa"
          >
            <div class="item-icon-box">
              <img class="item-icon" src="../../images/console/icon-ma.png" />
            </div>
            <span class="item-name">小程序概览</span>
          </div>
        </el-popover>
        <el-popover
          :disabled="allowEnter"
          placement="top-start"
          width="150"
          trigger="hover"
          content="该角色暂无权限访问"
        >
          <div
            slot="reference"
            class="analysis-item"
            :style="allowEnter ? {} : { cursor: 'not-allowed' }"
            @click="gotoMember"
          >
            <div class="item-icon-box">
              <img class="item-icon" src="../../images/console/icon-member.png" />
            </div>
            <span class="item-name">会员概览</span>
          </div>
        </el-popover>
      </div>
      <div class="common-usefun_bus">
        <div class="_title">常用功能</div>
        <div class="_body">
          <template v-for="(item, index) in comUseList">
            <div class="used__item" v-if="item.isNotManagerShow || isEnterpriseManager" :key="index">
              <el-popover
                v-if="!allowEnter"
                placement="top-start"
                width="150"
                trigger="hover"
                content="该角色暂无权限访问"
              >
                <div slot="reference" class="agency-tab" style="cursor: not-allowed">
                  <img class="icon" :src="item.icon" />
                  <span class="name">{{ item.name }}</span>
                </div>
              </el-popover>
              <div class="agency-tab" v-if="allowEnter" @click="clickComUse(item)">
                <img class="icon" :src="item.icon" />
                <span class="name">{{ item.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex';
  import moneyUtil from '@/dss-common/utils/money';
  import dateUtil from '@/dss-common/utils/date';
  import DateRangePicker from '@/dss-common/components/date-range-picker-select/index.vue';
  import api from '@/dss-wechat3rd/src/api';
  import PictureIcon from '@/dss-wechat3rd/src/images/console/picture.png';
  import CustomerIcon from '@/dss-wechat3rd/src/images/console/customer.png';
  import MemberIcon from '@/dss-wechat3rd/src/images/console/member.png';
  import FeedbackIcon from '@/dss-wechat3rd/src/images/console/feedback.png';
  // import CouponIcon from '@/dss-wechat3rd/src/images/console/coupon.png';
  import config from './config';
  import Dashbord from './components/dashbord.vue';
  import './index.less';

  const year = 365 * 24 * 3600 * 1000;
  const date = new Date();
  const now = date.setHours(23, 59, 59);

  export default {
    components: {
      DateRangePicker,
      Dashbord,
    },
    props: {
      onReady: {
        type: Function,
        default: function () {},
      },
    },
    data() {
      return {
        dateUtil,
        statisticsReady: true,
        time: [],
        // 今日关键指标
        orderStatisticDTO: {
          productOrderCount: 0, // 购物订单数
          scheduleOrderCount: 0, // 预约订单数
          totalChargeMoney: 0, // 订单总储值金额
          totalMoney: 0, // 订单金额总数
          totalOrder: 0, // 订单总数
          totalUser: 0, // 订单总用户数
        },
        // 代办事宜
        toDoListDTO: {
          toRefundOrder: 0, // 待退款订单
          toServicesOrder: 0, // 待服务的预约订单
          toShippingOrder: 0, // 待发货的预约订单
          toClientMessage: 0, // 待处理客户消息
        },
        minDate: '',
        pickerOptions: {
          onPick: ({ maxDate, minDate }) => {
            this.minDate = minDate;
          },
          disabledDate: time => {
            if (this.minDate) {
              const before = time.getTime() > now || new Date(this.minDate).getTime() - time.getTime() >= year;
              const after = time.getTime() > now || time.getTime() - new Date(this.minDate).getTime() >= year;
              return before || after;
            }
            return time.getTime() > now;
          },
        },
        target: [],
        agency: [],
        allowEnter: true,
        // 常用功能
        comUseList: [
          { name: '拍照积分审核', url: '/wkb.html#/largeMemScore/picture/list', icon: PictureIcon },
          { name: '服务台积分', url: '/wkb.html#/largeMemScore/customer/list', icon: CustomerIcon },
          { name: '会员查询', url: '/dmp.html#/member-center/archives/normal', icon: MemberIcon },
          { name: '意见反馈', url: '/wkb.html#/feedback/list', icon: FeedbackIcon },
          // { name: '优惠券管理', url: '/wkb.html#/marketing/coupon/coupon-list', icon: CouponIcon },
        ],
      };
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        curStore: 'curStore',
        roleList: 'roleList',
      }),
      // 是否企业管理员
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.split(',').indexOf('common_role_enterprise') !== -1;
      },
    },
    mounted() {
      this.fillTargetAndAgency();
      this.queryDashBoard(true);
    },

    watch: {
      time() {
        if (!this.item) {
          this.minDate = '';
        }
        this.queryDashBoard();
      },
    },
    methods: {
      gotoSale() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/sales/realtime-overview';
        }
      },
      gotoMember() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/da-member/overview';
        }
      },
      gotoMa() {
        if (this.allowEnter) {
          window.location.href = '/da.html#/ma/Apply';
        }
      },
      clickAgency(item) {
        if (item.key === 'toClientMessage') {
          location.href = location.protocol + '//' + location.host + '/dsp.html#' + item.url;
          return false;
        }
        if (this.allowEnter) {
          this.$router.push({ path: item.url });
        }
      },
      clickComUse(item) {
        if (item.url) {
          window.location.href = item.url;
          // this.$router.push(item.url);
        }
      },
      fillTargetAndAgency() {
        this.target = config.getStatistics();
        this.agency = config.getAllAgency_business();
      },
      // 控制台运营信息
      async queryDashBoard(fetchTodo) {
        const process = (collect, source) => {
          collect = collect.map(item => {
            if (source.hasOwnProperty(item.key)) {
              if (item.moneyFormat) {
                item.value = moneyUtil.convertHundredMoneyUnit(source[item.key] || '', true) || '0.00';
              } else {
                item.value = source[item.key];
              }
            }
            if (source.hasOwnProperty(item.tipKey)) {
              item.tip = source[item.tipKey];
            }
            return item;
          });
        };

        if (this.curStore.id && fetchTodo) {
          /** 待办事项 */
          api.queryTodoList({}).then(res => {
            process(this.agency, res.data);
          });
        }

        if (!this.statisticsReady) {
          return;
        }

        this.statisticsReady = false;
        try {
          const res = await api.queryDashBoardBusiness({
            queryDateTimeStart: this.time[0],
            queryDateTimeEnd: this.time[1],
          });
          const { grantScoreData, memberData, offlineConsumeData, parkingPayData, grantCouponData } = res.data;
          process(this.target, {
            ...grantScoreData,
            ...memberData,
            ...offlineConsumeData,
            ...parkingPayData,
            ...grantCouponData,
          });
        } catch (error) {
        } finally {
          this.statisticsReady = true;
          this.onReady();
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .flex-item {
    display: flex;
  }

  .data-analysis {
    flex: 1;
    margin-right: 12px;

    & .analysis-item {
      width: 100%;
      margin-bottom: 24px;

      & .item-icon-box {
        margin-right: 30px;
      }
    }
  }

  .common-usefun_bus {
    flex: 1;
    margin-left: 12px;
    @media (max-width: 1659px) {
      & ._body {
        & .used__item {
          margin-bottom: 12px;
          padding: 20px;
        }
      }
    }
    @media (min-width: 1660px) {
      & ._body {
        display: grid;
        grid-template-columns: repeat(2, calc(50%));
        grid-template-rows: repeat(2, 50%);
        margin-top: 34px;

        & .used__item {
          padding: 35px 20px;
          margin: 12px 20px;

          & .icon {
            width: 56px;
            height: 56px;
          }
        }
      }
    }
  }

  .used__item {
    background: #f5f7fa;
    border-radius: 10px;
  }
</style>
