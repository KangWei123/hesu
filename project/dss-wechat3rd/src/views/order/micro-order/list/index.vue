<template>
  <medicine-order-list ref="list"
                       :goods-type="goodsTypeEnum.micro_order"></medicine-order-list>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import MedicineOrderList from '../../medicine-order/medicine-order-list.vue';

export default {
  components: {
    MedicineOrderList
  },
  data() {
    return {
      goodsTypeEnum
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listOrders(); // 获取订单列表
    });
  }
};
</script>
