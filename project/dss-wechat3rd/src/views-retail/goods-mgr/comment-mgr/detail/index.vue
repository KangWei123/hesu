<template>
  <div>
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/comment-mgr/list' }"
                          replace>
        评论管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        新增虚拟评论
      </el-breadcrumb-item>
    </el-breadcrumb>
    <comment-form />
  </div>
</template>
<script>
import commentForm from '@/dss-wechat3rd/src/components/comment/comment-form.vue';
export default {
  name: 'addComment',
  components: {
    commentForm
  },
  data() {
    return {};
  }
};
</script>
