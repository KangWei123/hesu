<template>
  <div class="realtoday">
    <div class="real-title">销售指标</div>

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
export default {
  name: 'salesIndicators',

  components: { realTime },

  data() {
    return {
      realData: [
        { realName: '昨日销售额', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '本周销售额', realCount: 0, ringRatio: 0 },
        { realName: '本月销售额', realCount: 0, ringRatio: 0 },
        { realName: '本季销售额', realCount: 0, sameRatio: 0, ringRatio: 0 },
        { realName: '本年销售额', realCount: 0, ringRatio: 0 }
      ]
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
      this.realData[0].realCount = data.daySaleFee || 0;
      this.realData[0].ringRatio = this.computeRate(data.daySaleFee, data.daySaleFeeMOM) || 0;
      this.realData[0].sameRatio = this.computeRate(data.daySaleFee, data.daySaleFeeYOY) || 0;
      this.realData[1].realCount = data.weekSaleFee || 0;
      this.realData[1].ringRatio = this.computeRate(data.weekSaleFee, data.weekSaleFeeMOM) || 0;
      this.realData[2].realCount = data.monthSaleFee || 0;
      this.realData[2].ringRatio = this.computeRate(data.monthSaleFee, data.monthSaleFeeMOM) || 0;
      this.realData[3].realCount = data.quarSaleFee || 0;
      this.realData[3].ringRatio = this.computeRate(data.quarSaleFee, data.quarSaleFeeMOM) || 0;
      this.realData[3].sameRatio = this.computeRate(data.quarSaleFee, data.quarSaleFeeYOY) || 0;
      this.realData[4].realCount = data.yearSaleFee || 0;
      this.realData[4].ringRatio = this.computeRate(data.yearSaleFee, data.yearSaleFeeMOM) || 0;
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
      api
        .getAnalysisData({
          storeId: this.selectedStore.id,
          pageSize: 110,
          pageNo: 1
        })
        .then(rs => {
          this.getData(rs.data[0]);
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
