<template>
  <div class="m-order-bubble da-block">
    <div class="bar-action-box">
      <span class="bar-title">订单气泡图</span>
    </div>

    <bargain class="order-bubble"
             :url="bubbleUrl"
             :query-params="queryParams"
             :field="field">
    </bargain>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import orderApi from '@/dss-da/src/api/order.js';
import Bargain from '../../../components/bargain.vue';

export default {
  name: 'OrderBubble',

  components: { Bargain },

  props: {
    dateRange: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      bubbleUrl: orderApi.URL_ORDER_BUBBLE,
      queryParams: null,
      field: ['categoryName', 'orderCnt', 'saleCntRate', '订单量']
    };
  },

  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },

  watch: {
    selectedStore: {
      deep: true,
      handler() {
        this.queryParams = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
      }
    },

    dateRange: {
      deep: true,
      handler() {
        this.queryParams = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
      }
    }
  }
};
</script>

<style lang="less" >
.m-order-bubble {
  height: 100%;
  .order-bubble {
    height: 340px;
  }
}
</style>
