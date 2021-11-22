<template>
  <div class="order-detail-wrap">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: breadcrumbPath }" replace>{{ breadcrumbPathName }}</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <order-detail></order-detail>
  </div>
</template>

<script>
import orderDetail from './order-detail/index.vue';

export default {
  components: {
    orderDetail
  },
  data() {
    return {
      breadcrumbPath: '/broker/list', // 面包屑路径
      breadcrumbPathName: '代客列表' // 面包屑路径名称
    };
  }
};
</script>
