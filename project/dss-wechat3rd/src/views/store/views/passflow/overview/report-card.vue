<style lang="less">
.report-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3b4757;
  font-size: 16px;
  width: 23%;
  min-width: 150px;
  @media screen and (max-width: 950px) {
    margin-bottom: 30px;
  }

  & > .no-data {
    height: 75px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #a4acb8;
  }

  & > .report-card-title {
    font-size:14px;
    font-family:PingFangSC-Regular;
    color:rgba(86,105,128,1);
    line-height:20px;
  }

  & > .data-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    & > .report-card-value {
      
      font-size:28px;
      font-family:DINPro-Medium;
      color:rgba(44,54,65,1);
      line-height:36px;
      padding-top: 13px;
    }

    & > .rate-container {
      padding-top: 13px;
      font-size:16px;
      font-family:DIN-Medium;
      line-height:19px;

      & > div {
				display: flex;
				align-items: center;
        & > :first-child {
          padding-right: 10px;
          font-size:14px;
          font-family:PingFangSC-Regular;
          color:rgba(133,140,153,1);
          line-height:20px;
        }
      }
    }
		.increase-indicator {
        width: 14px;
        height: 16px;
        background: url('../../../../../../../dss-common/img/icons/increase.png') no-repeat center / cover;
        margin-left: 5px;
		}

		.reduce-indicator {
        width: 14px;
        height: 16px;
        background: url('../../../../../../..//dss-common/img/icons/reduce.png') no-repeat center / cover;
        margin-left: 5px;
		}
    .increase {
      color: #ff6f3a;
    }
    .reduce {
      color: #28d79d;
    }

  }
}
</style>
<template>
	<div class="report-card"  v-if="data">
		<div class="report-card-title">{{data.name | name}}</div>
		<div class="data-container" v-if="data.value">
			<div class="report-card-value" v-if="data.name === 'enterRate' || data.name === 'daySatisfy' ||　data.name === 'weekSatisfy' || data.name === 'monthSatisfy'">{{(data.value / 10).toFixed(1) }}%</div>
			<div class="report-card-value" v-else>{{data.value}}</div>
			<div class="rate-container" v-if="data.weekOnWeek || data.weekOnWeek === 0 || data.dayOnDay || data.dayOnDay === 0">
				<!-- 周报 weekOnWeek为null-->
				<div v-if="!data.weekOnWeek && data.weekOnWeek !== 0">
					<div>环比</div>
					<div :class="{increase: data.dayOnDay >= 0, reduce: data.dayOnDay < 0}">{{data.dayOnDay > 0 ? '+'  : ''}}{{data.dayOnDay}}%</div>
					<div :class="{'increase-indicator': data.dayOnDay >= 0 ,'reduce-indicator': data.dayOnDay < 0 }"></div>
				</div>
				<!-- 日报 -->
				<div v-else>
					<div>同比</div>
					<div :class="{increase: data.weekOnWeek >= 0, reduce: data.weekOnWeek < 0}">{{data.weekOnWeek > 0 ? '+'  : ''}}{{data.weekOnWeek}}%</div>
					<div :class="{'increase-indicator': data.weekOnWeek >= 0 ,'reduce-indicator': data.weekOnWeek < 0}"></div>
				</div>
			</div>
		</div>
		<div class="no-data" v-else>暂无数据</div>
	</div>
</template>
<script>
export default {
  data() {
    return {
      dayValue: null,
      weekValue: null
    };
  },
  props: {
    data: {
      type: Object,
      default: {}
    },
    type: {
      type: String,
      default: ''
    },
    groupId: {
      type: String,
      default: ''
    }
  },

  filters: {
    name(value) {
      switch (value) {
        case 'customer':
          return '客流总量';
        case 'newCustomer':
          return '新客总量';
        case 'oldCustomer':
          return '老客总量';
        case 'enterRate':
          return '进店率';
        case 'daySatisfy':
          return '日流量达成率';
        case 'weekSatisfy':
          return '周流量达成率';
        case 'monthSatisfy':
          return '月流量达成率';
        case 'nextWeekTarget':
          return '下周目标值';
        case 'customerIndex':
          return '客流指数';
        case 'newCustomerIndex':
          return '新客指数';
        case 'oldCustomerIndex':
          return '老客指数';
        case 'customerQualityIndex':
          return '客户质量指数';
      }
    }
  },
  methods: {}
};
</script>
