<template>
  <gift-list ref="giftList"
             is-del-list></gift-list>
</template>
<script>
import GiftList from './list.vue';

export default {
  components: { GiftList },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.giftList.getList(false); // 获取列表
    });
  }
};
</script>
