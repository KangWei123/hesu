<template>
  <div class="order-analysis-container">
    <order-analysis></order-analysis>
    <el-button size="mini"
               type="primary"
               @click="handleGotoDetail"
               class="analysis-detail-btn">
      查看详细报表
    </el-button>
  </div>
</template>

<script>
import OrderAnalysis from '@/dss-da/src/views/sales/order-analysis/index.vue';
export default {
  name: 'analysis',
  components: {
    OrderAnalysis
  },
  methods: {
    handleGotoDetail() {
      window.top.location.href = '/da.html#/sales/order-analysis';
    }
  }
};
</script>

<style lang="less">
.order-analysis-container {
  background-color: #f2f4f7;
  position: relative;
  .da-sales-order {
    padding-top: 5px;
    .da-title {
      display: none;
    }
  }
  .analysis-detail-btn {
    position: absolute;
    right: 0;
    top: 25px;
  }
}
</style>
