<template>
  <div class="permission-container">
    <img class="img-bg" :src="imgs" alt="">
    <span>抱歉，您无权访问该页面</span>
    <div class="btn" @click="handleGoHome">返回首页</div>
  </div>
</template>

<script>
import img from '@/dss-common/img/403.png';
export default {
  name: 'forwardEntry',
  data() {
    return {
      imgs: img
    };
  },
  methods: {
    handleGoHome() {
      window.top.location.href = '/system-setting.html';
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
    font-size:16px;
    font-family:PingFang-SC-Medium,PingFang-SC;
    font-weight:500;
  }

  .btn {
    width: 96px;
    height: 40px;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid rgba(216,216,216,1);
    color: #33373E;
    text-align: center;
    margin-top: 25px;
    cursor: pointer;
  }
}
</style>