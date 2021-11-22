<template>
  <div>
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/ticketing-mgr/ticket/list' }" replace>
        票务列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加</el-breadcrumb-item>
    </el-breadcrumb>
    <mgr-edit-form :mgr-type="ticketType" back-url="/ticketing-mgr/ticket/list"></mgr-edit-form>
  </div>
</template>

<script>
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
import MgrEditForm from '@/dss-wechat3rd/src/components/mgr/mgr-edit-form.vue';

export default {
  name: 'index',
  components: {
    MgrEditForm
  },
  data() {
    return {
      ticketType: mgrTypeEnum[this.$route.query.mgrLabel]
    };
  }
};
</script>

<style scoped></style>
