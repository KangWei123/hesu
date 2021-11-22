<template>
  <div class="global-data" style="height: auto">
    <!-- 实时统计 -->
    <div class="statistics-container dss-card" style="padding: 0px; margin-bottom: 10px;" v-loading="loading.rtInfo">
      <!-- <statistics-category :passengerStatistics="dataRtInfo" /> -->
      <el-radio-group v-model="dateType" @change="changeDateType" size="small" style="padding: 20px 0 10px 20px;">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
      </el-radio-group>

      <div style="padding: 20px 20px 10px 0;float:right">
        <!--提示框-->
        <tip-icon name="指标说明" :customer-indicator="customerIndicator"></tip-icon>
      </div>

      <statistics-category
        :date-range="dateRange"
        :date-type="dateType"
        :page-type="1"
        :passengerStatistics="dataRtInfo"
      />
    </div>

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

      <el-button v-if="isXS" style="margin:16px 0 0 15px; width: 100px;float:right;" @click="onGotoWeek" type="primary"
        >周报</el-button
      >

      <el-radio-group v-model="dateTimeType" @change="changeDateTimeType" size="small" style="margin-left:10px;">
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="lastWeek">上周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="lastMonth">上月</el-radio-button>
      </el-radio-group>
      <el-button type="primary" class="btn-search" @click="search">查询</el-button>
    </div>

    <div
      class="global-item global-distribution customized-block-distribution-of-shop-passenger-flow"
      v-loading="loading.distribution"
    >
      <card-title text="全局客流画像"></card-title>

      <!-- 客流画像数据 -->
      <camera-portrait-statistics
        v-if="deviceType === CAMERA_TYPE"
        isGlobal="global"
        :date-range="dateSection"
        :portraitData="portraitData"
        :rateData="rateData"
        :loading="loading.portrait"
      />
    </div>

    <!-- 客流量趋势 -->
    <passflow-trend ref="trend" :dateSection="dateSection" :deviceType="deviceType"></passflow-trend>

    <!-- 入店率 -->
    <!-- <enter-rate v-if="deviceType === 2"
                class="global-item"
                :dateSection="dateSection"
                :deviceType="deviceType" /> -->

    <!-- 店铺客流量分布 -->
    <div
      class="global-item global-distribution customized-block-distribution-of-shop-passenger-flow"
      v-loading="loading.distribution"
    >
      <card-title text="店铺客流量分布" tip-name="globalDistribution"></card-title>
      <div class="tab">
        <div
          v-for="(item, index) in areaType"
          :key="index"
          :class="{ 'tab-active': index === curAreaType }"
          @click="selectAreaType(index)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="distribution-view" v-if="distributionData">
        <el-row>
          <el-col :xs="24" :span="8">
            <div class="map">
              <map-chart
                :data="distributionData"
                :type="curAreaType"
                :min-date="startDate"
                :max-date="endDate"
                v-if="distributionData"
              ></map-chart>
            </div>
          </el-col>
          <el-col :xs="24" :span="8">
            <div class="bar">
              <bar-chart :data="distributionListData.slice(0, 4)"></bar-chart>
            </div>
          </el-col>
          <el-col :xs="24" :span="8">
            <div class="list">
              <div class="list-title">
                <span class="area-type">{{ areaType[curAreaType].label }}</span>
                <span>客流量</span>
                <span>{{ areaType[curAreaType].label }}占比</span>
              </div>
              <ul class="list-content" v-if="distributionListData.length">
                <li v-for="(item, index) in distributionListData.slice(0, showDistributionListNum)" :key="index">
                  <span class="area"
                    ><i>{{ index + 1 }}.</i>{{ item.area }}</span
                  >
                  <span>{{ item.uvFormat }}</span>
                  <span
                    >{{ item.rate && Math.round(item.rate * 10000) / 100.0
                    }}<template v-if="item.rate"
                      >%</template
                    ></span
                  >
                </li>
                <li class="btn-more" v-if="distributionListData.length > showDistributionListNum" @click="getMoreArea">
                  查看更多{{ areaType[curAreaType].label }}
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="none-data" v-else-if="!distributionData">
        <i class="key-icon key-icon-btn key-icon-none"></i>暂无数据
      </div>
    </div>

    <!-- 店铺流量TOP10 -->
    <div class="global-item global-top customized-block-store-flow-top10" v-loading="loading.topTen">
      <card-title text="店铺流量TOP10"></card-title>
      <div class="global-top-select">
        <span>区域</span>
        <el-cascader
          :options="dataArea.options"
          filterable
          change-on-select
          :props="{ label: 'name', value: 'id', children: 'childNode' }"
          v-model="dataArea.value"
          @change="fetchTopTen"
          separator="-"
        ></el-cascader>
      </div>
      <top-chart
        :valName="'passenger'"
        style="height: 280px; padding-top: 40px; "
        :data="dataTop.data"
        v-if="dataTop.data.length"
      ></top-chart>
      <div class="none-data" v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
    </div>

    <!-- 客流画像数据 -->
    <ap-portrait-statistics
      v-if="deviceType === AP_TYPE"
      :date-range="dateSection"
      :portraitData="portraitData"
      :loading="loading.portrait"
    />

    <!-- <camera-portrait-statistics v-if="deviceType === CAMERA_TYPE"
                                isGlobal="global"
                                :date-range="dateSection"
                                :portraitData="portraitData"
                                :rateData="rateData"
                                :loading="loading.portrait" /> -->
  </div>
