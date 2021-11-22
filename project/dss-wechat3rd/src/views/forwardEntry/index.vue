<template>
  <div class="permission-container">
    <img class="img-bg"
         src="../../images/403.png"
         alt="">
    <span>抱歉，您无权访问该页面</span>
    <div v-if="isBindMenu"
         class="btn"
         @click="handleGoHome">返回首页</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'forwardEntry',
  data() {
    return {
      isBindMenu: false
    };
  },
  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.isBindMenu = true;
        }
      }
    }
  },
  methods: {
    handleGoHome() {
      window.top.location.href = '/wkb.html';
    }
  }
};
</script>

<style lang="less" scoped>
.permission-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - @header-height);

  .img-bg {
    width: 390px;
    height: 152px;
    margin-bottom: 30px;
  }

  span {
    font-size: 16px;
    font-family: PingFang-SC-Medium, PingFang-SC;
    font-weight: 500;
  }

  .btn {
    width: 96px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid rgba(216, 216, 216, 1);
    color: #33373e;
    text-align: center;
    margin-top: 25px;
    cursor: pointer;
  }
}
</style>