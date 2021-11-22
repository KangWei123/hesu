<template>
  <div>
    <el-breadcrumb class="wkt-breadcrumb-container"
                   separator="/">
      <el-breadcrumb-item :to="{ path: `/marketing/redpacket/redpacket-mgr`}"
                          replace>
        裂变红包
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{redpacketOperate}}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <redpacket-form />

  </div>
</template>
<script>
import redpacketForm from './redpacket-form.vue';
export default {
  name: 'addRedpacket',
  components: {
    redpacketForm
  },
  data() {
    return {};
  },
  computed: {
    redpacketOperate() {
      if (this.$route.query.planId) {
        return '查看红包';
      }
      return '新建红包';
    }
  }
};
</script>
<style>
.redpacke-breadcrumb {
  margin: 10px 0 20px 0;
  font-size: 12px;
}
</style>
