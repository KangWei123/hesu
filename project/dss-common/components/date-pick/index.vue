<template>
  <div class="date-range">
    <span class="date-tip time-item">{{ label }}</span>
    <el-date-picker
      v-model="dateRange"
      class="date-item"
      align="center"
      type="daterange"
      size="mini"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :default-time="['00:00:00', '23:59:59']"
      :clearable="false"
      :editable="false"
      :picker-options="pickerOptions"
    ></el-date-picker>
    <span v-if="visibleShortCut">
      <span
        v-for="(item, index) in shortCutList"
        :key="index"
        class="short-btn"
        :class="chosen != item ? 'default-btn' : 'active-btn'"
        @click="clickShort(item)"
        >{{ item }}天</span
      >
    </span>
    <slot />
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index';

  /**
   * 返回基本的element datepicker的配置项，限制日期选择范围
   * @param  {[type]} minDate [description]
   * @param  {[type]} maxDate [description]
   * @return {[type]}         [description]
   */
  function getDatePickerOptions(minDate, maxDate) {
    return {
      disabledDate(date) {
        if (maxDate && date > maxDate) {
          return true;
        }
        if (minDate && date < minDate) {
          return true;
        }
        return false;
      },
    };
  }

  export default {
    props: {
      label: {
        type: String,
        default: '选择时间：',
      },
      // 显示快捷时间按钮，默认不显示
      visibleShortCut: {
        type: Boolean,
        default: false,
      },
      // 快捷时间项
      shortCutList: {
        type: Array,
        default() {
          return [7, 14, 30, 90];
        },
      },
      // 默认快捷时间项
      defaultChosen: {
        type: Number,
        default: 30,
      },
      minDate: {
        type: Date,
        default: null,
      },
      maxDate: {
        type: Date,
        default() {
          return new Date();
        },
      },
    },
    data() {
      const before = this.maxDate ? this.maxDate.getTime() - 1000 * 60 * 60 * 24 : null;
      const maxDate = this.maxDate ? new Date(new Date(before).toLocaleDateString() + ' 23:59:59') : null; // maxDate 前一天 23:59:59 日期格式
      const minDate = this.minDate ? new Date(this.minDate.toLocaleDateString() + ' 00:00:00') : null;
      const cacheDateRange = this._getLocalDateRange();
      const that = this;
      return {
        chosen: this.defaultChosen, // 默认选中30天
        dateRange: cacheDateRange || utils.getTimeRange(30, new Date(Date.now() - 1000 * 60 * 60 * 24)), // 选中的日期
        pickerOptions: getDatePickerOptions(minDate, maxDate), // 选择前一天的时间；所有分析数据前一天为最新日期
      };
    },
    mounted() {
      this.dateRange = [new Date(this.dateRange[0]), new Date(this.dateRange[1])];
    },
    watch: {
      dateRange: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            // 将日期选择缓存到本地
            window.localStorage.setItem('wk-cache-date', utils.timeFormat(new Date(), 'YYYY-MM-DD'));
            window.localStorage.setItem('wk-date-range', JSON.stringify(newVal));
            this.resetShortChosen(newVal);
            this.$emit('pick', [utils.timeFormat(newVal[0], 'YYYY-MM-DD'), utils.timeFormat(newVal[1], 'YYYY-MM-DD')]);
          }
        },
      },
    },
    methods: {
      clickShort(day) {
        this.chosen = day - 0;
        this.dateRange = utils.getTimeRange(this.chosen, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
      },

      resetShortChosen(dateRange) {
        const formatDate = [utils.timeFormat(dateRange[0], 'YYYY-MM-DD'), utils.timeFormat(dateRange[1], 'YYYY-MM-DD')];
        const endDate = utils.timeFormat(new Date().getTime() - 1000 * 60 * 60 * 24, 'YYYY-MM-DD');
        const chosen = Math.round((new Date(dateRange[1]) - new Date(dateRange[0])) / (1000 * 60 * 60 * 24));
        this.chosen = formatDate[1] === endDate && this.shortCutList.indexOf(chosen) !== -1 ? chosen : '-';
      },

      /* 从本地获取缓存的日期选择
       * 缓存的日期当天有效，第二天失效 */
      _getLocalDateRange() {
        let cacheDateRange = null;

        const cacheDate = window.localStorage.getItem('wk-cache-date');
        const currentDate = utils.timeFormat(new Date(), 'YYYY-MM-DD');
        if (cacheDate && cacheDate == currentDate) {
          const cacheDateRangeStr = window.localStorage.getItem('wk-date-range');
          if (cacheDateRangeStr) {
            cacheDateRange = JSON.parse(cacheDateRangeStr);
          }
        }
        return cacheDateRange;
      },
    },
  };
</script>
<style rel="stylesheet/less" lang="less">
  .date-range {
    display: block;
    font-size: 0;
    padding: 10px 0;

    .short-btn {
      display: inline-block;
      margin-right: 10px;
      padding: 7px 15px;
      width: 66px;
      border-radius: 2px;
      font-size: 12px;
      line-height: 12px;
      border: 1px solid #dcdfe6;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
    }

    .default-btn {
      background: #f5f7fa;
      color: rgba(153, 153, 153, 1);
    }

    .active-btn {
      background: #3879fb;
      color: #fff;
      border: 1px solid #3879fb;
    }

    .short-btn + .short-btn {
      margin-left: 10px;
    }

    .date-tip {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
      display: inline-block;
    }

    .el-date-editor--daterange.el-input__inner {
      width: 220px;
      padding: 3px 0 3px 10px;
    }

    .el-date-editor .el-range__close-icon {
      width: 0;
    }

    .el-range-editor--mini .el-range__icon {
      line-height: 20px;
    }

    .el-range-editor--mini .el-range-separator {
      line-height: 22px;
    }

    .date-item {
      margin-right: 20px;
    }
  }
</style>
