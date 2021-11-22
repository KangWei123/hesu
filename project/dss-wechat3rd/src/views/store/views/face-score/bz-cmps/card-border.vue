<template>
  <div class="card-border">
    <img class="leftTop"
         src="../../../asserts/images/face-score/leftTop.png" />
    <img class="rightBottom"
         src="../../../asserts/images/face-score/rightBottom.png" />

  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.card-border {
  position: absolute;
  width: 100%;
  height: 100%;
  .leftTop {
    width: 65px;
    height: 58px;
    position: absolute;
    top: -7px;
    left: -6px;
    z-index: 1;
  }
  .rightBottom {
    width: 65px;
    height: 58px;
    position: absolute;
    right: -6px;
    bottom: -7px;
    z-index: 1;
  }
}
</style>
