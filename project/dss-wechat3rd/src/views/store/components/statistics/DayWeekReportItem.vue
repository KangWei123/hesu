<template>
  <div class="day-week-report">
    <div class="theme">
      <span class="sign">
        <img src="./dayweeksign.png"/>
      </span>
      <span class="day" @click="goToDayReport">日报</span>
      <span class="week" @click="goToWeekReport">周报</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DayWeekReportItem",

    methods: {
      goToDayReport() {
        this.$emit('day');
      },
      goToWeekReport() {
        this.$emit('week');
      }
    }
  }
</script>

<style lang="less" scoped>
  .day-week-report {
    font-family: PingFangSC-Medium;
    display: flex;
    justify-content: flex-end;
    .theme{

      display: inline-flex;
      justify-content: flex-start;
      align-items: center;

      margin: 8px 0 10px 0;
      line-height: 100%;
      font-size: 18px;
      color: #3B4757;
      letter-spacing: 0;
      width: 189px;
      height: 34px;
      background-color: #fff;
      border-radius: 100px;

      .sign{
        width:33px;
        height:33px;
        line-height: 34px;
        border: solid 1px #E5E9EE;
        border-radius: 100px;
        text-align: center;

      }

      .day {
        cursor: pointer;
        margin-left:13px;
        padding-right: 19px;
        border-right: 1px solid #9CA3AA;
      }
      .week {
        cursor: pointer;
        margin-left:19px;
      }
    }

  }
</style>
