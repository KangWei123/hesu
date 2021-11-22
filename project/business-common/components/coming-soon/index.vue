<template>
  <div class="coming-soon-container">
    <img class="logo" src="./coming-soon.png">
    <div class="text">敬请期待</div>
  </div>
</template>

<script>
  export default {
    name: "coming-soon"
  }
</script>

<style lang="less">
  .coming-soon-container {
    text-align: center;
    padding-top: 100px;
    box-sizing: border-box;
    .logo {
      width: 300px;
      height: 164px;
    }
    .text {
      margin-top: 16px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #717378;
      line-height: 22px;
    }
  }
</style>
