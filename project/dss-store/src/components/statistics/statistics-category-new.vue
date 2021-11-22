<template>
  <div class="statistics-category">
    <!-- 全局概览 -->
    <template v-if="pageType === 1">
      <statistics-item
        class="statistics-item"
        :label="curLabel.label + '客流'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.flowCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.flowLastCount : -1"
        has-divider
      ></statistics-item>
      <statistics-item
        class="statistics-item"
        :label="curLabel.label + '客户'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.customerCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.customerLastCount : -1"
        has-divider
      ></statistics-item>
      <statistics-item
        class="statistics-item"
        :label="curLabel.label + '会员'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.memberCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.memberLastCount : -1"
      ></statistics-item>
    </template>
    <!-- 门店概览 -->
    <template v-if="pageType === 2">
      <statistics-item
        class="statistics-item store"
        :label="curLabel.label + '客流'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.flowCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.flowLastCount : -1"
        has-divider
      ></statistics-item>
      <statistics-item
        class="statistics-item store"
        :label="curLabel.label + '客户'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.customerCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.customerLastCount : -1"
        has-divider
      ></statistics-item>
      <statistics-item
        class="statistics-item store"
        :label="curLabel.label + '到店会员'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.memberCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.memberLastCount : -1"
        has-divider
      ></statistics-item>
      <statistics-item
        class="statistics-item store"
        :label="curLabel.label + '店外客流'"
        :last-period-label="curLabel.lastPeriodLabel"
        target-label="环比"
        :total-count="passengerStatistics ? passengerStatistics.outDoorCount : -1"
        :last-period-count="passengerStatistics ? passengerStatistics.outDoorLastCount : -1"
      ></statistics-item>
    </template>
  </div>
</template>

<script>
import StatisticsItem from './statistics-category-item-new.vue';
const LASTPERIODLABEL = {
  today: {
    label: '今日',
    lastPeriodLabel: '昨日'
  },
  week: {
    label: '本周',
    lastPeriodLabel: '上周'
  },
  month: {
    label: '本月',
    lastPeriodLabel: '上月'
  }
};

export default {
  name: 'statistics-category',

  components: { StatisticsItem },

  props: {
    //
    passengerStatistics: Object, //{todayPassenger: 238, todayPassengerIncr: 11.74, monthPassenger: 238, monthPassengerIncr: 100,monthCustomer:4835,monthCustomerIncr:100}
    type: {
      type: String,
      default: '客流'
    },
    // 区分门店概览2 和全局概览1
    pageType: {
      type: Number,
      default: 1
    },
    dateType: {
      type: String,
      default: 'today'
    }
  },
  computed: {
    curLabel() {
      return LASTPERIODLABEL[this.dateType];
    }
  }
};
</script>

<style scoped lang="less">
.statistics-category {
  display: flex;
  flex-direction: row;
  padding: 20px 0px;
  /*overflow: auto;*/
  @media screen and (max-width: 949px) {
    flex-direction: column;
    /*align-items: center;*/
    /*overflow: auto;*/
    padding-bottom: 0px;
    padding-top: 0px;
  }
}

.statistics-item {
  @media screen and (min-width: 950px) {
    width: 33.3%;
  }

  &.store {
    @media screen and (min-width: 950px) {
      width: 25%;
    }
  }
}
</style>
