<template>
  <div class="seckill-delete-list">
    <activity-list ref="list"
                   :delete-show="true"></activity-list>
  </div>
</template>

<script>
import activityList from './activity/list';
export default {
  components: {
    activityList
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getSeckillList(); // 获取秒杀活动列表
    });
  }
};
</script>
