<template>
  <div class="overview">
    <div class="da-title">
      销售概览
    </div>

    <!-- 门店选择 -->
    <div class="g-store-select">
      <store-select @storeChange="onStoreChanged"></store-select>
    </div>

    <!-- 门店排行 -->
    <store-list v-if="storeId===-1"></store-list>

    <!-- 今日实时 -->
    <real-today></real-today>

    <!-- 实时趋势图 -->
    <trend-chart></trend-chart>

    <!-- 品类销售 -->
    <sales-bubble></sales-bubble>

    <!-- 单品销售排行 -->
    <sales-rank></sales-rank>
  </div>
</template>

<script>
import storeList from './store-list.vue';
import realToday from './real-today.vue';
import salesRank from './sales-rank.vue';
import salesBubble from './sales-bubble.vue';

import trendChart from './trend-chart.vue';
import StoreSelect from '../../../components/store-select.vue';
export default {
  name: 'sales-overview',

  components: { storeList, trendChart, realToday, salesRank, StoreSelect, salesBubble },

  data() {
    return { storeId: null };
  },

  computed: {},

  methods: {
    onStoreChanged(storeId) {
      console.log('onStoreChanged', storeId);
      this.storeId = storeId;
    }
  }
};
</script>
<style lang="less" scoped>
.overview {
}
</style>
