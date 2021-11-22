<template>
  <div class="storeList da-block"
       v-loading="loading">
    <div class="bar-action-box">
      <span class="bar-title">门店排行</span>
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
    <div class="chart-box">
      <store-rank :data="list"
                  :field='field'></store-rank>
    </div>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import storeRank from '@/dss-da/src/components/store-rank.vue';
import { bar } from '@/dss-da/src/assembler/index.js';
import { mapState } from 'vuex';
import api from '@/dss-da/src/api/sales.js';
import services from '@/dss-common/utils/services';
const salesTypeEnum = { PURCHASE: 0, LOYALTY: 1, SAMEGROWTH: 2 };
export default {
  name: 'storeList',

  components: { storeRank, Chart },
  data() {
    return {
      list: [],
      loding: false,
      salesTypeEnum,
      salesType: salesTypeEnum.PURCHASE,
      field: 'sumAmount',
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
      selectedStore: state => state.selectedStore,
      storeList: state => state.storeList,
      userInfo: 'userInfo'
    })
  },
  mounted() {
    this.getData();
  },
  methods: {
    getStoreName() {
      this.list.forEach(item => {
        let store = this.storeList.find(it => it.id === item.storeId) || {};
        item.storeName = store.name || '';
      });
    },
    getData() {
      let url = api.URL_SALE_OVERVIEW_STORE_FEE;
      switch (this.salesType) {
        case salesTypeEnum.PURCHASE:
          url = api.URL_SALE_OVERVIEW_STORE_FEE;
          this.field = 'sumAmount';
          break;
        case salesTypeEnum.LOYALTY:
          url = api.URL_SALE_OVERVIEW_STORE_CNT;
          this.field = 'sumOrderCount';
          break;
        case salesTypeEnum.SAMEGROWTH:
          url = api.URL_SALE_OVERVIEW_STORE_RATE;
          this.field = 'rate';
          break;
      }
      this.loading = true;
      let params = {
        storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null,
        pageSize: 12,
        pageNo: 1
      };
      services
        .get(url, {
          params,
          action: '获取门店排行数据'
        })
        .then(res => {
          this.list = res.data;
          this.getStoreName();
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.storeList {
  overflow: hidden;
  min-height: 240px;
  box-sizing: border-box;
  position: relative;

  .chart-box {
    margin-top: 25px;

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
