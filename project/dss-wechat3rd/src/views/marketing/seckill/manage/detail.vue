<template>
  <SeckillDetail :marketing-type="goodsTypeEnum.seckill" />

</template>

<script>
import SeckillDetail from '@/dss-wechat3rd/src/views/order/detail/order-detail.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

export default {
  components: {
    SeckillDetail
  },
  data() {
    return {
      goodsTypeEnum
    };
  },
  methods: {
    handleTabClick() {},
    handleShowDetail(e) {
      console.log('参数--->', e);
    }
  }
};
</script>

<style lang="less">
</style>