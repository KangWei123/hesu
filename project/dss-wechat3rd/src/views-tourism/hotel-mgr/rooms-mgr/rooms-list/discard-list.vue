<template>
  <discard-list-table ref="list" :goodsType="mgrTypeEnum.hotel"></discard-list-table>
</template>

<script>
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import DiscardListTable from '@/dss-wechat3rd/src/components/goods/discard-list-table.vue';

export default {
  name: 'create-goods-list',
  components: { DiscardListTable },
  data() {
    return {
      mgrTypeEnum
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listGoodsByType(); // 根据商品类型获取商品列表
    });
  },

  methods: {}
};
</script>
