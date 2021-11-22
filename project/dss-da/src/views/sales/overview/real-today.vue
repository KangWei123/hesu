<template>
  <div class="realtoday">
    <div class="real-title">今日实时</div>

    <div class="real-list">
      <real-time class="real-time"
                 v-for="(item,index) in realData"
                 :key="index"
                 :itemData="item"></real-time>
    </div>

  </div>
</template>

<script>
import realTime from '@/dss-da/src/components/real-time.vue';
import api from '@/dss-da/src/api/sales.js';
import { mapState } from 'vuex';
import services from '@/dss-common/utils/services';
export default {
  name: 'salesIndicators',

  components: { realTime },

  data() {
    return {
      realData: [
        { realName: '销售额', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '订单量', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '平均客单价', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '平均件单价', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '连带率', realCount: 0, sameRatio: 0, ringRatio: 0 }
      ],
      params: null,
      url: ''
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
        if (oldVal != null) {
          this.getAnalysisData();
        }
      }
    }
  },
  mounted() {
    this.getAnalysisData();
  },
  methods: {
    getData(data) {
      this.realData[0].realCount = data.saleFee || 0;
      this.realData[0].ringRatio = this.computeRate(data.saleFee, data.saleFeeMOM) || 0;
      this.realData[0].sameRatio = this.computeRate(data.saleFee, data.saleFeeYOY) || 0;
      this.realData[1].realCount = data.orderCnt || 0;
      this.realData[1].ringRatio = this.computeRate(data.orderCnt, data.orderCntMOM) || 0;
      this.realData[1].sameRatio = this.computeRate(data.orderCnt, data.orderCntYOY) || 0;
      this.realData[2].realCount = data.pac || 0;
      this.realData[2].ringRatio = this.computeRate(data.pac, data.pacMOM) || 0;
      this.realData[2].sameRatio = this.computeRate(data.pac, data.pacYOY) || 0;
      this.realData[3].realCount = data.unitPriceCnt || 0;
      this.realData[3].ringRatio = this.computeRate(data.unitPriceCnt, data.unitPriceMOM) || 0;
      this.realData[3].sameRatio = this.computeRate(data.unitPriceCnt, data.unitPriceYOY) || 0;
      this.realData[4].realCount = data.apr || 0;
      this.realData[4].ringRatio = this.computeRate(data.apr, data.aprMOM) || 0;
      this.realData[4].sameRatio = this.computeRate(data.apr, data.aprYOY) || 0;
    },
    computeRate(cnt, olderCnt) {
      cnt = cnt || 0;
      if (!olderCnt) {
        return 0;
      }
      return parseFloat((cnt - olderCnt) / olderCnt);
    },
    getAnalysisData() {
      this.loding = true;
      this.url = api.URL_SALE_OVERVIEW_ANALYSIS;
      if (this.selectedStore.id < 0) {
        this.url = api.URL_SALE_OVERVIEW_APP_ANALYSIS;
      }
      let params = {
        storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null,
        pageSize: 110,
        pageNo: 1
      };
      services
        .get(this.url, {
          params,
          action: '获取实时数据'
        })
        .then(res => {
          this.getData(res.data[0]);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="less" scoped>
.realtoday {
  overflow: hidden;
  .real-title {
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    margin: 20px 0 10px 20px;
  }
  .real-list {
    overflow: hidden;
    .real-time {
      float: left;
    }
  }
}
</style>
