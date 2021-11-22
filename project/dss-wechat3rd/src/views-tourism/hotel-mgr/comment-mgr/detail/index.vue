<template>
  <div>
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/hotel-mgr/comment' }" replace>
        评论管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        新增虚拟评论
      </el-breadcrumb-item>
    </el-breadcrumb>
    <comment-form :itemType="goodsTypeEnum.rooms" />
  </div>
</template>
<script>
import commentForm from '@/dss-wechat3rd/src/components/comment/comment-form.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
export default {
  name: 'addComment',
  components: {
    commentForm
  },
  data() {
    return {
      goodsTypeEnum
    };
  }
};
</script>
<style></style>
