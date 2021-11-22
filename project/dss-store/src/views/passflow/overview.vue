<template>
  <div class="passenger-flow-main">
    <div class="statistics-container dss-card"
         style="padding: 0px"
         v-loading="loading.statistics">
      <statistics-category :type="type"
                           :passengerStatistics="passengerStatistics" />
    </div>

    <date-range @pick="onChangeCustomerDate"
                :maxDate="MAX_DATE" />

    <!-- 客流量分析 -->
    <div class="customer-analyse dss-card"
         v-loading="loading.analyse">
      <card-title :text="type + '量分析'"
                  :tip-name="isPassflow ? 'customerAnalyse' : 'customerUVAnalyse'">
        <template slot="right">
          <i :title="analyseType === 'chart' ? '表格视图' : '趋势视图'"
             class="key-icon key-icon-btn"
             :class="{
                            'key-icon-table': analyseType === 'chart',
                            'key-icon-trend': analyseType === 'table',
                            'disabled': !customerAnalyseTable
                        }"
             @click="toggleView('analyseType')"></i>
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             :class="{ disabled: !customerAnalyseTable }"
             @click="downloadCustomerAnalyseData"></i>
        </template>
      </card-title>

      <date-filter @filter="onDateTypeSelected" />

      <div class="analyse-chart"
           v-if="analyseType === 'chart'">
        <place-holder v-if="!customerAnalyse[0].xAxis" />

        <line-chart :data="customerAnalyse"
                    v-else></line-chart>
      </div>
      <passenger-table :value-key="countKey"
                       :data="customerAnalyseTable"
                       :value-title="type + '量'"
                       v-else-if="analyseType === 'table'"></passenger-table>

    </div>

    <!-- 客流量时段对比 -->
    <div class="customer-compare dss-card"
         v-loading="loading.compare">
      <card-title :text="type + '量时段对比'"
                  :tip-name="isPassflow ? 'customerCompare' : 'customerUVCompare'">
        <template slot="right">
          <i :title="compareType === 'chart' ? '表格视图' : '趋势视图'"
             class="key-icon key-icon-btn"
             :class="{
                        'key-icon-table': compareType === 'chart',
                        'key-icon-trend': compareType === 'table',
                        'disabled': !customerCompareTable || showEditor
                    }"
             @click="toggleView('compareType')"></i>
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             :class="{ disabled: !customerCompareTable || showEditor }"
             @click="downloadCustomerCompareData"></i>
        </template>
      </card-title>

      <div class="compare-editor"><span @click="toggleEditor"><i class="key-icon key-icon-btn key-icon-editor"></i>编辑对比时段</span>
      </div>

      <div class="editor-form"
           v-if="showEditor">
        <el-alert v-if="warning.show"
                  :title="warning.text"
                  class="text-center"
                  type="warning"
                  @close="toggleWarning"
                  show-icon></el-alert>
        <div class="time-form">
          <div class="time-form-item"
               v-for="(item, i) in timeRange"
               :key="i">
            <i class="key-icon key-icon-btn key-icon-subtract"
               @click="removeTime(i)"></i>
            时段 {{i + 1}} ：
            <el-time-select placeholder="起始时间"
                            :clearable="false"
                            v-model="item.startTime"
                            :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '24:00'
                        }">
            </el-time-select>
            至
            <el-time-select placeholder="结束时间"
                            :clearable="false"
                            v-model="item.endTime"
                            :picker-options="{
                          start: '00:00',
                          step: '01:00',
                          end: '24:00'
                        }">
            </el-time-select>
          </div>
          <div class="time-form-item add-time"
               v-if="timeRange.length < 4"><span @click="addTime"><i class="key-icon key-icon-btn key-icon-add"></i>添加时段</span></div>
        </div>
        <el-button type="primary"
                   @click="validateCompareTime">确定</el-button>
        <el-button @click="cancelValidateCompareTime">取消</el-button>
      </div>

      <div class="compare-view"
           v-if="!showEditor">
        <div class="time-compare">
          <div class="time-compare-item"
               v-for="(item, i) in confirmTimeRange"
               :key="i"
               v-if="confirmTimeRange.length && customerCompare">
            <i class="key-icon key-icon-btn"
               :class="{ 'key-icon-time-one': i === 0, 'key-icon-time-two': i === 1, 'key-icon-time-three': i === 2, 'key-icon-time-four': i === 3}"></i>
            <span>{{item.startTime}} 至 {{item.endTime}} </span>
            <span class="text">对比</span>
          </div>
        </div>

        <div v-if="customerCompare || customerCompareTable">
          <div class="compare-view-chart"
               v-if="compareType === 'chart'">
            <div class="none-data"
                 v-if="!customerCompare && confirmTimeRange[0].startTime"><i class="key-icon key-icon-btn key-icon-none"
                 title="编辑对比时段"
                 @click="toggleEditor"></i>您还未添加时段
            </div>

            <line-chart :data="customerCompare"
                        v-else-if="customerCompare"></line-chart>
          </div>

          <compare-table :periods="customerPeriods"
                         :data="customerCompareTable"
                         v-else-if="compareType === 'table'"></compare-table>
        </div>

        <place-holder v-if="!customerCompare && !customerCompareTable">
        </place-holder>
      </div>
    </div>

    <!-- 到店客户标签 -->
    <div class="customer-tag dss-card"
         v-loading="loading.tag">
      <card-title text="到店客户标签"
                  tip-name="customerTag"></card-title>
      <template>
        <tag-table :data="customerTagData">
        </tag-table>
      </template>
    </div>
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import storage from '@/dss-common/utils/storage';
import api from '@/dss-common/api/report';
import storeApi from '@/dss-common/api/store';
import DateRange from '@/dss-common/components/DateRange';
import services from '@/dss-common/utils/services';
import url from '@/dss-common/utils/url';
import date from '@/dss-common/utils/date';

