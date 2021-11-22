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
  props: {
    dateRange: {
      default: Array,
      value: []
    }
  },
  computed: {
    ...mapState({
      selectedStore: state => state.selectedStore
    })
  },
  watch: {
    dateRange: {
      deep: true,
      handler() {
        this.params = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
      }
    },
    selectedStore: {
      deep: true,
      handler() {
        this.params = {
          storeId: this.selectedStore.id,
          startTime: this.dateRange[0],
          endTime: this.dateRange[1],
          pageSize: 100,
          pageNo: 1
        };
      }
    }
  },
  data() {
    return {
      realData: [],
      url: api.URL_SALE_BUBBLE,
      params: null,
      field: ['categoryName', 'saleFee', 'saleFeeRate', '销售额']
    };
  },
  mounted() {},
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
