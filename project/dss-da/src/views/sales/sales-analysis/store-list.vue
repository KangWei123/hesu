<template>
  <div class="storeList da-block"
       v-loading="loding">
    <div class="bar-action-box">
      <span class="bar-title">门店销售额排行</span>

    </div>
    <div class="chart-box">
      <store-rank :data="list"></store-rank>
    </div>

  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart';
import storeRank from '@/dss-da/src/components/store-rank.vue';
import { mapState } from 'vuex';
import api from '@/dss-da/src/api/sales.js';
export default {
  name: 'storeList',

  components: { storeRank, Chart },
  data() {
    return {
      list: [],
      loding: false
    };
  },
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore,
      storeList: state => state.storeList,
      userInfo: 'userInfo'
    })
  },
  watch: {
    selectedStore: {
      deep: true,
      handler() {
        this.getData();
      }
    }
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
      this.loding = true;
      api
        .getStoreData({
          storeId: this.selectedStore.id,
          pageSize: 12,
          pageNo: 1
        })
        .then(rs => {
          this.list = rs.data;
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
