<template>
  <div class="wot-item">
    <el-select size="mini"
               v-model="start"
               placeholder="请选择"
               @change="onStartChange"
               :disabled="disabled">
      <el-option v-for="item in startList"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
    <span>至</span>
    <el-select size="mini"
               v-model="end"
               placeholder="请选择"
               @change="onEndChange"
               :disabled="disabled">
      <el-option v-for="item in endList"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
// 每月日期选择项
const dayOptions = [
  { label: '1日', value: 1 },
  { label: '2日', value: 2 },
  { label: '3日', value: 3 },
  { label: '4日', value: 4 },
  { label: '5日', value: 5 },
  { label: '6日', value: 6 },
  { label: '7日', value: 7 },
  { label: '8日', value: 8 },
  { label: '9日', value: 9 },
  { label: '10日', value: 10 },
  { label: '11日', value: 11 },
  { label: '12日', value: 12 },
  { label: '13日', value: 13 },
  { label: '14日', value: 14 },
  { label: '15日', value: 15 },
  { label: '16日', value: 16 },
  { label: '17日', value: 17 },
  { label: '18日', value: 18 },
  { label: '19日', value: 19 },
  { label: '20日', value: 20 },
  { label: '21日', value: 21 },
  { label: '22日', value: 22 },
  { label: '23日', value: 23 },
  { label: '24日', value: 24 },
  { label: '25日', value: 25 },
  { label: '26日', value: 26 },
  { label: '27日', value: 27 },
  { label: '28日', value: 28 },
  { label: '29日', value: 29 },
  { label: '30日', value: 30 },
  { label: '31日', value: 31 }
];

export default {
  props: {
    //是否设置禁用状态
    disabled: {
      type: Boolean
    },
    // 初始化的选中日期
    initValue: {
      type: Object,
      default: null
    },
    // 是否分割的日期时间段
    isDivisionRegion: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      startList: dayOptions,
      start: 1,
      endList: dayOptions,
      end: 2
    };
  },

  watch: {
    initValue(newVal, oldVal) {
      if (newVal && newVal.startDay && newVal.endDay) {
        this.start = newVal.startDay;
        this.end = newVal.endDay;
      }
    }
  },

  mounted() {},
  methods: {
    /**
     * 开始日期的改变
     */
    onStartChange() {
      // 判断是否分割的日期时间段
      if (this.isDivisionRegion) {
        const options = this.$plain(dayOptions);
        if (this.start > this.end) {
          this.end = this.start;
        }
        this.endList = options.slice(this.start - 1, options.length);
      }
      this.notify(); //完成变更，向父组件发射事件通知日期变更
    },

    /**
     * 结束日期的改变
     */
    onEndChange() {
      this.notify(); //完成变更，向父组件发射事件通知日期变更
    },

    /**
     * 完成变更，向父组件发射事件通知日期变更
     */
    notify() {
      this.$emit('change', {
        startDay: this.start,
        endDay: this.end
      });
    }
  }
};
</script>
<style lang="less" scoped>
.wot-item {
  margin-top: 10px;
  .el-select {
    width: 80px !important;
    height: 30px;
    line-height: 30px;
  }
  .el-input__suffix {
    height: auto;
  }
  .el-input__icon {
    line-height: 22px;
  }
}
</style>