</template>
<script>
import baseApi from '@/dss-common/api/base';
import reportApi from '@/dss-common/api/report';
import newCameraFlowApi from '../../api/camera-flow.js';
import utils from '@/dss-common/utils';
import utilsDate from '@/dss-common/utils/date';
import overviewLess from '../overview.less';
import PassflowTrend from './passflow-trend';
import EnterRate from './enter-rate';
import { mapState } from 'vuex';

import CardTitle from '../../components/card-title';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import ChartEmpty from '@/dss-common/components/ChartEmpty';
// import StatisticsCategory from '../../components/statistics/StatisticsCategory';
import StatisticsCategory from '../../components/statistics/statistics-category-new';
import CameraPortraitStatistics from '../portrait/component/camera-portrait-statistics';
import ApPortraitStatistics from '../portrait/component/ap-portrait-statistics';
import services from '@/dss-common/utils/services';
import TipIcon from './tip-icon';

const AP_TYPE = 1;
const CAMERA_TYPE = 2;

import {
  ChartBar,
  ChartPie,
  GlobalTop as TopChart,
  GlobalPie as PieChart,
  GlobalBar as BarChart,
  GlobalMap as MapChart,
  GlobalLine as LineChart,
  GlobalTrend as TrendTable
} from '@/dss-common/components';

