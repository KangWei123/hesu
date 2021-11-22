<template>
  <div class="sign-in">
    <span class="label">{{isEnterFaceScore ? '访问人数' : '签到嘉宾'}}：</span><span class="text">{{data.passengerFlowCount}}</span><span class="unit">人</span>
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
    },
    isEnterFaceScore: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="less">
.sign-in {
  width: 100%;
  height: 100%;
  line-height: 55px;
  background-image: url('../../../asserts/images/face-score/sign-bg.png');
  overflow: hidden;
  background-repeat: no-repeat;
  background-size: contain;
  .label {
    font-size: 18px;
    font-family: 'PingFangSC-Regular';
    font-weight: 400;
    color: rgba(124, 250, 255, 1);
    line-height: 25px;
    margin-left: 31px;
  }
  .text {
    font-size: 18px;
    font-family: 'DIN-Medium';
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
  }
  .unit {
    font-size: 18px;
    font-family: 'PingFangSC-Regular';
    font-weight: 500;
    color: rgba(255, 255, 255, 1);
    line-height: 22px;
    margin-left: 1px;
  }
}
</style>
