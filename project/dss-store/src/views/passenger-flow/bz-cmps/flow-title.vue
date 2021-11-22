<template>
  <div class="flow-title">
    <img class="logo" src="../../../asserts/images/flow/logo.png" />
    <div class="title">
      客流宝实时客流大屏
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="less">
.flow-title {
  position: relative;
  font-size: 42px;
  color: rgba(255,255,255, 1);

  .logo {
    margin-top: 5px;
    width: 71px;
    height: 36px;
    vertical-align: middle;
  }

  .title {
    position: absolute;
    left: 91px;
    top: 0;
    text-align: right;
  }
}
</style>
