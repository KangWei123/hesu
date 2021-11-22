<template>
  <div class="radar-tip">
    <div class="top-left tip">购买力</div>
    <div class="top-right tip">忠诚度</div>
    <div class="bottom-center tip">促销敏感度</div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="less" scoped>
.radar-tip {
  .tip {
    position: absolute;
    color: #FFF;
    font-size: 14px;
  }
  .top-left {
    top: 140px;
    left: 145px;
  }
  .top-right {
    top: 140px;
    left: 255px;
  }
  .bottom-center {
    top: 235px;
    left: 185px;
  }
}


</style>
