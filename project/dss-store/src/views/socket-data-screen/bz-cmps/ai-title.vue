<template>
  <div class="ai-title">
    <div class="bg"></div>
    <div class="title">
      <full-screen>
        <img class="wkb-logo" src="../../../asserts/images/logo-blue.png" />
      </full-screen>
      <span class="ai-title__text">数据展屏</span>
    </div>
    <div class="time">{{time}}</div>

    <img src="../../../asserts/images/header-left.png" class="left-dec" />
    <img src="../../../asserts/images/header-right.png" class="right-dec" />
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
      const day = now.getDay();
      // const format = `YYYY/MM/DD ${week[day]} HH:mm:ss`;
      const format = 'YYYY/MM/DD HH:mm';
      return `${utils.format(now, format, 8)}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import '../css/base.less';

.ai-title {
  text-align: center;
  font-size: 36px;
  line-height: 36px;
  position: relative;

  .bg {
    width: 1920px;
    height: 800px;
    position: absolute;
    left: 0;
    top: -580px;
    z-index: -1;
    background: radial-gradient(at center top, #586aef, #1a1e37 87%);
  }

  .wkb-logo {
    display: inline-block;
    width: 220px;
    height: 28px;
  }

  .title {
    display: inline-block;
    margin: 52px 0 0;
    color: @font-blue;
  }

  &__text {
    border-left: 1px solid @font-blue;
    padding-left: 15px;
  }

  .time {
    font-size: 16px;
    color: #fff;
    padding-top: 5px;
    line-height: 29px;
    letter-spacing: 1px;
  }

  .left-dec {
    position: absolute;
    top: 0;
    left: 0;
    width: 684px;
    height: 122px;
  }

  .right-dec {
    position: absolute;
    top: 0;
    right: 0;
    width: 684px;
    height: 122px;
  }
}
</style>
