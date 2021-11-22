<template>
  <div class="date-filter">

    <el-button @click="onDayClick"
               class="day-button"
               :type="isDayPrimary">
      日
    </el-button>
    <el-select v-model="computeCurDayOfWeek"
               v-if="showOption"
               :disabled="isDayOfDateType">
      <el-option v-for="item in allDayOfWeeks"
                 :key="item.id"
                 :label="item.name"
                 :value="item.name">
      </el-option>
    </el-select>

    <el-button @click="onWeekClick"
               :type="isWeekPrimary"
               style="margin-left: 10px">
      周
    </el-button>

    <el-button @click="onMonthClick"
               :type="isMonthPrimary">
      月
    </el-button>
  </div>
</template>

<script>
const DateType = {
  DAY: 'D',
  WEEK: 'W',
  MONTH: 'M'
};
export default {
  name: 'DateFilter',
  props: {
    showOption: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dateType: DateType.DAY,
      isDayOfDateType: false,
      curDayOfWeek: { id: 0, name: '全部查看' },

      allDayOfWeeks: [
        { id: 0, name: '全部查看' },
        { id: 2, name: '只看周一' },
        { id: 3, name: '只看周二' },
        { id: 4, name: '只看周三' },
        { id: 5, name: '只看周四' },
        { id: 6, name: '只看周五' },
        { id: 7, name: '只看周六' },
        { id: 1, name: '只看周日' }
      ]
    };
  },

  computed: {
    computeCurDayOfWeek: {
      get() {
        return this.curDayOfWeek && this.curDayOfWeek.name;
      },
      set(val) {
        let lookWeekday = this.allDayOfWeeks.find(item => item.name === val);
        if (!lookWeekday) {
          return;
        }
        this.curDayOfWeek = lookWeekday;
      }
    },

    isDayPrimary() {
      return this.dateType === DateType.DAY ? 'primary' : '';
    },

    isWeekPrimary() {
      return this.dateType === DateType.WEEK ? 'primary' : '';
    },

    isMonthPrimary() {
      return this.dateType === DateType.MONTH ? 'primary' : '';
    }
  },

  watch: {
    curDayOfWeek: {
      immediate: true,
      handler(newVal, oldVal) {
        if (typeof oldVal !== 'undefined') {
          //查看全部，不传dayOfWeek
          if (this.curDayOfWeek.id === 0) {
            this.$emit('filter', {});
          } else {
            this.$emit('filter', { dayOfWeek: this.curDayOfWeek.id });
          }
        }
      }
    }
  },

  methods: {
    onDayClick() {
      if (this.dateType !== DateType.DAY) {
        this.isDayOfDateType = false;
        this.dateType = DateType.DAY;
        //看日的不需要传dateType
        //如果是查看全部，不传dayOfWeek
        if (this.curDayOfWeek.id === 0) {
          this.$emit('filter', {});
        } else {
          this.$emit('filter', { dayOfWeek: this.curDayOfWeek.id });
        }
      }
    },

    onWeekClick() {
      if (this.dateType !== DateType.WEEK) {
        this.isDayOfDateType = true;
        this.dateType = DateType.WEEK;
        //看周、月的不需要dayOfWeek
        this.$emit('filter', { dateType: this.dateType });
      }
    },

    onMonthClick() {
      if (this.dateType !== DateType.MONTH) {
        this.isDayOfDateType = true;
        this.dateType = DateType.MONTH;
        //看周、月的不需要dayOfWeek
        this.$emit('filter', { dateType: this.dateType });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.date-filter {
  padding: 0 0 0 10px;
  display: inline-block;

  //去除button之间因为inline-block产生的自然间隙
  font-size: 0;
  -webkit-text-size-adjust: none;
  .el-input__inner {
    width: 102px;
    border-radius: 0 4px 4px 0;
  }
}
</style>
