<template>
  <div class="da-block m-order-trend"
       v-loading="loading">
    <span class="da-block-title bar-title">订单趋势图</span>

    <chart v-if="data && data.length"
           height="300px"
           :options="orderOptions"></chart>

    <place-holder v-else
                  :height="300" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import utils from '@/dss-common/utils';
import { line } from '@/dss-da/src/assembler/index.js';
import Chart from '@/dss-common/components/ChartEmpty';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import orderApi from '@/dss-da/src/api/order.js';

export default {
  name: 'OrderTrend',

  components: {
    Chart,
    PlaceHolder
  },

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
      loading: false,
      orderOptions: null,
      queryParams: null,
      data: null
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
      handler(newVal, oldVal) {
        this.queryParams = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
        if (oldVal != null) {
          this.apiGetTrendData();
        }
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
        this.apiGetTrendData();
      }
    }
  },

  methods: {
    apiGetTrendData() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      orderApi
        .getOrderTrendByDay(params)
        .then(res => {
          this.data = res.data || [];
          this.orderOptions = line.assembleLineOptions(
            this.data,
            'orderTime',
            'saleCnt',
            null,
            utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1]))
          );
        })
        .catch(err => {
          console.error('apiGetTrendData error', err);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.m-order-trend {
  height: 370px;
}
</style>
