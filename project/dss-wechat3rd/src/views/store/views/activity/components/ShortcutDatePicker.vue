<template>
  <div class="options-date-picker">
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      size="small"
      align="right"
      :clearable="false"
      range-separator="至"
      :picker-options="showPickerOptions"
      style="width: 244px">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name: 'OptionsDatePicker',

    model: {
      prop: 'dateRange'
    },

    props: {
      showShortCut: {
        type: Boolean,
        default: true
      },
      defaultDateRange: {
        type: Array,
        default: function() {
          return [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30), new Date()];
        }
      }
    },

    data() {
      return {
        dateRange: this.defaultDateRange,
        pickerOptions: {
          shortcuts: [
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        }
      };
    },

    computed: {
      showPickerOptions() {
        return this.showShortCut ? this.pickerOptions : null;
      }
    },

    watch: {
      dateRange: {
        immediate: true,
        handler(newVal, oldVal) {
          this.$emit('pick', newVal);
          this.$emit('input', newVal);
        }
      }
    }
  };
</script>

<style lang="less">
  .options-date-picker {
    display: inline-block;
    .filter-left-date {
      height: 36px;
      background: transparent;
      border: 2px solid rgba(1, 35, 52, 0.06);
      color: rgba(1, 35, 52, 0.5);
      border-radius: 2px;

      .el-range-input {
        background: none;
      }
    }

    .el-range-editor--small {
      &.el-input__inner {

        .el-range-input {
          background: none;
        }
      }

      .el-range-separator {
        line-height: 30px;
      }
    }
  }
</style>
