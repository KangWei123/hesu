<template>
  <div class="overview">
    <div class="title" style="top: 23px;left: 80px;width: 354px;">进店客流量</div>
    <div class="num" style="top: 55px;left: 80px;width: 354px;">{{data.customer|thousands}}</div>
    <div class="title" style="top: 23px;left: 500px;width: 354px;">过店客流量</div>
    <div class="num" style="top: 55px;left: 500px;width: 354px;">{{data.passenger|thousands}}</div>
    <div class="title" style="top: 137px;left: 80px;width: 447px;">累积客流量</div>
    <div class="num" style="top: 169px;left: 80px;width: 447px;">{{data.historyCount|thousands}}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {
          customer: 123,
          passenger: 12312,
          historyCount: 123123
        };
      }
    }
  }
};
</script>

<style scoped lang="less">
.overview {
  width: 100%;
  height: 100%;
  position: relative;
  background: url(../../../asserts/images/flow/overview.png);
  background-size: cover;

  .num {
    height:62px;
    line-height: 62px;
    background:rgba(21,21,52,1);
    border-radius: 31px;
    position: absolute;
    color: white;
    font-size:40px;
    text-align: center;
  }

  .title {
    font-size:16px;
    color: white;
    position: absolute;
    text-align: center;
    height: 22px;
  }
}
</style>
