<template>
  <comment-list-table ref="list"></comment-list-table>
</template>

<script>
import CommentListTable from '@/dss-wechat3rd/src/components/comment/comment-list-table.vue';
export default {
  components: {
    CommentListTable
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.doSearch(); // 获取评论列表
    });
  }
};
</script>
