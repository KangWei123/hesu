<template>
  <div class="passenger-flow-main">
    <div class="statistics-container dss-card" style="padding: 0px" v-loading="loading.statistics">
      <el-radio-group v-model="dateType" @change="changeDateType" size="small" style="padding: 20px 0 10px 20px;">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
      </el-radio-group>
      <!-- <statistics-category :type="type"
                           :passengerStatistics="passengerStatistics" /> -->
      <statistics-category
        :type="type"
        :date-type="dateType"
        :page-type="2"
        :passengerStatistics="passengerStatistics"
      />
    </div>

    <!-- 到店客户标签 -->
    <!-- <div class="customer-tag dss-card"
         v-loading="loading.tag">
      <card-title text="到店客户标签"
                  tip-name="customerTag"></card-title>
      <tag-table :date-range="customerDateRange" />
    </div> -->

    <!-- <div class="customer-analyse dss-card"> -->
    <!-- 日期选择 -->

    <!-- 时间选择控件 -->
    <div style="padding:13px 0">
      <el-date-picker
        style="width: 240px;"
        size="mini"
        v-model="dateRange"
        :clearable="false"
        type="daterange"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="onTimePick"
      >
      </el-date-picker>

      <el-radio-group v-model="dateTimeType" @change="changeDateTimeType" size="small" style="margin-left:10px;">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="lastWeek">上周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="lastMonth">上月</el-radio-button>
      </el-radio-group>
      <el-button type="primary" class="btn-search" @click="onChangeCustomerDate">查询</el-button>
    </div>

    <!-- 用户概览 -->
    <camera-portrait-statistics
      :param-type="isPassflow ? 0 : 1"
      isGlobal="global"
      isStore
      :date-range="customerDateRange"
      :portraitData="portraitData"
      :rateData="rateData"
      :loading="loading.portrait"
    />

    <!-- 客流量分析 -->
    <div class="customer-analyse dss-card" v-loading="loading.analyse">
      <card-title :text="type + '量分析'" :tip-name="isPassflow ? 'customerAnalyse' : 'customerUVAnalyse'">
        <template slot="right">
          <i
            :title="analyseType === 'chart' ? '表格视图' : '趋势视图'"
            class="key-icon key-icon-btn"
            :class="{
              'key-icon-table': analyseType === 'chart',
              'key-icon-trend': analyseType === 'table',
              disabled: !customerAnalyseTable
            }"
            @click="toggleView('analyseType')"
          ></i>
          <i
            title="导出Excel"
            class="key-icon key-icon-btn key-icon-download"
            :class="{ disabled: !customerAnalyseTable }"
            @click="downloadCustomerAnalyseData"
          ></i>
        </template>
      </card-title>

      <date-filter @filter="onDateTypeSelected" />

      <div class="analyse-chart" v-if="analyseType === 'chart'">
        <place-holder v-if="!customerAnalyse[0].xAxis" />

        <line-chart :data="customerAnalyse" v-else></line-chart>
      </div>
      <passenger-table
        :value-key="countKey"
        :data="customerAnalyseTable"
        :value-title="type + '量'"
        v-else-if="analyseType === 'table'"
      ></passenger-table>
    </div>

    <!-- 客流量时段对比 -->
    <div class="customer-compare dss-card" v-loading="loading.compare">
      <card-title :text="type + '量时段对比'" :tip-name="isPassflow ? 'customerCompare' : 'customerUVCompare'">
        <template slot="right">
          <i
            :title="compareType === 'chart' ? '表格视图' : '趋势视图'"
            class="key-icon key-icon-btn"
            :class="{
              'key-icon-table': compareType === 'chart',
              'key-icon-trend': compareType === 'table',
              disabled: !customerCompareTable || showEditor
            }"
            @click="toggleView('compareType')"
          ></i>
          <i
            title="导出Excel"
            class="key-icon key-icon-btn key-icon-download"
            :class="{ disabled: !customerCompareTable || showEditor }"
            @click="downloadCustomerCompareData"
          ></i>
        </template>
      </card-title>

      <div class="compare-editor">
        <span @click="toggleEditor"><i class="key-icon key-icon-btn key-icon-editor"></i>编辑对比时段</span>
      </div>

      <div class="editor-form" v-if="showEditor">
        <el-alert
          v-if="warning.show"
          :title="warning.text"
          class="text-center"
          type="warning"
          @close="toggleWarning"
          show-icon
        ></el-alert>
        <div class="time-form">
          <div class="time-form-item" v-for="(item, i) in timeRange" :key="i">
            <i class="key-icon key-icon-btn key-icon-subtract" @click="removeTime(i)"></i>
            时段 {{ i + 1 }} ：
            <el-time-select
              placeholder="起始时间"
              :clearable="false"
              v-model="item.startTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00'
              }"
            >
            </el-time-select>
            至
            <el-time-select
              placeholder="结束时间"
              :clearable="false"
              v-model="item.endTime"
              :picker-options="{
                start: '00:00',
                step: '01:00',
                end: '24:00'
              }"
            >
            </el-time-select>
          </div>
          <div class="time-form-item add-time" v-if="timeRange.length < 4">
            <span @click="addTime"><i class="key-icon key-icon-btn key-icon-add"></i>添加时段</span>
          </div>
        </div>
        <el-button type="primary" @click="validateCompareTime">确定</el-button>
        <el-button @click="cancelValidateCompareTime">取消</el-button>
      </div>

      <div class="compare-view" v-if="!showEditor">
        <div class="time-compare">
          <div
            class="time-compare-item"
            v-for="(item, i) in confirmTimeRange"
            :key="i"
            v-if="confirmTimeRange.length && customerCompare"
          >
            <i
              class="key-icon key-icon-btn"
              :class="{
                'key-icon-time-one': i === 0,
                'key-icon-time-two': i === 1,
                'key-icon-time-three': i === 2,
                'key-icon-time-four': i === 3
              }"
            ></i>
            <span>{{ item.startTime }} 至 {{ item.endTime }} </span>
            <span class="text">对比</span>
          </div>
        </div>

        <div v-if="customerCompare || customerCompareTable">
          <div class="compare-view-chart" v-if="compareType === 'chart'">
            <div class="none-data" v-if="!customerCompare && confirmTimeRange[0].startTime">
              <i class="key-icon key-icon-btn key-icon-none" title="编辑对比时段" @click="toggleEditor"></i
              >您还未添加时段
            </div>

            <line-chart :data="customerCompare" v-else-if="customerCompare"></line-chart>
          </div>

          <compare-table
            :periods="customerPeriods"
            :data="customerCompareTable"
            v-else-if="compareType === 'table'"
          ></compare-table>
        </div>

        <place-holder v-if="!customerCompare && !customerCompareTable"> </place-holder>
      </div>
    </div>

    <!-- 入店率 -->
    <div class="customer-compare dss-card">
      <enter-rate class="global-item" :date-section="dateSection" :deviceType="2" />
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import utilsDate from '@/dss-common/utils/date';
import storage from '@/dss-common/utils/storage';
import storeApi from '@/dss-common/api/store';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import newCameraFlowApi from '../../../api/camera-flow.js';
import PassengerFlowEnum from '@/dss-common/enums/PassengerFlow.js';
import services from '@/dss-common/utils/services';
import url from '@/dss-common/utils/url';
import date from '@/dss-common/utils/date';
import CardTitle from '../../../components/card-title/index';
import NoData from '../../../components/no-data/index';
import LineChart from '../overview/line-chart';
import PassengerTable from '../overview/passenger-table';
import CompareTable from '../overview/compare-table';
import TagTable from './tag-table';
import overviewTool from '../overview/tool';
import PlaceHolder from '@/dss-common/components/placeholder/index';
// import StatisticsCategory from '../../../components/statistics/StatisticsCategory';
import StatisticsCategory from '../../../components/statistics/statistics-category-new';
import DateFilter from '../overview/DateFilter';
import CameraPortraitStatistics from '../../portrait/component/camera-portrait-statistics.vue';
import '../overview/overview.less';

