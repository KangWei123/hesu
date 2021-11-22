<template>
  <div class="coupon-analysis">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path:'/marketing/coupon/'+route}">{{isDiscard?'废弃':''}}优惠券</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="coupon-item">
      <span class="title">活动效果</span>
      <span class="name">优惠券名称: {{couponInfo.name}}</span>
      <span class="notice">（注：统计数据截止至前一天，当天数据不统计）</span>
    </div>

    <el-card class="coupon-info">
      <el-row align="center">
        <el-col :span="6">
          <div class="value">{{couponInfo.quantity}}</div>
          <div class="label">总量</div>
        </el-col>

        <el-col :span="6"
                class="b-count">
          <div class="value">{{couponInfo.receiveCount}}</div>
          <div class="label">已领取</div>
        </el-col>

        <el-col :span="6">
          <div class="value">{{couponInfo.useCount}}</div>
          <div class="label">已使用</div>
        </el-col>

        <el-col :span="6">
          <div class="value">{{couponInfo.unusedCount}}</div>
          <div class="label">未使用</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 日期选择 -->
    <div class="date-filter">
      <date-range @pick="onChangeCustomerDate"
                  :maxDate="MAX_DATE">
        <date-filter @filter="onDateTypeSelected" />
      </date-range>
    </div>

    <el-row>
      <el-col :span="16">
        <trend-bar :dateRange='dateRange'
                   :type='queryType'
                   :coupon-id="couponId" />
      </el-col>

      <el-col :span="8">
        <ratio-pie :dateRange='dateRange'
                   :type='queryType'
                   :coupon-id="couponId" />
      </el-col>
    </el-row>

    <div class="trade-line">
      <trade-line :coupon-id="couponId"
                  :date-range="dateRange"
                  :type="queryType" />
    </div>

    <div class="detail-table">
      <detail-table :coupon-id="couponId" />
    </div>
  </div>
</template>

<script>
import CouponApi from '@/dss-wechat3rd/src/api/couponApi.js';
import TrendBar from './trend-bar.vue';
import RatioPie from './ratio-pie.vue';
import TradeLine from './trade-line.vue';
import DetailTable from './detail-table.vue';
import DateRange from '@/dss-wechat3rd/src/components/date/DateRange';
import date from '@/dss-common/utils/date';
import DateFilter from '@/dss-wechat3rd/src/components/date/DateFilter';

export default {
  name: 'CouponAnalysis',

  components: {
    DateRange,
    TrendBar,
    RatioPie,
    TradeLine,
    DetailTable,
    DateFilter
  },

  data() {
    return {
      loading: false,
      couponId: parseInt(this.$route.query.id),
      MAX_DATE: date.getDateByDays(new Date(), -1),
      couponInfo: {},
      dateRange: null,
      queryType: 0,
      isDiscard: this.$route.path.indexOf('discard') > 0,
      route: this.$route.path.indexOf('discard') > 0 ? 'discard' : 'coupon-list'
    };
  },

  mounted() {
    this.couponId = parseInt(this.$route.query.id);
    this.apiGetCouponInfo();
  },

  methods: {
    apiGetCouponInfo() {
      this.loading = true;
      let params = {
        couponInfoId: this.couponId
      };
      CouponApi.queryCouponBriefInfo(params)
        .then(res => {
          console.log('apiGetCouponInfo --->', JSON.stringify(res.data));
          this.couponInfo = res.data || {};
        })
        .catch(err => {
          console.error('apiGetCouponInfo --->', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    onChangeCustomerDate(range) {
      console.log('onChangeCustomerDate ---->', range);
      this.dateRange = range;
    },

    getType(type) {
      switch (type) {
        case 0:
          return 0;
          break;
        case 'W':
          return 1;
          break;
        case 'M':
          return 2;
          break;
      }
    },

    onDateTypeSelected(dateType) {
      this.queryType = this.getType(dateType.dateType || 0);
    }
  }
};
</script>

<style lang="less">
.coupon-analysis {
  background: #fff;
  .market-breadcrumb {
    margin-top: 0;
  }
  .coupon-bread {
    padding: 10px;
  }

  .coupon-item {
    padding: 20px 20px 0 20px;

    .title {
      font-size: 18px;
      font-weight: 500;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      margin-left: 20px;
    }
    .notice {
      font-size: 16px;
      font-weight: 500;
      margin-left: 20px;
    }
  }

  .coupon-info {
    margin: 20px;

    .label {
      font-size: 14px;
      color: #ddd;
      font-weight: 400;
    }

    .value {
      font-size: 24px;
    }
  }

  .date-filter {
    margin-top: 10px;
  }

  .trend-bar {
    margin-top: 10px;
  }

  .ratio-pie {
    margin-top: 10px;
  }

  .trade-line {
    margin-top: 10px;
  }

  .detail-table {
    margin-top: 10px;
  }
}
</style>