export default {
  components: {
    StatisticsCategory,
    CardTitle,
    ChartBar,
    TopChart,
    ChartPie,
    BarChart,
    MapChart,
    PieChart,
    LineChart,
    TrendTable,
    PassflowTrend,
    PlaceHolder,
    ChartEmpty,
    EnterRate,
    CameraPortraitStatistics,
    ApPortraitStatistics,
    TipIcon
  },
  props: {
    deviceType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      lived: false,
      loading: {
        distribution: true,
        topTen: true,
        portrait: true,
        rtInfo: false,
        portrait: false
      },
      dataGender: {
        male: 0,
        female: 0,
        count: 0
      },
      dataAge: {
        data: []
      },
      dataJob: {
        data: [],
        count: 0
      },
      dataMarital: {
        unmarried: 0,
        married: 0
      },
      dataArea: {
        options: [
          {
            id: '',
            name: '全国'
          }
        ],
        value: ['']
      },
      dataTop: {
        data: []
      },
      dataRtInfo: {
        // todayCustomer: 0,
        // lastWeekTodayCustomer: 0,
        // todayTarget: 0,
        // thisWeekCustomer: 0,
        // lastWeekCustomer: 0,
        // thisWeekTarget: 0,
        // thisMonthCustomer: 0,
        // lastMonthCustomer: 0,
        // thisMonthTarget: 0
        customerCount: 0,
        customerLastCount: 0,
        flowCount: 0,
        flowLastCount: 0,
        memberCount: 0,
        memberLastCount: 0
      },
      dateType: 'today',
      dateTimeType: null,
      dateRange: [utilsDate.addDays(new Date(), -1), new Date()],
      dateSection: {
        startDate: utils.timeFormat(utilsDate.addDays(new Date(), -1), 'YYYY-MM-DD'),
        endDate: utils.timeFormat(new Date(), 'YYYY-MM-DD')
      },
      startDate: '',
      endDate: '',
      // 区域选择： 省份、城市、区
      areaType: [
        { label: '省份', value: 'prov' },
        { label: '城市', value: 'city' },
        { label: '区', value: 'area' }
      ],
      // 当前选中的区域（0省份、1城市、2区）
      curAreaType: 0,
      distributionData: null,
      // 店铺客流量分布lsit数据
      distributionListData: [],
      showDistributionListNum: 10,
      portraitData: [],
      rateData: {},
      CAMERA_TYPE,
      AP_TYPE,
      customerIndicator: [
        { title: '客流', text: '指顾客进店次数' },
        { title: '客户', text: '指顾客进店的去重客流数' },
        { title: '会员', text: '指会员进店次数' }
      ]
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    timeList() {
      return utils.getTimeList(this.startDate, this.endDate);
    },
    isXS() {
      if (this.userInfo && this.userInfo.epId && this.userInfo.epId === 408) {
        return true;
      }
      return false;
    }
  },
  methods: {
    // 时间选择器变化时
    onTimePick() {
      this.dateTimeType = null;
      this.search();
    },

    search() {
      this.startDate = this.formatDate(this.dateRange[0]);
      this.endDate = this.formatDate(this.dateRange[1]);
      this.dateSection = { startDate: this.startDate, endDate: this.endDate };
      this.fetchDistributionData();
      this.fetchTopTen();
      this.fetchPortrait();
      // this.fetchRtInfo();
      if (this.deviceType === CAMERA_TYPE) {
        this.fetchConversionRate();
      }
    },

    getPassengerAndTagDataInterval() {
      // Promise.all([this.fetchRtInfo()]).always(() => {
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
    formatter(x, y, max, index) {
      const val = max ? ((y / max) * 100).toFixed(2) + '%' : '0.00%';
      return `<div class="dss_tooltip_t">${val}</div><div class="dss_tooltip_d">${x}</div>`;
    },
    // 选中区域tab
    selectAreaType(index) {
      this.curAreaType = index;

      // 重置查看更多默认值
      this.showDistributionListNum = 10;

      this.fetchDistributionData();
    },

    // 店铺客流量分布
    fetchDistributionData() {
      this.loading.distribution = true;
      let params = {
        areaType: this.areaType[this.curAreaType].value,
        deviceType: this.deviceType,
        startDate: this.startDate,
        endDate: this.endDate
      };
      if (this.deviceType !== CAMERA_TYPE) {
        params.startTime = this.startDate;
        params.endTime = this.endDate;
      }

      reportApi.distri(params).then(
        ({ data }) => {
          // 无数据
          if (!data.length) {
            this.distributionData = null;
            this.distributionListData = null;
          } else {
            this.distributionData = data;
            const area = ['storeProv', 'storeCity', 'storeArea'][this.curAreaType];
            this.distributionListData = data.map(item => ({
              uv: item.uv,
              uvFormat: utils.addSeparator(item.uv),
              rate: item.rate,
              area: item[area],
              details: item.details
            }));
          }
          this.loading.distribution = false;
        },
        () => (this.loading.distribution = false)
      );
    },
    // 查看更多城市
    getMoreArea() {
      if (!this.distributionData) {
        return;
      }

      // 目前确定展示top50省、市、区
      if (this.distributionData.length > 50) {
        this.showDistributionListNum = 50;
      } else {
        this.showDistributionListNum = this.distributionData.length;
      }
    },

    formatDate(datetime) {
      return utils.timeFormat(datetime, 'YYYY-MM-DD');
    },

    // 请求客流TOP10数据
    fetchTopTen(val = []) {
      this.loading.topTen = true;
      const provinceId = val[0] || '';
      const cityId = val[1] || '';
      const districtId = val[2] || '';

      let params = {
        deviceType: this.deviceType,
        startTime: this.startDate,
        endTime: this.endDate
      };

      if (this.deviceType !== CAMERA_TYPE) {
        params.startTime = this.startDate;
        params.endTime = this.endDate;
      }

      params.provinceId = provinceId;
      if (cityId) {
        params.cityId = cityId;
      }
      if (districtId) {
        params.districtId = districtId;
      }
      reportApi.topTen(params).then(
        ({ data }) => {
          this.dataTop.data = data
            ? data.sort((a, b) => {
                return a.passenger > b.passenger;
              })
            : [];
          this.loading.topTen = false;
        },
        () => (this.loading.topTen = false)
      );
    },
    // 请求实时统计数据
    fetchRtInfo() {
      // this.loading.rtInfo = true;
      reportApi
        .rtInfo({
          deviceType: this.deviceType
        })
        .then(
          ({ data }) => {
            if (data) {
              for (const key in data) {
                this.dataRtInfo[key] = data[key];
              }
            }
            this.loading.rtInfo = false;
          },
          () => (this.loading.rtInfo = false)
        );
    },
    // 实时统计数据日期切换
    changeDateType() {
      this.dataRtInfo = {
        customerCount: 0,
        customerLastCount: 0,
        flowCount: 0,
        flowLastCount: 0,
        memberCount: 0,
        memberLastCount: 0
      };
      clearTimeout(this.timeoutId);
      this.getPassengerAndTagDataInterval();
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
      this.startDate = this.formatDate(this.dateRange[0]);
      this.endDate = this.formatDate(this.dateRange[1]);
      // 请求客流量趋势数据
      this.dateSection = { startDate: this.startDate, endDate: this.endDate };
      this.search();
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

    /* 获取客流数据 */
    getCustomerRecordByDateType(dateType = 'today') {
      const fetchType = {
        today: 'getEpCustomerRecordDay',
        week: 'getEpCustomerRecordWeek',
        month: 'getEpCustomerRecordMonth'
      };
      const type = fetchType[dateType];
      // return newCameraFlowApi[type]({ equType: 2, dataScope: 'ep' })
      return newCameraFlowApi[type]({ equType: 2 })
        .then(res => {
          if (res.data) {
            this.dataRtInfo = res.data;
          }
        })
        .always(() => {
          this.loading.statistics = false;
        });
    },
    fetchLocation() {
      reportApi.areaTree().done(({ data }) => {
        if (data && data.length) {
          const areas = this.fitlerEmptyChildren(data) || [];
          this.dataArea.options = this.dataArea.options.concat(areas);
        }
      });
    },
    fitlerEmptyChildren(nodes) {
      if (!nodes || nodes.length === 0) {
        return null;
      }

      for (const node of nodes) {
        node.childNode = this.fitlerEmptyChildren(node.childNode);
      }
      return nodes;
    },
    onGotoWeek() {
      this.$router.push('/report/week');
    },
    // 请求全局画像数据
    fetchPortrait() {
      this.loading.portrait = true;
      let params = {
        startDate: this.startDate,
        endDate: this.endDate,
        isCustomer: 0
      };

      if (this.deviceType !== CAMERA_TYPE) {
        params.startTime = this.startDate;
        params.endTime = this.endDate;
      }

      const url_rt = this.deviceType === CAMERA_TYPE ? reportApi.AI_PORTRAIT_URL : reportApi.AP_PORTRAIT_URL;
      return services
        .get(url_rt, {
          action: '获取客户画像数据',
          params
        })
        .then(({ data }) => {
          this.loading.portrait = false;
          this.portraitData = data;
        })
        .always(() => {
          this.loading.portrait = false;
        });
    },
    fetchConversionRate() {
      let params = {
        deviceType: this.deviceType,
        startDate: this.startDate,
        endDate: this.endDate
      };
      reportApi.getGloalConversionRate(params).then(
        ({ data }) => {
          this.rateData = data;
        },
        () => {}
      );
    }
  },
  mounted() {
    this.fetchLocation();
    this.lived = true;
    this.changeDateType();
    this.search();
  },
  destroyed() {
    if (!!this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.lived = false;
  }
};
</script>

<style lang="less" scoped>
.global-data {
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
    // background: #409eff;
    font-size: 12px;
    margin-left: 8px;
    vertical-align: middle;
  }
}
</style>
