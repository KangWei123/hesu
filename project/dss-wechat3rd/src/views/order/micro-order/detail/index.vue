<template>
  <div class="order-detail-wrap">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{path: '/micro-order/list'}"
                          replace>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <order-detail></order-detail>
  </div>
</template>

<script>
import OrderDetail from './detail.vue';

export default {
  components: {
    OrderDetail
  }
};
</script>

<style lang="less">
</style>
