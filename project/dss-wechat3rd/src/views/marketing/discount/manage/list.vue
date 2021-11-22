<template>
  <order-list :marketing-type="orderStatusEnum.MARKETING_ORDER.XYFOLD"
               @handleShowDetail="handleShowDetail" />

</template>

<script>
import orderList from '@/dss-wechat3rd/src/views/order/order-list/index.vue';
import orderStatusEnum from '@/dss-wechat3rd/src/constants/orderStatusEnum';

export default {
  components: {
    orderList
  },
  data() {
    return {
      orderStatusEnum
    };
  },
  methods: {
    handleTabClick() {},
    handleShowDetail(e) {
      this.$router.push({
        path: '/marketing/discount/manage/detail',
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

