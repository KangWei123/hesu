<template>
  <div
    class="oa-image-box"
    :style="{
      width: width,
      height: height,
      background: 'url(' + src + ') center center / contain no-repeat'
    }"
  ></div>
</template>
<style rel="stylesheet/less" lang="less">
.oa-image-box {
  display: inline-block;
}
</style>

<script>
export default {
  components: {},
  props: {
    src: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '152px'
    },
    height: {
      type: String,
      default: '84px'
    }
  }
};
</script>