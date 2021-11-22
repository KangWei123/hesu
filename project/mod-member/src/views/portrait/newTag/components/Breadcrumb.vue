<template>
  <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
    <el-breadcrumb-item :to="{ path: '/portrait/manage/myTag' }" replace>我的标签</el-breadcrumb-item>
    <el-breadcrumb-item>{{ state }}标签</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: 'Breadcrumb',
    computed: {
      state() {
        // todo query tagId
        // 只可查看不可编辑
        if (this.$route.query.tagId || this.$route.query.id) {
          return '查看';
        }
        return '新建';
      },
    },
  };
</script>
