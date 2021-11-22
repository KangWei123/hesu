<template>
  <div class="decorative-box">
    <img src="../../../asserts/images/dec-line.png" class="line1">
    <img src="../../../asserts/images/dec-left.png" class="line2">
    <div class="area"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
};
</script>

<style scoped lang="less">
@import '../css/base.less';

.decorative-box {
  position: relative;
  height: 100%;
}

.area {
  position: absolute;
  top: 0;
  left: 67px;
  width: 1667px;
  height: 861px;
  border-top: 1px solid @border-blue;
  border-left: 1px solid @border-blue;
  border-top-left-radius: 10px;
  box-sizing: border-box;
}

.line1 {
  position: absolute;
  top: 21px;
  width: 68px;
}

.line2 {
  position: absolute;
  bottom: 0;
  left: 56px;
  width: 12px;
}
</style>
