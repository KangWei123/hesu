indicator
<template>
  <div class="m-order-indicator">
    <div class="title">客单指标</div>

    <div class="set"
         v-loading="pctLoading">
      <real-time class="real-time"
                 v-for="(item,index) in pacList"
                 :key="index"
                 :custom-style="customStyle"
                 :itemData="item"></real-time>
    </div>

    <div class="set"
         v-loading="pitLoading">
      <real-time class="real-time"
                 v-for="(item,index) in pitList"
                 :key="index"
                 :custom-style="customStyle"
                 :itemData="item"></real-time>
    </div>

    <div class="set"
         v-loading="jointRateLoading">
      <real-time class="real-time"
                 v-for="(item,index) in jointRateList"
                 :key="index"
                 :custom-style="customStyle"
                 :itemData="item"></real-time>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RealTime from '@/dss-da/src/components/real-time.vue';
import atvApi from '@/dss-da/src/api/atv.js';

export default {
  name: 'AtvIndicator',

  components: {
    RealTime
  },

  data() {
    return {
      pctLoading: false,
      pitLoading: false,
      jointRateLoading: false,
      pacList: [
        { realName: '昨日平均客单价', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本周平均客单价', realCount: '-', ringRatio: '0' },
        { realName: '本月平均客单价', realCount: '-', ringRatio: '0' },
        { realName: '本季平均客单价', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本年平均客单价', realCount: '-', ringRatio: '0' }
      ],
      pitList: [
        { realName: '昨日平均件单价', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本周平均件单价', realCount: '-', ringRatio: '0' },
        { realName: '本月平均件单价', realCount: '-', ringRatio: '0' },
        { realName: '本季平均件单价', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本年平均件单价', realCount: '-', ringRatio: '0' }
      ],
      jointRateList: [
        { realName: '昨日连带率', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本周连带率', realCount: '-', ringRatio: '0' },
        { realName: '本月连带率', realCount: '-', ringRatio: '0' },
        { realName: '本季连带率', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本年连带率', realCount: '-', ringRatio: '0' }
      ],
      customStyle: {
        width: '20%',
        margin: '0 0 20px 0'
      }
    };
  },

  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    }),

    queryParams() {
      return {
        pageSize: 100,
        pageNo: 1,
        storeId: this.selectedStore.id
      };
    }
  },

  watch: {
    selectedStore: {
      deep: true,
      handler(newVal, oldVal) {
        this.queryParams.storeId = this.selectedStore.id;
        if (oldVal != null) {
          this.apiGetPctIndicator();
          this.apiGetPitIndicator();
          this.apiGetJointRateIndicator();
        }
      }
    }
  },

  mounted() {
    this.apiGetPctIndicator();
    this.apiGetPitIndicator();
    this.apiGetJointRateIndicator();
  },

  methods: {
    apiGetPctIndicator() {
      this.pctLoading = true;
      let params = {
        ...this.queryParams
      };

      atvApi
        .getAtvPctIndicator(params)
        .then(res => {
          let data = res.data || [];
          if (data && data.length >= 1) {
            this.parsePacData(data[0]);
          }
        })
        .catch(err => {
          console.error('get order indicator error', err);
        })
        .always(() => {
          this.pctLoading = false;
        });
    },

    apiGetPitIndicator() {
      this.pitLoading = true;
      let params = {
        ...this.queryParams
      };

      atvApi
        .getAtvPitIndicator(params)
        .then(res => {
          let data = res.data || [];
          if (data && data.length >= 1) {
            this.parsePitData(data[0]);
          }
        })
        .catch(err => {
          console.error('get order indicator error', err);
        })
        .always(() => {
          this.pitLoading = false;
        });
    },

    apiGetJointRateIndicator() {
      this.jointRateLoading = true;
      let params = {
        ...this.queryParams
      };

      atvApi
        .getAtvJointRateIndicator(params)
        .then(res => {
          let data = res.data || [];
          if (data && data.length >= 1) {
            this.parseJointRateData(data[0]);
          }
        })
        .catch(err => {
          console.error('get order indicator error', err);
        })
        .always(() => {
          this.jointRateLoading = false;
        });
    },

    parsePacData(data) {
      if (!data) {
        return;
      }
      const {
        dayPac,
        dayPacMOM,
        dayPacYOY,
        monthPac,
        monthPacMOM,
        quarPac,
        quarPacMOM,
        quarPacYOY,
        weekPac,
        weekPacMOM,
        yearPac,
        yearPacMOM
      } = data;

      this.pacList[0].realCount = dayPac || 0;
      this.pacList[0].ringRatio = this.computeRate(dayPac, dayPacMOM) || '0';
      this.pacList[0].sameRatio = this.computeRate(dayPac, dayPacYOY) || '0';

      this.pacList[1].realCount = weekPac || 0;
      this.pacList[1].ringRatio = this.computeRate(weekPac, weekPacMOM) || '0';

      this.pacList[2].realCount = monthPac || 0;
      this.pacList[2].ringRatio = this.computeRate(monthPac, monthPacMOM) || '0';

      this.pacList[3].realCount = quarPac || 0;
      this.pacList[3].ringRatio = this.computeRate(quarPac, quarPacMOM) || '0';
      this.pacList[3].sameRatio = this.computeRate(quarPac, quarPacYOY) || '0';

      this.pacList[4].realCount = yearPac || 0;
      this.pacList[4].ringRatio = this.computeRate(yearPac, yearPacMOM) || '0';
    },

    parsePitData(data) {
      if (!data) {
        return;
      }
      const {
        dayUnitPrice,
        dayUnitPriceMOM,
        dayUnitPriceYOY,
        monthUnitPrice,
        monthUnitPriceMOM,
        quarUnitPrice,
        quarUnitPriceMOM,
        quarUnitPriceYOY,
        weekUnitPrice,
        weekUnitPriceMOM,
        yearUnitPrice,
        yearUnitPriceMOM
      } = data;

      this.pitList[0].realCount = dayUnitPrice || 0;
      this.pitList[0].ringRatio = this.computeRate(dayUnitPrice, dayUnitPriceMOM) || '0';
      this.pitList[0].sameRatio = this.computeRate(dayUnitPrice, dayUnitPriceYOY) || '0';

      this.pitList[1].realCount = weekUnitPrice || 0;
      this.pitList[1].ringRatio = this.computeRate(weekUnitPrice, weekUnitPriceMOM) || '0';

      this.pitList[2].realCount = monthUnitPrice || 0;
      this.pitList[2].ringRatio = this.computeRate(monthUnitPrice, monthUnitPriceMOM) || '0';

      this.pitList[3].realCount = quarUnitPrice || 0;
      this.pitList[3].ringRatio = this.computeRate(quarUnitPrice, quarUnitPriceMOM) || '0';
      this.pitList[3].sameRatio = this.computeRate(quarUnitPrice, quarUnitPriceYOY) || '0';

      this.pitList[4].realCount = yearUnitPrice || 0;
      this.pitList[4].ringRatio = this.computeRate(yearUnitPrice, yearUnitPriceMOM) || '0';
    },

    parseJointRateData(data) {
      if (!data) {
        return;
      }
      const {
        dayApr,
        dayAprMOM,
        dayAprYOY,
        monthApr,
        monthAprMOM,
        quarApr,
        quarAprMOM,
        quarAprYOY,
        weekApr,
        weekAprMOM,
        yearApr,
        yearAprMOM
      } = data;

      this.jointRateList[0].realCount = dayApr || 0;
      this.jointRateList[0].ringRatio = this.computeRate(dayApr, dayAprMOM) || '0';
      this.jointRateList[0].sameRatio = this.computeRate(dayApr, dayAprYOY) || '0';

      this.jointRateList[1].realCount = weekApr || 0;
      this.jointRateList[1].ringRatio = this.computeRate(weekApr, weekAprMOM) || '0';

      this.jointRateList[2].realCount = monthApr || 0;
      this.jointRateList[2].ringRatio = this.computeRate(monthApr, monthAprMOM) || '0';

      this.jointRateList[3].realCount = quarApr || 0;
      this.jointRateList[3].ringRatio = this.computeRate(quarApr, quarAprMOM) || '0';
      this.jointRateList[3].sameRatio = this.computeRate(quarApr, quarAprYOY) || '0';

      this.jointRateList[4].realCount = yearApr || 0;
      this.jointRateList[4].ringRatio = this.computeRate(yearApr, yearAprMOM) || '0';
    },

    computeRate(cnt, olderCnt) {
      if (!olderCnt) {
        return 0;
      }
      return parseFloat((cnt - olderCnt) / olderCnt);
    }
  }
};
</script>

<style lang="less" scoped>
.m-order-indicator {
  overflow: hidden;
  .title {
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    margin: 20px 0 10px 20px;
  }
  .set {
    overflow: hidden;
    .real-time {
      float: left;
    }
  }
}
</style>
