<template>
  <div class="statistics-category">
    <statistics-item class="statistics-item"
                     :label="'今日' + type"
                     last-period-label="上周同期"
                     target-label="今日目标"
                     :total-count="passengerStatistics ? passengerStatistics.todayCustomer : -1"
                     :last-period-count="passengerStatistics ? passengerStatistics.lastWeekTodayCustomer : -1"
                     :target-count="passengerStatistics ? passengerStatistics.todayTarget : -1"
                     :has-divider="true"></statistics-item>
    <statistics-item class="statistics-item"
                     :label="'本周' + type"
                     :last-period-label="'上周' + type"
                     target-label="本周目标"
                     :total-count="passengerStatistics ? passengerStatistics.thisWeekCustomer : -1"
                     :last-period-count="passengerStatistics ? passengerStatistics.lastWeekCustomer : -1"
                     :target-count="passengerStatistics ? passengerStatistics.thisWeekTarget : -1"
                     :has-divider="true"></statistics-item>
    <statistics-item class="statistics-item"
                     :label="'本月' + type"
                     :last-period-label="'上月' + type"
                     target-label="本月目标"
                     :total-count="passengerStatistics ? passengerStatistics.thisMonthCustomer : -1"
                     :last-period-count="passengerStatistics ? passengerStatistics.lastMonthCustomer : -1"
                     :target-count="passengerStatistics ? passengerStatistics.thisMonthTarget : -1"></statistics-item>
  </div>
</template>

<script>
import StatisticsItem from './StatisticsCategoryItem';

export default {
  name: 'statistics-category',

  components: { StatisticsItem },

  props: {
    //
    passengerStatistics: Object, //{todayPassenger: 238, todayPassengerIncr: 11.74, monthPassenger: 238, monthPassengerIncr: 100,monthCustomer:4835,monthCustomerIncr:100}
    type: {
      type: String,
      default: '客流'
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
}
</style>
