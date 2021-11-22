<template>
  <div class="scatter da-block">
    <div class="real-title">品类销售额气泡图</div>
    <bargain style="height:320px"
             :url="url"
             :queryParams="params"
             :field="field"></bargain>
  </div>
</template>

<script>
import bargain from '@/dss-da/src/components/bargain.vue';
import api from '@/dss-da/src/api/sales.js';
import { mapState } from 'vuex';
export default {
  name: 'sales-bubble',

  components: { bargain },

  data() {
    return {
      realData: [],
      url: api.URL_SALE_OVERVIEW_APP_BUBBLE,
      params: null,
      field: ['categoryName', 'saleFee', 'saleFeeRate', '销售额']
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
      handler() {
        this.url = api.URL_SALE_OVERVIEW_STORE_BUBBLE;
        if (this.selectedStore.id < 0) {
          this.url = api.URL_SALE_OVERVIEW_APP_BUBBLE;
        }
        this.params = {
          storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null,
          pageSize: 100,
          pageNo: 1
        };
      }
    }
  },
  mounted() {
    this.params = {
      storeId: this.selectedStore.id > 0 ? this.selectedStore.id : null,
      pageSize: 100,
      pageNo: 1
    };
  },
  methods: {}
};
</script>
<style lang="less" scoped>
.scatter {
  height: 380px;
  margin: 20px 0;
  overflow: hidden;
  .real-title {
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
  }
}
</style>
