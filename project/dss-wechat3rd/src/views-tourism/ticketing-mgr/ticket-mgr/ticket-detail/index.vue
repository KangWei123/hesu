<template>
  <div>
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/ticketing-mgr/ticket/list' }" replace>
        票务列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <mgr-edit-form
      :item-no="$route.query.itemNo"
      :is-disabled-edit="isDisabledEdit"
      :mgr-type="ticketType"
      backUrl="/ticketing-mgr/ticket/list"
    ></mgr-edit-form>
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

  computed: {
    // 是否不允许编辑敏感信息
    isDisabledEdit() {
      if (this.$route.query.isDisabledEdit && this.$route.query.isDisabledEdit != 0) {
        return true;
      }
      return false;
    }
  },

  data() {
    return {
      ticketType: mgrTypeEnum[this.$route.query.mgrLabel]
    };
  }
};
</script>

<style scoped></style>
