<template>
    <div class="dss-time-range">
      <span class="date-tip time-item">选择时间：</span>
      <el-date-picker v-model="dateRange" class="time-item"
                      align="center" type="daterange"
                      placeholder="请选择日期范围"
                      size="mini"
                      :clearable="false" :editable="false"
                      :picker-options="options" :disabled="status">
      </el-date-picker>
      <slot/>
      <el-button v-if="visibleShortCut"
                 class="short-btn time-item"
                 size="mini"
                 :type="chosen==7?'primary':''"
                 @click="clickShort(7)">近7日
      </el-button>
      <el-button v-if="visibleShortCut"
                 class="short-btn time-item"
                 size="mini"
                 :type="chosen==14?'primary':''"
                 @click="clickShort(14)">近14日
      </el-button>
      <el-button v-if="visibleShortCut"
                 class="short-btn time-item"
                 size="mini"
                 :type="chosen==30?'primary':''"
                 @click="clickShort(30)">近30日
      </el-button>
      <el-button v-if="visibleShortCut"
                 class="short-btn time-item"
                 size="mini"
                 :type="chosen==90?'primary':''"
                 @click="clickShort(90)">近90日
      </el-button>
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
        default: true
      },
      maxDate: {
        type: Date,
        default: null
      },
      dataRangeStatus: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const today = this.maxDate || new Date();
      const time = today.getTime() - 1000 * 60 * 60 * 24;
      const cacheDateRange = this._getLocalDateRange();
      return {
        chosen: 7, //默认选中7天
        dateRange: cacheDateRange ? cacheDateRange : utils.getTimeRange(7, new Date(time)), //选中的日期
        options: getDatePickerOptions(null, today),
        status: false
      };
    },
    mounted() {
      this.status = this.dataRangeStatus ? this.dataRangeStatus : false;
    },
    watch: {
      dataRangeStatus: function() {
        this.status = this.dataRangeStatus ? this.dataRangeStatus : false;
      },
      dateRange: {
        immediate: true,
        handler(newVal, oldVal) {
          if (!!newVal) {
            //将日期选择缓存到本地
            storage.setLocalValue('cacheDate', utils.timeFormat(new Date(), 'YYYY-MM-DD'));
            storage.setLocalValue('dateRange', JSON.stringify(newVal));
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
<style rel="stylesheet/less" lang="less">
    .dss-time-range {
      display: block;
      margin: 20px 0 20px 0;
      .short-btn {
        width: 66px;
        border-radius: 2px;
        border: 1px solid rgba(220, 221, 224, 1);
        font-family: PingFangSC-Regular;
        font-weight: 400;
      }
      .first {border-radius: 4px 0 0 4px;}
      .last {border-radius: 0 4px 4px 0;}
      .el-button--primary {color: #fff;}
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
        width: 280px;
      }
      .date-item {
        margin-right: 20px;
      }
    }



</style>
