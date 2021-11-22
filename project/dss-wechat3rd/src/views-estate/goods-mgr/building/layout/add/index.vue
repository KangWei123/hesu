<template>
  <div>
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/estate/goods-mgr/building/list' }" replace>
        楼盘列表
      </el-breadcrumb-item>
      <el-breadcrumb-item
        :to="{
          path: '/estate/goods-mgr/building/list/layout/list',
          query: { estateItemNo: this.$route.query.estateItemNo }
        }"
        replace
      >
        户型列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ state }}户型</el-breadcrumb-item>
    </el-breadcrumb>
    <mgr-edit-form :itemNo="itemNo"></mgr-edit-form>
  </div>
</template>

<script>
import MgrEditForm from './mgr-edit-form.vue';
export default {
  name: 'index',
  components: {
    MgrEditForm
  },
  data() {
    return {
      itemNo: this.$route.query.itemNo
    };
  },
  computed: {
    state: function() {
      if (this.$route.query.itemNo) {
        return '编辑';
      }
      return '添加';
    }
  }
};
</script>

<style scoped></style>
