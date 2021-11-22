<template>
  <shelf-goods-list-table ref="list" productDetailPrefix="/ticketing-mgr/shelf/detail" :goods-type="goodsType" />
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import ShelfGoodsListTable from '@/dss-wechat3rd/src/components/goods/ShelfGoodsListTable';
export default {
  components: {
    ShelfGoodsListTable
  },
  data() {
    return {
      goodsType: goodsTypeEnum.ticket
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listStoreItemsByType(); // 根据商品类型获取门店下的商品列表
    });
  }
};
</script>
