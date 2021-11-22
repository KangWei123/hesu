<template>
  <div class="salesRank da-block"
       v-loading="loading">
    <div class="bar-action-box">
      <span class="bar-title">单品销售排行</span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.PURCHASE ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.PURCHASE">
        销售额
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.LOYALTY ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.LOYALTY">
        订单量
      </span>
      <span class="bar-action"
            :class="salesType===salesTypeEnum.SAMEGROWTH ? 'bar-action-active' : ''"
            @click="salesType = salesTypeEnum.SAMEGROWTH">
        同比增长
      </span>
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
import services from '@/dss-common/utils/services';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
const salesTypeEnum = { PURCHASE: 0, LOYALTY: 1, SAMEGROWTH: 2 };
import { mapState } from 'vuex';
export default {
  name: 'salesRank',
  components: { realTime, Chart, PlaceHolder },

  data() {
    return {
      salesTypeEnum,
      salesType: salesTypeEnum.PURCHASE,
      options1: null,
      options2: null,
      realData: [],
      loading: false
    };
  },
  watch: {
    salesType: {
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
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },
  mounted() {
    this.getData();
  },
  methods: {
    getOptions() {
      this.options1 = bar.assembleBarYOptions(this.realData, 'itemName', this.field, 'level', 0, true);
      this.options2 = bar.assembleBarYOptions(this.realData, 'itemName', this.field, 'level', 10, true);
    },
    getData() {
      let url = api.URL_SALE_OVERVIEW_RANK_FEE;
      switch (this.salesType) {
        case salesTypeEnum.PURCHASE:
          url = api.URL_SALE_OVERVIEW_RANK_STORE_FEE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_RANK_FEE;
          }
          this.field = 'sumAmount';
          break;
        case salesTypeEnum.LOYALTY:
          url = api.URL_SALE_OVERVIEW_RANK_STORE_CNT;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_RANK_CNT;
          }
          this.field = 'sumOrderCount';
          break;
        case salesTypeEnum.SAMEGROWTH:
          url = api.URL_SALE_OVERVIEW_RANK_STORE_RATE;
          if (this.selectedStore.id < 0) {
            url = api.URL_SALE_OVERVIEW_RANK_RATE;
          }
          this.field = 'rate';
          break;
      }
      this.loading = true;
      let params = {
        storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null,
        pageSize: 20,
        pageNo: 1
      };
      services
        .get(url, {
          params,
          action: '获取单品销售排行'
        })
        .then(res => {
          this.realData = res.data;
          this.getOptions();
        })
        .always(() => {
          this.loading = false;
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
