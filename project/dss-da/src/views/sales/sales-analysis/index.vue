<template>
  <div class="overview">
    <div class="da-title">
      销售额分析
    </div>

    <!-- 门店选择 -->
    <div class="g-store-select">
      <store-select @storeChange="onStoreChanged"></store-select>
    </div>

    <!-- 门店排行 -->
    <store-list v-if="storeId===-1"></store-list>

    <!-- 销售指标 -->
    <sales-indicators></sales-indicators>

    <date-range @pick="onSelectDateRange"
                style="margin-left:20px"
                visible-short-cut />
    <!-- 销售趋势图 -->
    <trend-chart :dateRange="dateRange"></trend-chart>

    <!-- 品类销售额气泡 -->
    <sales-bubble :dateRange="dateRange"></sales-bubble>

    <!-- 单品销售排行 -->
    <sales-rank :dateRange="dateRange"></sales-rank>

    <!-- 人群趋势 -->
    <crowd-trend :dateRange="dateRange"></crowd-trend>
  </div>
</template>

<script>
import DateRange from '@/dss-da/src/components/date-range.vue';
import storeList from './store-list.vue';
import salesIndicators from './sales-indicators.vue';
import salesRank from './sales-rank.vue';
import salesBubble from './sales-bubble.vue';
import crowdTrend from './crowd-trend.vue';

import trendChart from './trend-chart.vue';
import StoreSelect from '../../../components/store-select.vue';
export default {
  name: 'sales-overview',

  components: { storeList, trendChart, salesIndicators, salesRank, StoreSelect, salesBubble, crowdTrend, DateRange },

  data() {
    return {
      dateRange: [],
      storeId: null
    };
  },

  computed: {},

  methods: {
    onSelectDateRange(dateRange) {
      this.dateRange = dateRange;
      console.log('onSelectDateRange', dateRange);
    },
    onStoreChanged(storeId) {
      console.log('onStoreChanged', storeId);
      this.storeId = storeId;
    }
  }
};
</script>
<style lang="less" scoped>

</style>
