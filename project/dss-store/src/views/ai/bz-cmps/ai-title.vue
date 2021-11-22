<template>
  <div class="ai-title">
    <full-screen>
      <img class="wkb-logo" src="../../../asserts/images/logo.png" />
    </full-screen>
    <p class="ai-title__text">AI 人脸数据大屏</p>

    <img class="bg" src="../../../asserts/images/line1.png" />
    <div class="title">
      <div></div>
      <div class="time">{{time}}</div>
    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import FullScreen from './full-screen-btn.vue';
import logo from '@/dss-common/img/new-portal/common/logo.png';
const week = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  0: '星期日'
};

export default {
  components: {
    FullScreen
  },
  data() {
    return {
      time: this.getTime(),
      logo
    };
  },
  created() {
    this.time = this.getTime();
    this._threadId = setInterval(() => {
      this.time = this.getTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this._threadId);
  },
  methods: {
    getTime() {
      const now = new Date();
      const day = now.getDay();
      const format = `YYYY/MM/DD ${week[day]} HH:mm:ss`;
      return `${utils.format(now, format, 8)}`;
    }
  }
};
</script>

<style scoped lang="less">
.ai-title {
  position: relative;
  font-size: 50px;
  font-family: Helvetica;
  color: rgba(255, 255, 255, 0.8018);

  .bg {
    width: 100%;
    height: 100%;
  }

  .wkb-logo {
    position: absolute;
    width: 207px;
    height: 27px;
    top: 13px;
    right: 334px;
  }
  .title {
    position: absolute;
    right: 51px;
    bottom: 16px;
    text-align: right;
    font-size: 20px;
    color: #ffffff;
  }
  &__text {
    position: absolute;
    font-size: 36px;
    line-height: 36px;
    color: rgba(255, 255, 255, 1);
    top: 9px;
    margin: 0;
    right: 50px;
  }

  .time {
    font-size: 20px;
  }
}
</style>
