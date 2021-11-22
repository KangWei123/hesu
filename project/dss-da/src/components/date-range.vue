<template>
  <div class="da-date-range">
    <span class="date-tip time-item">{{label}}</span>
    <el-date-picker v-model="dateRange"
                    class="date-item"
                    align="center"
                    type="daterange"
                    size="mini"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :clearable="false"
                    :editable="false"
                    :picker-options="options">
    </el-date-picker>
    <el-button v-if="visibleShortCut"
               size="mini"
               class="short-btn"
               :class="chosen != 7 ? 'default-btn' : ''"
               :type="chosen==7?'primary':''"
               @click="clickShort(7)">7天
    </el-button>
    <el-button v-if="visibleShortCut"
               size="mini"
               class="short-btn"
               :class="chosen != 14 ? 'default-btn' : ''"
               :type="chosen==14?'primary':''"
               @click="clickShort(14)">14天
    </el-button>
    <el-button v-if="visibleShortCut"
               size="mini"
               class="short-btn"
               :class="chosen != 30 ? 'default-btn' : ''"
               :type="chosen==30?'primary':''"
               @click="clickShort(30)">30天
    </el-button>
    <el-button v-if="visibleShortCut"
               size="mini"
               class="short-btn"
               :class="chosen != 90 ? 'default-btn' : ''"
               :type="chosen==90?'primary':''"
               @click="clickShort(90)">90天
    </el-button>
    <slot/>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index';
  import storage from '@/dss-common/utils/storage';

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
      }
    };
  }

  export default {
    props: {
      label: {
        type: String,
        default: '选择时间：'
      },
      //显示快捷时间按钮，默认不显示
      visibleShortCut: {
        type: Boolean,
        default: false
      },
      maxDate: {
        type: Date,
        default: null
      }
    },
    data() {
      const today = this.maxDate || new Date();
      const time = today.getTime(); // -  1000 * 60 * 60 * 24;
      const cacheDateRange = this._getLocalDateRange();
      return {
        chosen: 30, //默认选中30天
        dateRange: cacheDateRange ? cacheDateRange : utils.getTimeRange(30, new Date(time)), //选中的日期
        options: getDatePickerOptions(null, today)
      };
    },

    watch: {
      dateRange: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!!newVal) {
            //将日期选择缓存到本地
            storage.setLocalValue('da-cache-date', utils.timeFormat(new Date(), 'YYYY-MM-DD'));
            storage.setLocalValue('da-date-range', JSON.stringify(newVal));
            this.resetShortChosen();
            this.$emit('pick', [utils.timeFormat(newVal[0], 'YYYY-MM-DD'), utils.timeFormat(newVal[1], 'YYYY-MM-DD')]);
          }
        }
      }
    },
    methods: {
      clickShort(day) {
        this.chosen = day - 0;
        this.dateRange = utils.getTimeRange(this.chosen, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
      },

      resetShortChosen() {
        const formatDate = [
          utils.timeFormat(this.dateRange[0], 'YYYY-MM-DD'),
          utils.timeFormat(this.dateRange[1], 'YYYY-MM-DD')
        ];
        const day7Date = utils.getTimeRange(7, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
        const day7FormatDate = [utils.timeFormat(day7Date[0], 'YYYY-MM-DD'), utils.timeFormat(day7Date[1], 'YYYY-MM-DD')];
        const day14Date = utils.getTimeRange(14, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
        const day14FormatDate = [
          utils.timeFormat(day14Date[0], 'YYYY-MM-DD'),
          utils.timeFormat(day14Date[1], 'YYYY-MM-DD')
        ];
        const day30Date = utils.getTimeRange(30, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
        const day30FormatDate = [
          utils.timeFormat(day30Date[0], 'YYYY-MM-DD'),
          utils.timeFormat(day30Date[1], 'YYYY-MM-DD')
        ];
        const day90Date = utils.getTimeRange(90, new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
        const day90FormatDate = [
          utils.timeFormat(day90Date[0], 'YYYY-MM-DD'),
          utils.timeFormat(day90Date[1], 'YYYY-MM-DD')
        ];
        if (formatDate[0] === day7FormatDate[0] && formatDate[1] === day7FormatDate[1]) {
          this.chosen = 7;
        } else if (formatDate[0] === day14FormatDate[0] && formatDate[1] === day14FormatDate[1]) {
          this.chosen = 14;
        } else if (formatDate[0] === day30FormatDate[0] && formatDate[1] === day30FormatDate[1]) {
          this.chosen = 30;
        } else if (formatDate[0] === day90FormatDate[0] && formatDate[1] === day90FormatDate[1]) {
          this.chosen = 90;
        } else {
          this.chosen = '-';
        }
      },

      /*从本地获取缓存的日期选择
      * 缓存的日期当天有效，第二天失效*/
      _getLocalDateRange() {
        let cacheDateRange = null;

        const cacheDate = storage.getLocalValue('da-cache-date');
        const currentDate = utils.timeFormat(new Date(), 'YYYY-MM-DD');
        if (cacheDate && cacheDate == currentDate) {
          const cacheDateRangeStr = storage.getLocalValue('da-date-range');
          if (cacheDateRangeStr) {
            cacheDateRange = JSON.parse(cacheDateRangeStr);
          }
        }
        return cacheDateRange;
      }
    }
  };
</script>
<style rel="stylesheet/less" lang="less">
  .da-date-range {
    display: block;
    font-size: 0;
    padding: 10px 0;

    .short-btn {
      width: 66px;
      border-radius: 2px;
      border: 1px solid rgba(220, 221, 224, 1);
      font-family: PingFangSC-Regular;
      font-weight: 400;
    }

    .default-btn {
      background: rgba(242, 244, 247, 1);
      color: rgba(153, 153, 153, 1);
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

    .date-item {
      margin-right: 20px;
    }
  }
</style>
