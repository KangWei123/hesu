<template>
  <div class="realtime-date">
    <div style="margin-right: 45px">{{date}}</div>
    <div style="margin-right: 35px">{{time}}</div>
    <div>{{week}}</div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/date.js';

const week = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日'
};

export default {
  data() {
    return {
      time: '',
      date: '',
      week: ''
    };
  },
  created() {
    this.getTime();
    this._threadId = setInterval(() => {
      this.getTime();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this._threadId);
  },
  methods: {
    getTime() {
      const now = new Date();
      const day = now.getDay();

      //const format = 'YYYY 年 MM 月 DD 日 HH:mm:ss';
      this.time = utils.format(now, 'HH:mm:ss');
      this.date = utils.format(now, 'YYYY 年 MM 月 DD 日');
      this.week = week[day];
    }
  }
};
</script>

<style lang="less" scoped>
.realtime-date {
  text-align: right;
  color: white;
  font-size: 30px;

  div {
    display: inline-block;
  }
}
</style>
