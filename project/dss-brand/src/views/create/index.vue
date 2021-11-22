<template>
  <div class="create-index">
    <el-steps :active="active" process-status="wait" align-center v-if="isShowStep">
      <el-step title="填写品牌信息"></el-step>
      <el-step title="选择体验功能"></el-step>
      <el-step :title="label"></el-step>
    </el-steps>
    <router-view />
  </div>
</template>

<script>
import './index.less';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      active: null,
      isShowStep: true
    };
  },
  computed: {
    ...mapState({
      env: 'env'
    }),
    label() {
      return this.env.ESTATE ? '创建首个房产区域' : '创建首家门店';
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        switch (val.path) {
          case '/create/brand':
            this.active = 1;
            this.isShowStep = true;
            break;
          case '/create/function':
            this.active = 2;
            this.isShowStep = true;
            break;
          case '/create/brand-success':
            this.active = 2;
            this.isShowStep = true;
            break;
          case '/create/store':
            this.active = 3;
            this.isShowStep = true;
            break;
          case '/create/store-success':
            this.active = 3;
            this.isShowStep = false;
            break;
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    switch (this.$route.path) {
      case '/create/brand':
        this.active = 1;
        this.isShowStep = true;
        break;
      case '/create/function':
        this.active = 2;
        this.isShowStep = true;
        break;
      case '/create/brand-success':
        this.active = 2;
        this.isShowStep = true;
        break;
      case '/create/store':
        this.active = 3;
        this.isShowStep = true;
        break;
      case '/create/store-success':
        this.active = 3;
        this.isShowStep = false;
        break;
    }
  }
};
</script>
