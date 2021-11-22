indicator
<template>
  <div class="m-order-indicator"
       v-loading="loading">
    <div class="title">订单指标</div>

    <div class="set">
      <real-time class="real-time"
                 v-for="(item,index) in dataList"
                 :key="index"
                 :itemData="item"></real-time>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RealTime from '@/dss-da/src/components/real-time.vue';
import orderApi from '@/dss-da/src/api/order.js';

export default {
  name: 'OrderIndicator',

  components: {
    RealTime
  },

  data() {
    return {
      loading: false,
      dataList: [
        { realName: '昨日订单量', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本周订单量', realCount: '-', ringRatio: '0' },
        { realName: '本月订单量', realCount: '-', ringRatio: '0' },
        { realName: '本季订单量', realCount: '-', sameRatio: '0', ringRatio: '0' },
        { realName: '本年订单量', realCount: '-', ringRatio: '0' }
      ]
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
          this.apiGetOrderIndicator();
        }
      }
    }
  },

  mounted() {
    this.apiGetOrderIndicator();
  },

  methods: {
    apiGetOrderIndicator() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      orderApi
        .getOrderIndicator(params)
        .then(res => {
          let data = res.data || [];
          if (data && data.length >= 1) {
            this.parseData(data[0]);
          }
        })
        .catch(err => {
          console.error('get order indicator error', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    parseData(data) {
      if (!data) {
        return;
      }
      const {
        weekOrderCnt,
        quarOrderCntYOY,
        yearOrderCnt,
        dayOrderCntYOY,
        weekOrderCntMOM,
        quarOrderCnt,
        dayOrderCnt,
        quarOrderCntMOM,
        dayOrderCntMOM,
        yearOrderCntMOM,
        monthOrderCntMOM,
        monthOrderCnt
      } = data;

      this.dataList[0].realCount = dayOrderCnt || 0;
      this.dataList[0].ringRatio = this.computeRate(dayOrderCnt, dayOrderCntMOM) || '0';
      this.dataList[0].sameRatio = this.computeRate(dayOrderCnt, dayOrderCntYOY) || '0';

      this.dataList[1].realCount = weekOrderCnt || 0;
      this.dataList[1].ringRatio = this.computeRate(weekOrderCnt, weekOrderCntMOM) || '0';

      this.dataList[2].realCount = monthOrderCnt || 0;
      this.dataList[2].ringRatio = this.computeRate(monthOrderCnt, monthOrderCntMOM) || '0';

      this.dataList[3].realCount = quarOrderCnt || 0;
      this.dataList[3].ringRatio = this.computeRate(quarOrderCnt, quarOrderCntMOM) || '0';
      this.dataList[3].sameRatio = this.computeRate(quarOrderCnt, quarOrderCntYOY) || '0';

      this.dataList[4].realCount = yearOrderCnt || 0;
      this.dataList[4].ringRatio = this.computeRate(yearOrderCnt, yearOrderCntMOM) || '0';
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
