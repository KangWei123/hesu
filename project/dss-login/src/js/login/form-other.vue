<template>
  <div class="footer-other">
    <span>其他登录方式：</span><img src="../../images/qf-logo.png" @click="handleQFLogin" />
  </div>
</template>

<script>
  export default {
    mixins: [],
    data() {
      return {};
    },
    methods: {
      handleQFLogin() {
        location.href = '/c/oidc/redirectToAuthUrl';
      },
    },
  };
</script>

<style lang="less" scoped></style>
