<template>
  <div class="wot-item">
    <label class="time-label"
           v-if="label">{{label}}</label>
    <el-select size="mini"
               v-model="start"
               placeholder="请选择"
               @change="onStartChange"
               :disabled="disabled">
      <el-option v-for="item in startList"
                 :key="item.k"
                 :label="item.n"
                 :value="item.k">
      </el-option>
    </el-select>
    <span>至</span>
    <el-select size="mini"
               v-model="end"
               placeholder="请选择"
               @change="onEndChange"
               :disabled="disabled">
      <el-option v-for="item in endList"
                 :key="item.k"
                 :label="item.n"
                 :value="item.k">
      </el-option>
    </el-select>
    <span class="error">{{error}}</span>
  </div>
</template>

<script>
const Max = 48;
export default {
  props: {
    //是否设置禁用状态
    disabled: {
      type: Boolean
    },
    //休息的标示key值
    RestKey: {
      type: Number,
      default: -1
    },
    /**
     * 支持初始化值
     * {
     *  startTime:结束时间,
     *  endTime:开始时间,
     *  label:透传的名称,
     *  key:透传key
     * }
     **/
    initValue: {
      type: Object,
      default: null
    },
    // 时间类型，默认为数字，如2表示02:00，2.5表示02:30
    numberOrString: {
      type: String,
      default: 'number'
    },
    //是否支持休息
    ableSupportRest: {
      type: Boolean,
      default: true
    },
    //是否是分割的时间段，比如9：00~次日6：00点
    isDivisionRegion: {
      type: Boolean,
      default: true
    }
  },

  watch: {
    initValue(newVal, oldVal) {
      if (!!newVal) {
        if (null !== newVal.startTime && oldVal.startTime === null) {
          this.init();
        }
      }
    }
  },

  data() {
    return {
      label: '',
      key: '',
      start: 0,
      end: 1,

      startList: [],
      endList: [],

      error: ''
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      let { startTime, endTime, label, key } = this.initValue;
      // 判断父组件应用的时间类型是否为字符串，是则将父组件传进来的时间参数转化为本组件运用的数字类型
      if (this.numberOrString === 'string') {
        const startTimeHour = startTime.split(':')[0];
        const startTimeMinute = startTime.split(':')[1];
        startTime = Number(startTimeHour);
        if (startTimeMinute === '30') {
          startTime = Number(startTimeHour + '.5');
        }

        const endTimeHour = endTime.split(':')[0];
        const endTimeMinute = endTime.split(':')[1];
        endTime = Number(endTimeHour);
        if (endTimeMinute === '30') {
          endTime = Number(endTimeHour + '.5');
        }
      }

      this.label = label;
      this.key = key;
      if (this.RestKey == startTime) {
        this.start = this.RestKey;
        this.end = this.RestKey;
      } else {
        this.start = (startTime || 0) * 2;
        this.end = (endTime || 0.5) * 2;
      }
      this.startList = this.getTime(0);
      /*如果是支持当天到次日的时间区间，则需要根据开始时间计算结束时间时间段，否则都默认*/
      if (this.isDivisionRegion) {
        this.setEndListByStartTime();
      } else {
        this.endList = this.getTime(1);
      }
    },

    submit() {
      if (this.end == this.RestKey && this.start != this.RestKey) {
        this.error = '格式不正确';
        return false;
      }
      return {
        startTime: this.start == this.RestKey ? this.RestKey : (this.start - 0) / 2,
        endTime: this.end == this.RestKey ? this.RestKey : (this.end - 0) / 2,
        label: this.label,
        key: this.key
      };
    },

    notify() {
      let start = this.start == this.RestKey ? this.RestKey : (this.start - 0) / 2;
      let end = this.end == this.RestKey ? this.RestKey : (this.end - 0) / 2;

      // 判断父组件应用的时间类型是否为字符串，是则将本组件运用的数字类型的时间参数转化为父组件需要的字符串类型
      if (this.numberOrString === 'string') {
        start = '' + start;
        if (start < 10) {
          start = '0' + start;
        }
        const startTimeHour = start.split('.')[0];
        const startTimeMinute = start.split('.')[1];
        start = startTimeHour + ':00';
        if (startTimeMinute === '5') {
          start = startTimeHour + ':30';
        }

        end = '' + end;
        if (end < 10) {
          end = '0' + end;
        }
        const endTimeHour = end.split('.')[0];
        const endTimeMinute = end.split('.')[1];
        end = endTimeHour + ':00';
        if (endTimeMinute === '5') {
          end = endTimeHour + ':30';
        }
      }

      this.$emit('change', {
        startTime: start,
        endTime: end,
        label: this.label,
        key: this.key
      });
    },

    onStartChange() {
      this.error = '';
      if (this.start == this.RestKey) {
        this.end = this.RestKey;
      } else {
        if (this.end == this.RestKey || this.end <= this.start) {
          this.end = this.start + 1;
        }
        if (this.isDivisionRegion) {
          this.setEndListByStartTime();
        }
      }
      this.notify();
    },

    setEndListByStartTime() {
      this.endList = this.getTime(this.start + 1);
    },

    //监听结束时间的改变事件
    onEndChange() {
      if (this.end == this.RestKey) {
        this.start = this.RestKey;
      } else {
        if (this.start == this.RestKey || (this.end <= this.start && this.end != 0)) {
          this.start = Math.max(0, this.end - 1);
        }
        // this.setEndList();
      }
      this.notify();
    },

    /**
     * time=>0
     * return=> [
     * 00:00,00:30,01:00,01:30,02:00,
     * ... ,23:30
     * ]获取时间列表
     *
     * @param time
     * @returns {Array}
     */
    getTime: function getTime(time) {
      let list = this.ableSupportRest ? [{ k: this.RestKey, n: '休息' }] : [],
        cur = 0,
        isOdd = false,
        i = 0;
      if (time == this.RestKey) {
        return list;
      }
      function getBefore(cur) {
        cur = parseInt(cur / 2);
        let over = cur >= 24;
        if (over) {
          cur -= 24;
        }
        cur = cur > 9 ? cur : '0' + cur;
        return over ? '次日' + cur : cur;
      }

      //00:00 00:30 01:00 01:30 02:00
      //0     1     2     3     4
      for (; i < Max; i++) {
        cur = i + time;
        isOdd = cur % 2 == 0; //偶数
        //
        if (cur < 96) {
          list.push({
            k: cur,
            n: getBefore(cur) + ':' + (isOdd ? '00' : '30')
          });
        }
      }
      return list;
    }
  }
};
</script>
<style>
.wot-item {
  margin-top: 10px;
}
.wot-item .el-input__suffix {
  height: auto;
}
.wot-item .el-input__icon {
  line-height: 22px;
}

.wot-item .error {
  color: red;
}
</style>
