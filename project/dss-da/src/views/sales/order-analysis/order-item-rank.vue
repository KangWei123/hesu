<template>
  <div class="m-order-item-rank da-block"
       v-loading="loading">
    <div class="bar-action-box">
      <span class="bar-title">单品订单排行</span>
    </div>

    <div class="chart-box"
         v-if="data && data.length">
      <div class="chart">
        <chart :options="options1"
               height="340px"></chart>
      </div>
      <div class="chart">
        <chart :options="options2"
               height="340px"></chart>
      </div>
    </div>

    <place-holder v-else />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Chart from '@/dss-common/components/ChartEmpty';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { bar } from '@/dss-da/src/assembler/index.js';
import orderApi from '@/dss-da/src/api/order.js';

export default {
  name: 'OrderItemRank',

  components: {
    Chart,
    PlaceHolder
  },

  props: {
    dateRange: {
      default: Array,
      value: []
    }
  },

  data() {
    return {
      loading: false,
      data: null,
      options1: null,
      options2: null,
      queryParams: null
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
          pageSize: 20,
          pageNo: 1
        };
        if (oldVal != null) {
          this.apiGetData();
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
          pageSize: 20,
          pageNo: 1
        };
        this.apiGetData();
      }
    }
  },

  methods: {
    apiGetData() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      orderApi
        .getOrderItemRank(params)
        .then(res => {
          this.data = res.data;
          this.getOption();
        })
        .catch(err => {
          console.error('order-rank, apiGetData error', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    getLevel() {
      for (let index = 0; index < 20; index++) {
        if (this.data[index]) {
          this.data[index].level = '1';
        } else {
          let item = {
            itemName: '',
            orderCnt: 0,
            level: '1'
          };
          this.data.push(item);
        }
      }
    },

    getOption() {
      if (this.data && this.data.length) {
        this.options1 = bar.assembleBarYOptions(this.data, 'itemName', 'orderCnt', 'level', 0, true);
        this.options2 = bar.assembleBarYOptions(this.data, 'itemName', 'orderCnt', 'level', 10, true);
      }
    }
  }
};
</script>
<style lang="less" scoped>
.m-order-item-rank {
  overflow: hidden;
  margin: 14px 0;
  position: relative;

  .chart-box {
    overflow: hidden;
    .chart {
      float: left;
      width: 50%;
      height: 340px;
      overflow: hidden;
    }
  }
}
</style>
