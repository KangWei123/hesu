<template>
  <SeckillList :marketing-type="goodsTypeEnum.seckill"
               @handleShowDetail="handleShowDetail" />

</template>

<script>
import SeckillList from '@/dss-wechat3rd/src/views/order/order-list/index.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

export default {
  components: {
    SeckillList
  },
  data() {
    return {
      goodsTypeEnum
    };
  },
  methods: {
    handleTabClick() {},
    handleShowDetail(e) {
      let path = this.$route.path || '/order/list/detail';
      this.$router.push({
        path: '/marketing/seckill/management/detail',
        query: {
          orderNo: e.orderNo + '',
          itemType: e.itemType
        }
      });
    }
  }
};
</script>

<style lang="less">
</style>

