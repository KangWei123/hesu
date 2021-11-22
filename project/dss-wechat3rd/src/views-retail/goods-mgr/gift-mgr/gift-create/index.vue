<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item v-if="isDiscard"
                          :to="{ path: '/retail/goods-mgr/gift-mgr/discard'}"
                          replace>废弃赠品</el-breadcrumb-item>
      <el-breadcrumb-item v-else
                          :to="{ path: '/retail/goods-mgr/gift-mgr/list'}"
                          replace>赠品列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{statusDesc}}赠品</el-breadcrumb-item>
    </el-breadcrumb>
    <mgr-edit-form></mgr-edit-form>
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
    return {};
  },

  computed: {
    isDiscard() {
      if (this.$route.query.status == 0) {
        return true;
      }
      return false;
    },
    statusDesc() {
      if (this.$route.query.giftNo || this.$route.query.giftNo === 0) {
        return '编辑';
      }
      return '添加';
    }
  }
};
</script>