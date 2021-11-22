<template>
  <div class="container">
    <el-button v-if="selectRange['day']" :disabled="$props.disabled" @click="handleClick('day')" plain>当日</el-button>
    <el-button v-if="selectRange['week']" :disabled="$props.disabled" @click="handleClick('week')" plain
      >当周</el-button
    >
    <el-button v-if="selectRange['month']" :disabled="$props.disabled" @click="handleClick('month')" plain
      >当月</el-button
    >
    <el-button v-if="selectRange['year']" :disabled="$props.disabled" @click="handleClick('year')" plain
      >当年</el-button
    >
    <el-date-picker v-bind="$props" v-on="$listeners" />
  </div>
</template>

<script>
  import { DatePicker } from 'element-ui';
  import dayjs from 'dayjs';
  import { overideProps } from '@/dss-common/utils/vue';

  const today = dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss');

  /**
   * 规范的时间范围选择器
   */
  export default {
    name: 'DateRangePickerSelect',
    props: overideProps(DatePicker, {
      defaultProps: {
        type: 'datetimerange',
        clearable: true,
        defaultTime() {
          return ['00:00:00', '23:59:59'];
        },
        /**
         * 规范使用
         */
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        rangeSeparator: '至',
        align: 'right',
        startPlaceholder() {
          const isMonthRange = this.$options.propsData.type === 'monthrange';
          return isMonthRange ? '开始月份' : '开始日期';
        },
        endPlaceholder() {
          const isMonthRange = this.$options.propsData.type === 'monthrange';
          return isMonthRange ? '结束月份' : '结束日期';
        },
      },
      extendsProps: {
        defaultMonth: {
          type: Boolean,
          default: true,
        },
        startWithMondayOfWeek: {
          type: Boolean,
          default: true,
        },
        selectRange: {
          type: Object,
          default() {
            return { day: true, week: false, month: true, year: true };
          },
        },
      },
    }),
    mounted() {
      if (this.defaultMonth) {
        this.handleClick('month');
      }
    },
    methods: {
      handleClick(key) {
        let start = '';
        const end = today;
        switch (key) {
          case 'day':
            start = dayjs(end).startOf('day').format('YYYY-MM-DD HH:mm:ss');
            break;
          case 'week':
            if (this.startWithMondayOfWeek) {
              start = dayjs(end).startOf('week').subtract(-1, 'day').format('YYYY-MM-DD HH:mm:ss');
            } else {
              start = dayjs(end).startOf('week').format('YYYY-MM-DD HH:mm:ss');
            }
            break;
          case 'month':
            start = dayjs(end).startOf('month').format('YYYY-MM-DD HH:mm:ss');
            break;
          case 'year':
            start = dayjs(end).startOf('year').format('YYYY-MM-DD HH:mm:ss');
            break;
        }
        this.$emit('input', [start, end]);
      },
    },
  };
</script>

<style lang="less" scoped>
  .container {
    display: flex;
  }

  /deep/ .el-button {
    margin-left: 0 !important;
    margin-right: 10px !important;
    border-radius: 2px !important;
  }
</style>
