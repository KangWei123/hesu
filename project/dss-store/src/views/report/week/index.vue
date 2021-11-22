<template>
  <div style="padding: 30px;">
    <div class="report-title">
      雪松集团数字化门店周报&nbsp;&nbsp;
      <span v-if="week">({{week}})</span>
    </div>
    <div class="time">
      <el-button :disabled="!backOff" @click="onBeforeWeek">前一周</el-button>
      <el-date-picker class="date-picker" :clearable="false" v-model="weekValue" type="week" format="yyyy 第 WW 周" placeholder="选择周" :picker-options="weekPickerDateOption"></el-date-picker>
      <el-button :disabled="!forward" @click="onNextWeek">后一周</el-button>
      <el-button type="text" icon="el-icon-download" style="float:right;padding: 0" @click="onExport">导出</el-button>
    </div>
    <week-panel :portrait-data="portraitData" :passflow-data="passflowData" :global-passflow-data="globalPassflowData" :loading="loading"></week-panel>
    <export-dialog :portrait-data="portraitData" :passflow-data="passflowData" :global-passflow-data="globalPassflowData" :visible.sync="showExport" :week="week"></export-dialog>
  </div>
</template>

<script>
import WeekPanel from './WeekPanel';
import ExportDialog from './ExportDialog';
import utilDate from '@/dss-common/utils/date';
import reportApi from '@/dss-common/api/report';

const MAX_WEEK = utilDate.getMaxWeek();

export default {
  components: {
    WeekPanel,
    ExportDialog
  },
  data() {
    const now = new Date();
    const week = utilDate.addDays(
      new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      2 - now.getDay() - 7
    );
    return {
      weekValue: week,
      showExport: false,
      isLoading: false,
      weekPickerDateOption: {
        disabledDate(time) {
          return time.getTime() > MAX_WEEK;
        },
        firstDayOfWeek: 1
      },
      portraitData: [],
      passflowData: [],
      globalPassflowData: [],
      loading: {
        portrait: false,
        passflow: false,
        global: false
      }
    };
  },
  computed: {
    backOff() {
      return true;
    },
    forward() {
      if (!this.weekValue) {
        return false;
      }
      return !(utilDate.addDays(this.weekValue, 7).getTime() > MAX_WEEK);
    },
    week() {
      if (this.weekValue) {
        const weekNum = utilDate.getWeekNumber(this.weekValue);
        return `${this.weekValue.getFullYear()}年第${weekNum}周`;
      }
      return '';
    }
  },
  watch: {
    weekValue(val) {
      this.fetchData();
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    onBeforeWeek() {
      this.weekValue = utilDate.addDays(new Date(this.weekValue), -7);
    },
    onNextWeek() {
      this.weekValue = utilDate.addDays(new Date(this.weekValue), 7);
    },
    onExport() {
      this.showExport = true;
    },
    fetchData() {
      if (!this.weekValue) {
        this.$message({
          message: '参数无效。'
        });
        return;
      }
      const monday = utilDate.addDays(this.weekValue, -1);
      const sunday = utilDate.addDays(this.weekValue, 5);
      const params = {
        startDate: utilDate.format(monday, 'YYYY-MM-DD'),
        endDate: utilDate.format(sunday, 'YYYY-MM-DD')
      };
      this.fetchPortrait(params);
      this.fetchPassflow(params);
      this.fetchFields(params);
      // this.loading.passflow = true;
    },
    /**
     * 获取最后画像数据
     * @param {Object} params {startDate, endDate}开始日期和结束日期（周一，周日）
     */
    fetchPortrait(params) {
      this.loading.portrait = true;
      reportApi
        .getXSWeeklyPortraits({ statDate: params.startDate })
        .done(res => {
          this.portraitData = res.data || [];
        })
        .always(() => {
          this.loading.portrait = false;
        });
    },
    /**
     * 获取最后客流趋势数据
     * @param {Object} params {startDate, endDate}开始日期和结束日期字符串（周一，周日）
     */
    fetchPassflow(params) {
      const exParams = { ...params };
      this.loading.global = true;
      reportApi
        .getXSWeeklyPassflow(exParams)
        .done(res => {
          this.globalPassflowData = res.data || [];
        })
        .always(() => {
          this.loading.global = false;
        });
    },
    /**
     * 获取最后客流趋势数据
     * @param {Object} params {startDate, endDate}开始日期和结束日期字符串（周一，周日）
     */
    fetchFields(params) {
      const exParams = { ...params };
      exParams.fieldString = '文旅,地产';
      this.loading.passflow = true;
      reportApi
        .getXSWeeklyfieldPassflow(exParams)
        .done(res => {
          this.passflowData = res.data || [];
        })
        .always(() => {
          this.loading.passflow = false;
        });
    }
  }
};
</script>

<style lang="less">
.report-title {
  font-size: 22px;
  color: #2c3641;
  font-weight: bold;
  margin-bottom: 14px;

  span {
    color: #858c99;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>
