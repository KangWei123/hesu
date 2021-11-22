<template>
  <div class="ai-title">
    <img class="logo"
         src="../../../asserts/images/face-score/logo.png" />
    <div class="head-title">
      <img class="title-bg"
           src="../../../asserts/images/face-score/title-bg.png" />
      <div class="title">
        {{wkbTitle ? wkbTitle : '惟客数据'}}AI人脸互动展屏
      </div>
    </div>
    <div class="time">{{time}}</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';
import FullScreen from './full-screen-btn.vue';
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
  props: {
    wkbTitle: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      time: this.getTime()
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
      const format = 'YYYY-MM-DD HH:mm:ss';
      return `${utils.format(now, format, 8)}`;
    }
  }
};
</script>

<style scoped lang="less">
.ai-title {
  position: relative;
  font-size: 34px;
  line-height: 34px;
  font-family: 'PingFangSC-Regular';
  .logo {
    position: absolute;
    left: 50px;
    top: 49px;
    width: 144px;
    height: 24px;
  }
  .head-title {
    .title-bg {
      position: absolute;
      left: 213px;
      top: 0px;
      width: 1498px;
      height: 129px;
      z-index: -1;
    }
    .title {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 45px;
      display: inline-block;
      font-weight: 900;
      background: linear-gradient(90deg, rgba(135, 245, 249, 1) 0%, rgba(32, 140, 238, 1) 100%);
      -webkit-background-clip: text;
      color: transparent;
    }
  }
  .time {
    display: inline-block;
    position: absolute;
    right: 50px;
    top: 47px;
    font-size: 24px;
    font-family: 'DIN-Medium';
    color: rgba(124, 250, 255, 1);
    line-height: 29px;
  }
}
</style>
