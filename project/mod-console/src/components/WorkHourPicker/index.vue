<template>
  <div class="wot-item">
    <label class="time-label" v-if="label">{{ label }}</label>
    <el-select size="mini" v-model="start" placeholder="请选择" @change="onStartChange" :disabled="disabled">
      <el-option v-for="item in startList" :key="item.k" :label="item.n" :value="item.k"> </el-option>
    </el-select>
    <span>至</span>
    <el-select size="mini" v-model="end" placeholder="请选择" @change="onEndChange" :disabled="disabled">
      <el-option v-for="item in endList" :key="item.k" :label="item.n" :value="item.k"> </el-option>
    </el-select>
    <span class="error">{{ error }}</span>
  </div>
</template>

<script>
  const Max = 48;
  export default {
    props: {
      // 是否设置禁用状态
      disabled: {
        type: Boolean,
      },
      // 休息的标示key值
      restKey: {
        type: Number,
        default: -1,
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
        default: null,
      },
      // 是否支持休息
      ableSupportRest: {
        type: Boolean,
        default: true,
      },
      // 是否是分割的时间段，比如9：00~次日6：00点
      isDivisionRegion: {
        type: Boolean,
        default: true,
      },
    },

    watch: {
      initValue(newVal, oldVal) {
        if (newVal) {
          this.init();
        }
      },
    },

    data() {
      return {
        label: '',
        key: '',
        start: 0,
        end: 1,

        startList: [],
        endList: [],

        error: '',
      };
    },

    mounted() {
      this.init();
    },

    methods: {
      init() {
        const { startTime, endTime, label, key } = this.initValue;
        this.label = label;
        this.key = key;
        if (this.restKey === startTime) {
          this.start = this.restKey;
          this.end = this.restKey;
        } else {
          this.start = (startTime || 0) * 2;
          this.end = (endTime || 0.5) * 2;
        }
        this.startList = this.getTime(0);
        /* 如果是支持当天到次日的时间区间，则需要根据开始时间计算结束时间时间段，否则都默认 */
        if (this.isDivisionRegion) {
          this.setEndListByStartTime();
        } else {
          this.endList = this.getTime(1);
        }
      },

      submit() {
        if (this.end === this.restKey && this.start !== this.restKey) {
          this.error = '格式不正确';
          return false;
        }
        return {
          startTime: this.start === this.restKey ? this.restKey : (this.start - 0) / 2,
          endTime: this.end === this.restKey ? this.restKey : (this.end - 0) / 2,
          label: this.label,
          key: this.key,
        };
      },

      notify() {
        this.$emit('change', {
          startTime: this.start === this.restKey ? this.restKey : (this.start - 0) / 2,
          endTime: this.end === this.restKey ? this.restKey : (this.end - 0) / 2,
          label: this.label,
          key: this.key,
        });
      },

      onStartChange() {
        this.error = '';
        if (this.start === this.restKey) {
          this.end = this.restKey;
        } else {
          if (this.end === this.restKey || this.end <= this.start) {
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

      // 监听结束时间的改变事件
      onEndChange() {
        if (this.end === this.restKey) {
          this.start = this.restKey;
        } else {
          if (this.start === this.restKey || (this.end <= this.start && this.end !== 0)) {
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
        const list = this.ableSupportRest ? [{ k: this.restKey, n: '休息' }] : [];
        let cur = 0;
        let isOdd = false;
        let i = 0;
        if (time === this.restKey) {
          return list;
        }

        function getBefore(cur) {
          cur = parseInt(cur / 2);
          const over = cur >= 24;
          if (over) {
            cur -= 24;
          }
          cur = cur > 9 ? cur : '0' + cur;
          return over ? '次日' + cur : cur;
        }

        // 00:00 00:30 01:00 01:30 02:00
        // 0     1     2     3     4
        for (; i < Max; i++) {
          cur = i + time;
          isOdd = cur % 2 === 0; // 偶数
          //
          if (cur < 96) {
            list.push({
              k: cur,
              n: getBefore(cur) + ':' + (isOdd ? '00' : '30'),
            });
          }
        }
        return list;
      },
    },
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
