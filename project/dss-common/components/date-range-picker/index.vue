<template>
  <el-date-picker v-bind="$props" v-on="$listeners" />
</template>

<script>
  import { DatePicker } from 'element-ui';
  import { overideProps } from '@/dss-common/utils/vue';

  /**
   * 规范的时间范围选择器
   */
  export default {
    name: 'DateRangePicker',
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
        pickerOptions() {
          const isMonthRange = this.$options.propsData.type === 'monthrange';
          return {
            shortcuts: isMonthRange
              ? [
                  {
                    text: '本月',
                    onClick(picker) {
                      const start = new Date();
                      start.setDate(1);
                      picker.$emit('pick', [start, new Date()]);
                    },
                  },
                  {
                    text: '近一年',
                    onClick(picker) {
                      const start = new Date();
                      start.setFullYear(start.getFullYear() - 1);
                      const end = new Date();
                      picker.$emit('pick', [start, end]);
                    },
                  },
                  {
                    text: '最近六个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setMonth(start.getMonth() - 6);
                      picker.$emit('pick', [start, end]);
                    },
                  },
                ]
              : [
                  {
                    text: '最近一周',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      picker.$emit('pick', [start, end]);
                    },
                  },
                  {
                    text: '最近一个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      picker.$emit('pick', [start, end]);
                    },
                  },
                  {
                    text: '最近三个月',
                    onClick(picker) {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    },
                  },
                ],
          };
        },
      },
    }),
    methods: {},
  };
</script>

<style lang="less" scoped>
  /deep/ .el-range__close-icon {
    line-height: 1.8;
  }
</style>
