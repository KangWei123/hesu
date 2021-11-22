<template>
  <div class="dss-time-range">
    <span class="date-tip time-item">下单时间</span>
    <el-date-picker v-model="dateRange"
                    class="time-item"
                    align="center"
                    type="daterange"
                    placeholder="请选择日期范围"
                    :clearable="false"
                    :editable="false"
                    width="200"
                    :picker-options="options">
    </el-date-picker>
    <el-button :type="chosen==1?'primary':''"
               @click="clickShort(1)">今天
    </el-button>
    <el-button :type="chosen==7?'primary':''"
               @click="clickShort(7)">一周内
    </el-button>
    <el-button :type="chosen==30?'primary':''"
               @click="clickShort(30)">一月内
    </el-button>
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

      return !!(minDate && date < minDate);
    }
  };
}

export default {
  props: {
    maxDate: {
      type: Date,
      default: null
    }
  },
  data() {
    const today = this.maxDate || new Date();
    const time = today.getTime(); // -  1000 * 60 * 60 * 24;
    return {
      chosen: 30, //默认选中30天
      dateRange: utils.getTimeRange(30, new Date(time)), //选中的日期
      options: getDatePickerOptions(null, today)
    };
  },

  watch: {
    dateRange: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.$emit('pick', [utils.timeFormat(newVal[0], 'YYYY-MM-DD'), utils.timeFormat(newVal[1], 'YYYY-MM-DD')]);
        }
      }
    }
  },
  methods: {
    clickShort(day) {
      this.dateRange = utils.getTimeRange((this.chosen = day - 1), new Date(new Date().getTime()));
    }
  }
};
</script>
<style rel="stylesheet/less" lang="less" scoped>
.dss-time-range {
  display: block;
  margin: 13px 0;
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
  .el-button {
    height: 30px;
  }
  .el-button--primary {
    color: #fff;
  }
  .date-tip {
    font-size: 14px;
    color: #3b4757;
    height: 30px;
    line-height: 30px;
    padding: 0 24px 0 26px;
    display: inline-block;
  }
  .el-date-editor--daterange.el-input__inner {
    width: 280px;
  }
}
</style>