import CardTitle from '../../components/card-title/index';
import NoData from '../../components/no-data/index';

import LineChart from './overview/line-chart';
import PassengerTable from './overview/passenger-table';
import CompareTable from './overview/compare-table';
import TagTable from './overview/tag-table';
import overviewTool from './overview/tool';

import PlaceHolder from '@/dss-common/components/placeholder/index';
import StatisticsCategory from '../../components/statistics/StatisticsCategory';
import DayWeekReportItem from '../../components/statistics/DayWeekReportItem';
import DateFilter from './overview/DateFilter';
import PassengerFlowEnum from '@/dss-common/enums/PassengerFlow.js';

import './overview/overview.less';

export default {
  name: 'PassengerFlow',

  props: {
    type: {
      type: String,
      default: '客流'
    }
  },

  components: {
    CardTitle,
    LineChart,
    DateRange,
    PassengerTable,
    CompareTable,
    TagTable,
    NoData,
    PlaceHolder,
    StatisticsCategory,
    DayWeekReportItem,
    DateFilter
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
      // t-1 数据，不需要今天
      MAX_DATE: date.getDateByDays(new Date(), -1),
      // 加载
      loading: {
        statistics: false,
        analyse: false,
        compare: false,
        tag: false
      },
      // 日期选择
      customerDateRange: null,
      // 统计概览
      passengerStatistics: {
        monthCustomer: 0,
        monthCustomerIncr: 0,
        monthPassenger: 0,
        monthPassengerIncr: 0,
        todayPassenger: 0,
        todayPassengerIncr: 0
      },

      dateFilter: {},

      // 客流量分析chart
      customerAnalyse: [
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
      // 到店客户标签数据
      customerTagData: []
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

  methods: {
    formatDate(dateTime) {
      return utils.timeFormat(dateTime, 'YYYY-MM-DD');
    },

    // 所有请求的入口：日期控件时间切换时触发，选择店铺后也会触发，首次进入页面会触发
    onChangeCustomerDate(dateRange) {
      this.customerDateRange = dateRange;
      this.apiPassengerStatistics();
      this.apiCustomerAnalysisData();

      this.initCompareTimeRange();
      const period = this.assemblePeriod();
      if (period) {
        this.apiCustomerCompareData(period.join());
      }
      this.apiTagData();
    },

    onDateTypeSelected(dateType) {
      this.dateFilter = dateType;
      this.apiCustomerAnalysisData();
    },

    /*到店客流统计*/
    apiPassengerStatistics() {
      this.loading.statistics = true;
      const urlKey = this.isPassflow ? 'passengerStatistics' : 'customerStatistics';
      return services
        .get(api.report[urlKey], {
          action: '到店客流统计'
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

    /* 客流分析*/
    apiCustomerAnalysisData() {
      this.loading.analyse = true;

      const params = Object.assign(
        {
          startDate: this.formatDate(this.customerDateRange[0]),
          endDate: this.formatDate(this.customerDateRange[1]),
          source: PassengerFlowEnum.source.ap
        },
        this.dateFilter
      );
      storeApi
        .passengerAnalysisList(params)
        .then(result => {
          const ret = overviewTool.processApiAnalyseData(result, this.countKey, this.type);
          this.customerAnalyse[0].name = ret.name;
          this.customerAnalyse[0].xAxis = ret.xAxis;
          this.customerAnalyse[0].value = ret.value;
          this.customerAnalyseTable = ret.table;
        })
        .always(() => {
          this.loading.analyse = false;
          this.showEditor = false;
          this.warning.show = false;
        });
    },

    initCompareTimeRange() {
      if (!this.confirmTimeRange) {
        this.confirmTimeRange = this.$plain(this.timeRange);
      }
    },

    /**
     * 客流量时段对比
     * @param period String 时段对比：7:00~9:00,12:00~14:00,17:00~19:00
     * */
    apiCustomerCompareData(period) {
      this.loading.compare = true;
      storeApi
        .passengerFlowCompare(
          this.formatDate(this.customerDateRange[0]),
          this.formatDate(this.customerDateRange[1]),
          PassengerFlowEnum.source.ap,
          period
        )
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

    /*用户标签数据*/
    apiTagData() {
      this.loading.tag = true;
      return services
        .get(api.report.passengerTag, {
          action: '标签数据',
          params: {
            startDate: this.formatDate(this.customerDateRange[0]),
            endDate: this.formatDate(this.customerDateRange[1])
          }
        })
        .then(result => {
          this.customerTagData = result.data;
        })
        .always(() => {
          this.loading.tag = false;
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
          source: PassengerFlowEnum.source.ap,
          type: this.isPassflow ? 0 : 1, // type=0 客流, 1 客户
          fileName: `${this.type}量分析.csv`
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
          source: PassengerFlowEnum.source.ap,
          type: this.isPassflow ? 0 : 1, // type=0 客流, 1 客户
          fileName: `${this.type}量时段对比.csv`,
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
    }
  }
};
</script>
