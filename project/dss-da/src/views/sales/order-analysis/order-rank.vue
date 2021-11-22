<template>
  <div class="da-block m-order-rank"
       v-loading="loding">
    <div class="bar-action-box">
      <span class="bar-title">门店订单量排行</span>
    </div>

    <div class="or-chart">
      <store-rank :data="dataList"
                  field="orderCnt"></store-rank>
    </div>
  </div>
</template>

<script>
import storeRank from '@/dss-da/src/components/store-rank.vue';
import { mapState } from 'vuex';
import orderApi from '@/dss-da/src/api/order.js';

export default {
  name: 'OrderRank',

  components: {
    storeRank
  },

  data() {
    return {
      loding: false,
      queryParams: {
        pageSize: 12,
        pageNo: 1,
        storeId: null
      },
      dataList: []
    };
  },

  computed: {
    ...mapState({
      storeList: state => state.storeList
    })
  },

  mounted() {
    this.apiGetData();
  },

  methods: {
    getStoreName() {
      this.dataList.forEach(item => {
        let store = this.storeList.find(it => it.id === item.storeId) || {};
        item.storeName = store.name || '';
      });
    },

    apiGetData() {
      this.loding = true;
      let params = {
        ...this.queryParams
      };

      orderApi
        .getStoreOrderRank(params)
        .then(res => {
          this.dataList = res.data || [];
          this.getStoreName();
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
.m-order-rank {
  overflow: hidden;
  min-height: 240px;
  box-sizing: border-box;
  position: relative;

  .or-chart {
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
