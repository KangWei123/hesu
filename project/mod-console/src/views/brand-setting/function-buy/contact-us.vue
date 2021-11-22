<template>
  <div class="contact-us">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/brand-setting/function-buy' }">功能订购</el-breadcrumb-item>
      <el-breadcrumb-item>联系我们</el-breadcrumb-item>
    </el-breadcrumb>
    <contact-us></contact-us>
  </div>
</template>
<script>
  import contactUs from '@/business-common/components/contact-us/index.vue';

  export default {
    components: { contactUs },
    data() {
      return {};
    },
  };
</script>
<style lang="less">
  .contact-us {
    .wkt-breadcrumb-container {
      background-color: #f5f7fa;
    }
  }
</style>
