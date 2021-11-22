<template>
  <div class="salesRank da-block"
       v-loading="loding">
    <div class="bar-action-box">
      <span class="bar-title">单品销售排行</span>

    </div>
    <div class="chart-box"
         v-if="realData&&realData.length">
      <div class="chart">
        <chart :options="options1"
               height='340px'></chart>
      </div>
      <div class="chart">
        <chart :options="options2"
               height='340px'></chart>
      </div>
    </div>
    <place-holder :height="340"
                  v-else />
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import realTime from '@/dss-da/src/components/real-time.vue';
import { bar } from '@/dss-da/src/assembler/index.js';
import api from '@/dss-da/src/api/sales.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { mapState } from 'vuex';
export default {
  name: 'salesRank',

  components: { realTime, Chart, PlaceHolder },

  props: {
    dateRange: {
      default: Array,
      value: []
    }
  },
  watch: {
    dateRange: {
      deep: true,
      handler() {
        this.getData();
      }
    },
    selectedStore: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal != null) {
          this.getData();
        }
      }
    }
  },
  data() {
    return {
      options1: null,
      options2: null,
      realData: [],
      loding: false
    };
  },

  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },
  mounted() {},
  methods: {
    getOption() {
      if (this.realData && this.realData.length) {
        this.options1 = bar.assembleBarYOptions(this.realData, 'itemName', 'saleFee', 'level', 0, true);
        this.options2 = bar.assembleBarYOptions(this.realData, 'itemName', 'saleFee', 'level', 10, true);
      }
    },
    getData() {
      this.loding = true;
      api
        .getItemRankData({
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 20,
          pageNo: 1
        })
        .then(rs => {
          this.realData = rs.data || [];
          this.getOption();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loding = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.salesRank {
  overflow: hidden;
  height: 420px;
  margin: 20px 0;
  position: relative;

  .chart-box {
    margin-top: 10px;
    height: 340px;
    overflow: hidden;
    .chart {
      float: left;
      width: 50%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
