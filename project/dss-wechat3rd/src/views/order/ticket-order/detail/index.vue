<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{path: '/ticket-order/list'}"
                          replace>
        票务订单
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        订单详情
      </el-breadcrumb-item>
    </el-breadcrumb>
    <order-detail></order-detail>
  </div>
</template>

<script>
  import OrderDetail from '@/dss-wechat3rd/src/bz_components/order-detail/index.vue';
  export default {
    components: {
      OrderDetail
    }
  };
</script>
