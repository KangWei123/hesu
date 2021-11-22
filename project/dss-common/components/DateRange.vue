<template>
  <div class="dss-time-range">
    <el-button v-if="visibleShortCut"
               class="short-btn first time-item"
               :type="chosen==7?'primary':''"
               @click="clickShort(7)">7日
    </el-button>
    <el-button v-if="visibleShortCut"
               class="short-btn time-item"
               :type="chosen==30?'primary':''"
               @click="clickShort(30)">30日
    </el-button>
    <el-button v-if="visibleShortCut"
               class="short-btn time-item"
               :type="chosen==90?'primary':''"
               @click="clickShort(90)">3个月
    </el-button>
    <el-button v-if="visibleShortCut"
               class="short-btn time-item"
               :type="chosen==184?'primary':''"
               @click="clickShort(184)">半年
    </el-button>
    <el-button v-if="visibleShortCut"
               class="short-btn last time-item"
               :type="chosen==365?'primary':''"
               @click="clickShort(365)">1年
    </el-button>

    <span class="date-tip time-item">日期</span>
    <el-date-picker v-model="dateRange"
                    class="time-item"
                    align="center"
                    type="daterange"
                    placeholder="请选择日期范围"
                    :clearable="false"
                    :editable="false"
                    :picker-options="options">
    </el-date-picker>
    <slot />
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
          storage.setLocalValue('cacheDatev1', utils.timeFormat(new Date(), 'YYYY-MM-DD'));
          storage.setLocalValue('dateRangev1', JSON.stringify(newVal));
          this.$emit('pick', [utils.timeFormat(newVal[0], 'YYYY-MM-DD'), utils.timeFormat(newVal[1], 'YYYY-MM-DD')]);
        }
      }
    }
  },
  methods: {
    clickShort(day) {
      this.dateRange = utils.getTimeRange(
        (this.chosen = day - 0),
        new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
      );
    },

    /*从本地获取缓存的日期选择
    * 缓存的日期当天有效，第二天失效*/
    _getLocalDateRange() {
      let cacheDateRange = null;

      const cacheDate = storage.getLocalValue('cacheDatev1');
      const currentDate = utils.timeFormat(new Date(), 'YYYY-MM-DD');
      if (cacheDate && cacheDate == currentDate) {
        const cacheDateRangeStr = storage.getLocalValue('dateRangev1');
        if (cacheDateRangeStr) {
          cacheDateRange = JSON.parse(cacheDateRangeStr);
        }
      }
      return cacheDateRange;
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.dss-time-range {
  display: block;
  margin: 13px 0 30px 0;
  .short-btn {
    width: 180px;
    height: 40px;
    line-height: 40px;
    padding: 0;
    font-size: 14px;
    color: #012334;
    margin: 0;
    border-radius: 0;
  }
  .first {
    border-radius: 4px 0 0 4px;
  }
  .last {
    border-radius: 0 4px 4px 0;
  }
  .el-button--primary {
    color: #fff;
  }
  .date-tip {
    font-size: 14px;
    color: #3b4757;
    height: 40px;
    line-height: 40px;
    padding: 0 24px 0 26px;
    display: inline-block;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 280px;
  }
  .time-item {
    margin-left: -6px;
    vertical-align: middle;
  }
}
</style>
