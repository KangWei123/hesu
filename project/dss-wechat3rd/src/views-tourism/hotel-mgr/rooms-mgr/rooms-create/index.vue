<template>
  <div>
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/hotel-mgr/rooms-mgr/list' }" replace>
        房型列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加</el-breadcrumb-item>
    </el-breadcrumb>
    <mgr-edit-form :mgr-type="hotelType" back-url="/hotel-mgr/rooms-mgr/list"></mgr-edit-form>
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
      hotelType: mgrTypeEnum[this.$route.query.mgrLabel]
    };
  }
};
</script>

<style scoped></style>
