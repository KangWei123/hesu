<template>
  <div class="report-header">
    <div>
      <div class="title"><span @click="goToOverview" style="cursor: pointer">客流分析 </span>/<span></span> {{timeUnit}}报</div>
      <div @click="clickShare" class="share-icon-container">
          <div class="share-icon"></div>
          <div>分享</div>
      </div>
    </div> <div class="main-container">
      <div class="time">
        <el-button :disabled="!backOff" @click="clickBackOff">前一{{timeUnit}}</el-button>
        <el-date-picker class="date-picker"
                        v-if="origin === 'day'"
                        v-model="dayValue"
                        type="date"
                        placeholder="选择日期"
                        :picker-options="pickerDateOption"></el-date-picker>
        <el-date-picker class="date-picker"
                        v-else
                        v-model="weekValue"
                        type="week"
                        format="yyyy 第 WW 周"
                        placeholder="选择周"
                        :picker-options="weekPickerDateOption"></el-date-picker>
        <el-button :disabled="!forward" @click="clickForward">后一{{timeUnit}}</el-button>
      </div>
      <div class="type">
        <div @click="clickDaily" :class="{select : origin === 'day',normal: origin !== 'day'}">日报</div>
        <div @click="clickWeekly" :class="{select : origin === 'week',normal: origin !== 'week'}">周报</div>
      </div>
    </div>
  </div>
</template>

<script>
import reportHeaderLess from './report-header.less';
import utils from '@/dss-common/utils';
import date from '@/dss-common/utils/date';
const dayUnitMillis = 86400000; //24 * 60 * 60 * 1000;
const DEFAULT_DATE = date.getDateByDays(new Date(), -1);
//   取上周的星期天23：59：59
const MAX_WEEK = (function() {
  let now = new Date();
  let nowTime = now.getTime();
  let nowDay = now.getDay();
//   这里为什么nowDay不用减1，因为北京时间需要-8小时，而日期选择器默认选择一天的0：0：0这个时间，所以不需要减1
  let maxTime = nowTime - nowTime % dayUnitMillis - (nowDay) * dayUnitMillis - 1;
  return maxTime;
})();

export default {
  data() {
    return {
      dayValue: '',
      weekValue: '',
      forward: true,
      backOff: true,
      origin: '',
      pickerDateOption: {
        disabledDate(time) {
          return time.getTime() > DEFAULT_DATE;
        },
        firstDayOfWeek: 1
      },
      weekPickerDateOption: {
        disabledDate(time) {
          return time.getTime() > MAX_WEEK;
        },
        firstDayOfWeek: 1
      }
    };
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },

  created() {
    if (this.type == 'day') {
      this.clickDaily();
    } else {
      this.clickWeekly();
    }
  },
  computed: {
    timeUnit: function() {
      return this.origin === 'day' ? '日' : '周';
    }
  },

  watch: {
    dayValue: {
      immediate: true,
      handler(newVal, oldVal) {
        //if (!new Date(newVal).getTime() % dayUnitMillis) return;
        //if (!!newVal && this.origin === 'day' && newVal !== oldVal) {
        if (!!newVal && this.origin === 'day') {
          this.checkForward(newVal.getTime());
          const obj = {
            type: 'day',
            startTime: this.formatDate(newVal)
          };
          this.$emit('changeValue', obj);
        }
      }
    },

    weekValue: {
      immediate: true,
      handler(newVal, oldVal) {
        //if (!!newVal && this.origin === 'week' && newVal !== oldVal) {
        if (!!newVal && this.origin === 'week') {
          const startTime = this.formatDate(date.getDateByDays(newVal, -1));
          const endTime = this.formatDate(new Date(startTime).getTime() + dayUnitMillis * 6);
          const obj = {
            type: 'week',
            startTime,
            endTime
          };
          this.checkForward(endTime);
          this.$emit('changeValue', obj);
        }
      }
    }
  },

  methods: {
    goToOverview() {
      this.$router.push('/passflow/overview');
    },
    formatDate(date) {
      return utils.timeFormat(date, 'YYYY-MM-DD');
    },
    clickBackOff() {
      if (this.origin === 'day') {
        let selectTime = new Date(this.dayValue).getTime() - dayUnitMillis;
        this.dayValue = new Date(selectTime);
        this.checkForward(this.dayValue);
      } else {
        let selectTime = new Date(this.weekValue).getTime() - dayUnitMillis * 7;
        this.weekValue = new Date(selectTime);
        this.checkForward(this.weekValue);
      }
    },
    clickForward() {
      if (this.origin === 'day') {
        let selectTime = new Date(this.dayValue).getTime() + dayUnitMillis;
        this.dayValue = new Date(selectTime);
        this.checkForward(this.dayValue);
      } else {
        let selectTime = new Date(this.weekValue).getTime() + dayUnitMillis * 7;
        this.weekValue = new Date(selectTime);
        this.checkForward(this.weekValue);
      }
    },
    checkForward(time) {
      if (this.origin === 'day') {
        this.forward = date.format(new Date(time), 'YYYY-MM-DD') < date.format(DEFAULT_DATE, 'YYYY-MM-DD');
      } else {
        let now = new Date();
        let nowTime = now.getTime();
        let nowDay = now.getDay();
        let monTime = nowTime - nowTime % dayUnitMillis - (nowDay - 1 + 7 - 1) * dayUnitMillis;
        this.forward = new Date(time) < monTime;
      }
    },
    clickDaily() {
      if (this.origin !== 'day') {
        this.origin = 'day';
        this.dayValue = DEFAULT_DATE;
        this.weekValue = '';
        this.checkForward(this.dayValue);
      }
    },

    clickWeekly() {
      if (this.origin !== 'week') {
        this.origin = 'week';
        let now = new Date();
        let nowTime = now.getTime();
        let nowDay = now.getDay();
        let monTime = nowTime - nowTime % dayUnitMillis - (nowDay - 1 + 7 - 1) * dayUnitMillis;
        this.dayValue = '';
        this.weekValue = new Date(monTime);
        this.checkForward(this.weekValue);
      }
    },

    clickShare() {
      this.$emit('share')
    }
  }
};
</script>