import EnterRate from './enter-rate';

export default {
  name: 'CameraFlow',

  components: {
    CardTitle,
    LineChart,
    PassengerTable,
    CompareTable,
    TagTable,
    NoData,
    PlaceHolder,
    StatisticsCategory,
    DateFilter,
    CameraPortraitStatistics,
    EnterRate
  },

  props: {
    type: {
      type: String,
      default: '客流'
    }
  },

  data() {
    const cacheTimeRange = this._getLocalTimeRange();
    const defaultTimeRange = [
      {
        startTime: '08:00',
        endTime: '11:00'
      },
      {
        startTime: '11:00',
        endTime: '14:00'
      },
      {
        startTime: '14:00',
        endTime: '18:00'
      },
      {
        startTime: '18:00',
        endTime: '22:00'
      }
    ];

    return {
      lived: false,
      dateTimeType: null,
      // t-1 数据，不需要今天
      MAX_DATE: date.getDateByDays(new Date(), -1),
      // 加载
      loading: {
        statistics: false,
        userInfo: false,
        analyse: false,
        compare: false,
        tag: false,
        portrait: false
      },
      // 日期选择
      customerDateRange: null,
      // 统计概览
      passengerStatistics: {
        // monthCustomer: 0,
        // monthCustomerIncr: 0,
        // monthPassenger: 0,
        // monthPassengerIncr: 0,
        // todayPassenger: 0,
        // todayPassengerIncr: 0
        flowCount: 0,
        flowLastCount: 0,
        customerCount: 0,
        customerLastCount: 0,
        memberCount: 0,
        memberLastCount: 0,
        outDoorCount: 0,
        outDoorLastCount: 0
      },

      dateFilter: {},

      // 客流量分析chart
      customerAnalyse: [
        {
          name: null,
          xAxis: null,
          value: null
        },
        {
          name: null,
          xAxis: null,
          value: null
        }
      ],
      // 客流量分析table数据
      customerAnalyseTable: null,
      // 客流量分析视图类型选择：chart、table
      analyseType: 'chart',

      // 时段chart数据
      customerCompare: null,
      // 时段table数据
      customerCompareTable: null,
      // 时段种类
      customerPeriods: null,
      // 时段视图类型选择：chart、table
      compareType: 'chart',

      // 显示时段编辑
      showEditor: false,
      // 警告
      warning: {
        show: false,
        text: '请选择完整的对比时段'
      },
      // 编辑时段数据
      timeRange: cacheTimeRange ? cacheTimeRange : defaultTimeRange,
      // 确认的对比时段
      confirmTimeRange: null,
      //客户画像数据
      portraitData: [],
      // 客户画像(会员占比 入店转化率 会员转化率)数据
      rateData: {
        member: 0,
        notMember: 0,
        // 入店转化率
        passByCount: 0,
        enterCount: 0,
        // 会员转化率
        newMemberCount: 0,
        newCustomerCount: 0
      },
      dateType: 'today',
      dateSection: {
        startDate: '',
        endDate: ''
      },
      dateRange: [utilsDate.addDays(new Date(), -1), new Date()],
      timeoutId: null
    };
  },

  computed: {
    isPassflow() {
      return this.type === '客流';
    },
    countKey() {
      return this.isPassflow ? 'count' : 'customer';
    },
    valueKey() {
      return this.isPassflow ? 'passenger' : 'customer';
    }
  },

  destroyed() {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.lived = false;
  },

  mounted() {
    this.lived = true;
    this.changeDateType();
    this.onChangeCustomerDate();
  },

  methods: {
    formatDate(datetime) {
      return utils.timeFormat(datetime, 'YYYY-MM-DD');
    },

    // 时间选择器变化时
    onTimePick() {
      this.dateTimeType = null;
      this.onChangeCustomerDate();
    },

    // 所有请求的入口：日期控件时间切换时触发，选择店铺后也会触发，首次进入页面会触发
    onChangeCustomerDate() {
      this.customerDateRange = [this.formatDate(this.dateRange[0]), this.formatDate(this.dateRange[1])];
      this.dateSection = { startDate: this.formatDate(this.dateRange[0]), endDate: this.formatDate(this.dateRange[1]) };
      this.initCompareTimeRange();

      // this.apiPassengerStatistics();
      this.apiCustomerAnalysisData();
      this.getData();
      this.fetchConversionRate();
      const period = this.assemblePeriod();
      if (period) {
        this.apiCustomerCompareData(period.join());
      }

      // if (!!this.timeoutId) {
      //   clearTimeout(this.timeoutId);
      // }

      // this.getPassengerAndTagDataInterval();
    },

    // 日期切换
    changeDateTimeType() {
      let dateRnng = [];
      if (this.dateTimeType === 'week') {
        dateRnng = this.getWeekDate();
      }
      if (this.dateTimeType === 'lastWeek') {
        dateRnng = this.getLastWeekDate();
      }
      if (this.dateTimeType === 'month') {
        dateRnng = this.getCurrentMonth();
      }
      if (this.dateTimeType === 'lastMonth') {
        dateRnng = this.getLastMonth();
      }

      this.dateRange = dateRnng;

      this.onChangeCustomerDate();
    },

    // 获取本周起止日期(周一到周日)
    getWeekDate() {
      const startStop = new Array();
      const currentDate = new Date();
      const week = currentDate.getDay();
      const month = currentDate.getDate();

      const millisecond = 1000 * 60 * 60 * 24;
      const minusDay = week != 0 ? week - 1 : 6;
      //本周 周一
      const monday = new Date(currentDate.getTime() - minusDay * millisecond);
      //本周 周日
      const sunday = new Date(monday.getTime() + 6 * millisecond);
      startStop.push(monday); //本周起始时间
      startStop.push(sunday); //本周终止时间
      return startStop;
    },

    // 获取本周起止日期(周一到周日)
    getLastWeekDate() {
      const startStop = new Array();
      const currentDate = new Date();
      const week = currentDate.getDay();
      const month = currentDate.getDate();

      const millisecond = 1000 * 60 * 60 * 24;
      const minusDay = week != 0 ? week - 1 : 6;
      //本周 周一
      const monday = new Date(currentDate.getTime() - minusDay * millisecond - millisecond * 7);
      //本周 周日
      const sunday = new Date(monday.getTime() + 6 * millisecond);
      startStop.push(monday); //本周起始时间
      startStop.push(sunday); //本周终止时间
      return startStop;
    },

    getLastMonth() {
      const startStop = new Array();
      let now = new Date(); //当前日期
      let nowDay = now.getDate(); //当前日
      let nowMonth = now.getMonth(); //当前月
      let nowYear = now.getYear(); //当前年
      //console.log(nowMonth);
      nowYear += nowYear < 2000 ? 1900 : 0; //
      let lastMonthDate = new Date(); //上月日期
      // console.log('lastMonthDate'+lastMonthDate)
      lastMonthDate.setDate(1); //变成这个月一号
      lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
      let lastYear = lastMonthDate.getYear();
      lastYear += lastYear < 2000 ? 1900 : 0; //
      // console.log('lastYear'+lastYear);
      let lastMonth = lastMonthDate.getMonth();
      let monthStartDate = new Date(nowYear, lastMonth, 1);
      let monthEndDate = new Date(nowYear, lastMonth + 1, 1);
      //   console.log('天数'+monthStartDate+'==='+ monthEndDate)
      let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);

      let firstDay = new Date(lastYear, lastMonth, 1);
      let lastDay = new Date(lastYear, lastMonth, days);
      startStop.push(firstDay);
      startStop.push(lastDay);
      return startStop;
    },

    getCurrentMonth() {
      const startStop = [];
      const currentDate = new Date();
      let currentMonth = currentDate.getMonth();
      let currentYear = currentDate.getFullYear();
      const firstDay = new Date(currentYear, currentMonth, 1);
      //当为12月的时候年份需要加1 月份需要更新为0 也就是下一年的第一个月
      if (currentMonth == 11) {
        currentYear++;
        currentMonth = 0;
      } else {
        currentMonth++;
      }
      const millisecond = 1000 * 60 * 60 * 24;
      //下月的第一天
      const nextMonthDayOne = new Date(currentYear, currentMonth, 1);
      //求出上月的最后一天
      const lastDay = new Date(nextMonthDayOne.getTime() - millisecond);
      startStop.push(firstDay);
      startStop.push(lastDay);
      return startStop;
    },

    getPassengerAndTagDataInterval() {
      // Promise.all([this.apiPassengerStatistics()]).always(() => {
      //   if (this.lived) {
      //     this.timeoutId = setTimeout(() => {
      //       this.getPassengerAndTagDataInterval();
      //     }, 1000);
      //   }
      // });
      if (!!this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      return this.getCustomerRecordByDateType(this.dateType).always(() => {
        if (this.lived) {
          this.timeoutId = setTimeout(() => {
            this.getPassengerAndTagDataInterval();
          }, 1000);
        }
      });
    },

    initCompareTimeRange() {
      if (!this.confirmTimeRange) {
        this.confirmTimeRange = this.$plain(this.timeRange);
      }
    },

    onDateTypeSelected(dateType) {
      this.dateFilter = dateType;
      this.apiCustomerAnalysisData();
    },

    /*到店客流统计 Row 1 */
    apiPassengerStatistics() {
      // this.loading.statistics = true;
      const url_rt = this.isPassflow ? cameraFlowApi.API_RT_PASSENGER : cameraFlowApi.API_RT_CUSTOMER;
      return services
        .get(url_rt, {
          action: '到店客流统计',
          params: {
            deviceType: PassengerFlowEnum.deviceType.camera
          }
        })
        .then(result => {
          if (result.data) {
            this.passengerStatistics = result.data;
          }
        })
        .always(() => {
          this.loading.statistics = false;
        });
    },

    changeDateType() {
      this.passengerStatistics = {
        flowCount: 0,
        flowLastCount: 0,
        customerCount: 0,
        customerLastCount: 0,
        memberCount: 0,
        memberLastCount: 0,
        outDoorCount: 0,
        outDoorLastCount: 0
      };
      clearTimeout(this.timeoutId);
      // if (!!this.timeoutId) {
      //   clearTimeout(this.timeoutId);
      // }
      // this.getCustomerRecordByDateType(this.dateType);
      this.getPassengerAndTagDataInterval();
    },

    /* 获取客流数据 */
    getCustomerRecordByDateType(dateType = 'today') {
      const fetchType = {
        today: 'getStoreCustomerRecordDay',
        week: 'getStoreCustomerRecordWeek',
        month: 'getStoreCustomerRecordMonth'
      };
      const type = fetchType[dateType];
      // return newCameraFlowApi[type]({ equType: 2, dataScope: 'store' })
      return newCameraFlowApi[type]({ equType: 2 })
        .then(res => {
          if (res.data) {
            this.passengerStatistics = res.data;
          }
        })
        .always(() => {
          this.loading.statistics = false;
        });
    },

    /* 客流分析 Row 3*/
    apiCustomerAnalysisData() {
      this.loading.analyse = true;

      const params = Object.assign(
        {
          startDate: this.formatDate(this.customerDateRange[0]),
          endDate: this.formatDate(this.customerDateRange[1]),
          source: PassengerFlowEnum.source.camera
        },
        this.dateFilter
      );
      cameraFlowApi
        .getPassengerDiagnosis(params)
        .then(result => {
          const ret = overviewTool.processApiAnalyseData(result, 'passenger', this.type);
          const customer = overviewTool.processApiAnalyseData(result, 'customer');
          this.customerAnalyse[0].name = ret.name;
          this.customerAnalyse[0].xAxis = ret.xAxis;
          this.customerAnalyse[0].value = ret.value;
          this.customerAnalyse[1].name = '客户量';
          this.customerAnalyse[1].xAxis = customer.xAxis;
          this.customerAnalyse[1].value = customer.value;

          this.customerAnalyseTable = ret.table;
        })
        .always(() => {
          this.loading.analyse = false;
          this.showEditor = false;
          this.warning.show = false;
        });
    },

    /**
     * 客流量时段对比 Row 4
     * @param period String 时段对比：7:00~9:00,12:00~14:00,17:00~19:00
     * */
    apiCustomerCompareData(period) {
      this.loading.compare = true;
      let params = {
        startDate: this.formatDate(this.customerDateRange[0]),
        endDate: this.formatDate(this.customerDateRange[1]),
        period: period,
        source: PassengerFlowEnum.source.camera
      };
      cameraFlowApi
        .getPassengerHour(params)
        .then(result => {
          const ret = overviewTool.processApiCustomerCompareData(result, this.valueKey);
          this.customerCompare = ret.customerCompare;
          this.customerCompareTable = ret.customerCompareTable;
          this.customerPeriods = ret.customerPeriods;
        })
        .always(() => {
          this.loading.compare = false;
        });
    },

    // 客流量时段编辑确定
    validateCompareTime() {
      const period = this.assemblePeriod();

      if (!period) {
        return;
      }

      //将时间段对比选择缓存到本地
      storage.setLocalValue('timeRange', JSON.stringify(this.timeRange));

      this.confirmTimeRange = this.$plain(this.timeRange);

      this.showEditor = false;
      this.warning.show = false;

      this.apiCustomerCompareData(period.join());
    },

    //取消客流时段编辑确定
    cancelValidateCompareTime() {
      this.timeRange = this.$plain(this.confirmTimeRange);
      this.showEditor = false;
    },

    /*从本地获取缓存的时间段选择
     * 缓存的时间段永久有效*/
    _getLocalTimeRange() {
      let cacheTimeRange = null;

      const cacheTimeRangeStr = storage.getLocalValue('timeRange');
      if (cacheTimeRangeStr) {
        cacheTimeRange = JSON.parse(cacheTimeRangeStr);
      }
      return cacheTimeRange;
    },

    /**
     * 根据timeRange组装请求的时段
     * return [7:00~9:00, 12:00~14:00, 17:00~19:00]
     */
    assemblePeriod() {
      let period = [];
      for (let i = 0, length = this.timeRange.length; i < length; i++) {
        // 校验是否已选择对比时段
        if (!this.timeRange[i].startTime || !this.timeRange[i].endTime) {
          this.warning.text = '请选择完整的对比时段';
          this.warning.show = true;
          return null;
        }

        // 校验结束时长大于开始时长
        if (this.timeRange[i].startTime > this.timeRange[i].endTime) {
          this.warning.text = '开始时段不能大于结束时段';
          this.warning.show = true;
          return null;
        }

        if (this.timeRange[i].startTime && this.timeRange[i].endTime) {
          period.push(`${this.timeRange[i].startTime}~${this.timeRange[i].endTime}`);
        }
      }
      return period;
    },

    /**
     * 切换表格视图和趋势视图
     * @param  {[type]} moduleName 'analyseType' 或者 'compareType'
     */
    toggleView(moduleName) {
      this[moduleName] = this[moduleName] === 'chart' ? 'table' : 'chart';
      // 去除element-btn焦点，否则会一直高亮
      //$(':focus').blur();todo
    },

    // 下载客流量分析数据
    downloadCustomerAnalyseData() {
      const start = this.formatDate(this.customerDateRange[0]);
      const end = this.formatDate(this.customerDateRange[1]);
      window.open(
        url.makeUrl(storeApi.DOWNLOAD_PASSENGER_ANALYSIS_LIST, {
          startDate: start,
          endDate: end,
          type: this.isPassflow ? 0 : 1, // type=0 客流, 1 客户
          source: PassengerFlowEnum.source.camera,
          fileName: `${this.type}量分析.csv`,
          ...this.dateFilter
        })
      );
    },

    // 下载客流量时段对比数据
    downloadCustomerCompareData() {
      const period = [];
      this.confirmTimeRange.forEach(item => {
        period.push(`${item.startTime}~${item.endTime}`);
      });

      window.open(
        url.makeUrl(storeApi.PASSENGER_FLOW_COMPARE_DOWNLOAD, {
          //window.open(url.makeUrl(api.report.passengerFlowCompare, {
          startDate: this.formatDate(this.customerDateRange[0]),
          endDate: this.formatDate(this.customerDateRange[1]),
          type: this.isPassflow ? 0 : 1, // type=0 客流, 1 客户
          fileName: `${this.type}量时段对比`,
          source: PassengerFlowEnum.source.camera,
          period: period.join()
        })
      );
    },

    // 切换时段编辑界面
    toggleEditor() {
      this.timeRange = this.$plain(this.confirmTimeRange);
      this.showEditor = !this.showEditor;
    },

    // 添加时段
    addTime() {
      if (this.timeRange.length < 4) {
        this.timeRange.push({
          startTime: '',
          endTime: ''
        });
      }
    },

    // 删除时段
    removeTime(index) {
      if (this.timeRange.length > 1) {
        this.timeRange.splice(index, 1);
      }
    },

    toggleWarning() {
      this.warning.show = !this.warning.show;
    },

    getData() {
      this.loading.portrait = true;
      let paramType = this.isPassflow ? 0 : 1;
      let params = {
        isCustomer: paramType,
        startDate: this.formatDate(this.customerDateRange[0]),
        endDate: this.formatDate(this.customerDateRange[1])
      };
      cameraFlowApi.getCameraPortrait(params).then(
        ({ data }) => {
          this.loading.portrait = false;
          this.portraitData = data;
        },
        () => {
          this.loading.portrait = false;
        }
      );
    },
    // 门店概览-用户画像(会员占比 入店转化率 会员转化率 )
    fetchConversionRate() {
      const params = {
        startDate: this.formatDate(this.customerDateRange[0]),
        endDate: this.formatDate(this.customerDateRange[1]),
        dataScope: 'store'
      };
      newCameraFlowApi.getConversionRate(params).then(
        ({ data }) => {
          // this.rateData = data;
          this.rateData = {
            // 会员
            member: (data.customerEnterCount - data.nonMemberEnterCount) / data.customerEnterCount,
            notMember: data.nonMemberEnterCount / data.customerEnterCount,
            // 入店转化率
            passByCount: data.flowOutDoorCount,
            enterCount: data.flowEnterCount,
            // 会员转化率
            newMemberCount: data.newMemberCount,
            newCustomerCount: data.nonMemberEnterCount
            // totalCount: data.nonMemberEnterCount + data.newMemberCount
          };
        },
        () => {
          this.rateData = {
            // 会员
            member: 0,
            notMember: 0,
            // 入店转化率
            passByCount: 0,
            enterCount: 0,
            // 会员转化率
            newMemberCount: 0,
            newCustomerCount: 0
            // totalCount: data.nonMemberEnterCount + data.newMemberCount
          };
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.passenger-flow-main {
  /deep/ .store-view-date-range.dss-time-range {
    margin: 13px 0 10px 0;
    .date-tip {
      padding: 0 24px 0 10px;
    }
    .el-date-editor.el-range-editor.el-input__inner.time-item.el-date-editor--daterange {
      .el-range-input {
        color: #333333;
        font-size: 12px;
      }
    }
  }
  .btn-search {
    background: #409eff;
    font-size: 12px;
    margin-left: 8px;
    vertical-align: middle;
  }
}
</style>
