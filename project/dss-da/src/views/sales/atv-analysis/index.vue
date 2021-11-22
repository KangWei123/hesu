<template>
  <div class="da-atv-order">
    <div class="da-title">
      客单价分析
    </div>

    <!-- 门店选择 -->
    <div class="g-store-select">
      <store-select @storeChange="onStoreChanged"></store-select>
    </div>

    <!-- 客单价排行 -->
    <div class="g-atv-rank"
         v-if="storeId === -1">
      <atv-rank></atv-rank>
    </div>

    <!-- 商品维度 -->
    <div class="g-goods-dimension">
      <atv-indicator></atv-indicator>
    </div>

    <date-range @pick="onSelectDateRange"
                visible-short-cut
                style="margin-left: 20px" />

    <!-- 订单趋势图 -->
    <div class="g-atv-bubble">
      <atv-trend :date-range="dateRange"></atv-trend>
    </div>

    <!-- 人群趋势 -->
    <div class="g-crowd-dimension">
      <atv-crowd :date-range="dateRange"></atv-crowd>
    </div>

  </div>
</template>

<script>
import WkbPie from '../../../components/wkb-pie.vue';
import StoreSelect from '../../../components/store-select.vue';
import DateRange from '../../../components/date-range.vue';
import AtvIndicator from './atv-indicator.vue';
import AtvRank from './atv-rank.vue';
import AtvTrend from './atv-trend.vue';
import AtvCrowd from './atv-crowd.vue';

export default {
  name: 'ATVAnalysis',

  components: {
    WkbPie,
    StoreSelect,
    AtvRank,
    AtvIndicator,
    DateRange,
    AtvTrend,
    AtvCrowd
  },

  data() {
    return {
      storeId: null,
      dateRange: []
    };
  },

  computed: {},

  mounted() {},

  methods: {
    onSelectDateRange(dateRange) {
      console.log('onSelectDateRange', dateRange);
      this.dateRange = dateRange;
    },

    onStoreChanged(storeId) {
      console.log('onStoreChanged', storeId);
      this.storeId = storeId;
    }
  }
};
</script>
