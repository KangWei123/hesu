<template>
  <div class="da-sales-order">

    <div class="da-title">
      订单分析
    </div>

    <!-- 门店选择 -->
    <div class="g-store-select">
      <store-select @storeChange="onStoreChanged"></store-select>
    </div>

    <!-- 订单排行 -->
    <div class="g-order-rank"
         v-if="storeId === -1">
      <order-rank></order-rank>
    </div>

    <!-- 时间维度 -->
    <div class="g-order-indictor">
      <order-indicator></order-indicator>
    </div>

    <date-range style="margin-left: 20px"
                @pick="onSelectDateRange"
                visible-short-cut />

    <!-- 订单图 -->
    <div class="g-order-chart">
      <!-- 趋势图 -->
      <order-trend :date-range="dateRange"></order-trend>
      <!-- 气泡图 -->
      <order-bubble :date-range="dateRange"></order-bubble>
      <!-- 单品排行 -->
      <order-item-rank :date-range="dateRange"></order-item-rank>
    </div>

    <!-- 人群趋势 -->
    <div class="g-crowd-dimension">
      <order-crowd :date-range="dateRange"></order-crowd>
    </div>

  </div>
</template>

<script>
import WkbPie from '../../../components/wkb-pie.vue';
import DateRange from '../../../components/date-range.vue';
import StoreSelect from '../../../components/store-select.vue';
import OrderRank from './order-rank.vue';
import OrderIndicator from './order-indicator.vue';
import OrderTrend from './order-trend.vue';
import OrderBubble from './order-bubble.vue';
import OrderItemRank from './order-item-rank.vue';
import OrderCrowd from './order-crowd.vue';
import '../../../style/da-base.less';

export default {
  name: 'OrderAnaylsis',

  components: {
    StoreSelect,
    WkbPie,
    DateRange,
    OrderRank,
    OrderIndicator,
    OrderTrend,
    OrderBubble,
    OrderItemRank,
    OrderCrowd
  },

  data() {
    return {
      pieCustomOption: null,
      storeId: null,
      dateRange: []
    };
  },

  computed: {},

  methods: {
    onStoreChanged(storeId) {
      console.log('onStoreChanged', storeId);
      this.storeId = storeId;
    },

    onSelectDateRange(dateRange) {
      console.log('onSelectDateRange', dateRange);
      this.dateRange = dateRange;
    }
  }
};
</script>
