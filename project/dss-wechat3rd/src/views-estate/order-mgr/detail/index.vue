<template>
  <order-detail />
</template>

<script>
import orderDetail from '@/dss-wechat3rd/src/views/order/detail/order-detail.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

export default {
  components: {
    orderDetail
  },
  data() {
    return {
      goodsTypeEnum
    };
  },
  methods: {}
};
</script>

<style lang="less"></style>
