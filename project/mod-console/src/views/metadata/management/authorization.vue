<template>
  <div class="authorization">
    <div class="authorization-box">
      <img v-if="type === 'success'" src="../../../images/metadata/success.png" alt="" class="img" />
      <img v-else src="../../../images/metadata/fail_icon.png" alt="" class="img" />
      <div class="txt">{{ type === 'success' ? '授权成功' : '授权失败' }}</div>
      <div class="msg" v-if="type !== 'success'">失败原因：{{ errorMessage }}</div>
      <div class="btn" :class="{ fail: type !== 'success' }" @click="goBack">关闭</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Authorization',
    data() {
      return {
        type: 'error',
        errorMessage: '',
      };
    },
    mounted() {
      this.type = this.$route.query.type || 'error';
      this.errorMessage = this.$route.query.errorMessage ? decodeURIComponent(this.$route.query.errorMessage) : '';
    },
    methods: {
      goBack() {
        this.$router.push('/metadata/management');
        // if (navigator.userAgent.indexOf('MSIE') > 0) {
        //   if (navigator.userAgent.indexOf('MSIE 6.0') > 0) {
        //     window.opener = null;
        //     window.close();
        //   } else {
        //     window.open('', '_top');
        //     window.top.close();
        //   }
        // } else if (navigator.userAgent.indexOf('Firefox') > 0) {
        //   window.location.href = 'about:blank ';
        // } else {
        //   window.opener = null;
        //   window.open('', '_self', '');
        //   window.close();
        // }
      },
    },
  };
</script>

<style scoped lang="less">
  .authorization {
    height: calc(100vh - 56px);
    background-color: #f5f7fa;
    .authorization-box {
      height: 100vh;
      margin: 20px 20px 0px 20px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .img {
        width: 300px;
        height: 200px;
        display: block;
      }
      .txt {
        padding-top: 8px;
        font-size: 24px;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.85);
      }
      .msg {
        font-size: 14px;
        line-height: 32px;
        color: #f56c6c;
        padding: 8px 0 32px;
      }
      .btn {
        margin-top: 72px;
        width: 180px;
        height: 40px;
        background: #fa7516;
        border-radius: 2px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
        &.fail {
          margin-top: 0;
        }
      }
    }
  }
</style>
