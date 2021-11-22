<template>
  <div class="global-data" style="height: auto">

    <!-- 实时统计 -->
    <div class="shadow-container statistics-container" style="padding: 0px" v-loading="loading.rtInfo">
      <statistics-category :passengerStatistics="dataRtInfo"/>
    </div>

    <!-- 时间选择控件 -->
    <date-range @pick="onTimePick"></date-range>

    <!-- 客流量趋势 -->
    <div class="global-item global-trend" v-loading="loading.trend">
      <card-title text="客流量趋势" tip-name="globalTrend">
        <template slot="right">
          <i
            :title="trendViewType === 'chart' ? '表格视图' : '趋势视图'"
            class="key-icon key-icon-btn"
            :class="{
                'key-icon-table': trendViewType === 'chart',
                'key-icon-trend': trendViewType === 'table',
                'disabled': !trendTableData || !trendChartData
            }"
            @click="toggleView('trendViewType')">
          </i>
          <i
            title="导出Excel"
            class="key-icon key-icon-btn key-icon-download"
            :class="{ disabled: !trendTableData || !trendChartData }"
            @click="downloadTrendData">
          </i>
        </template>
      </card-title>
      <div class="tab">
        <div v-for="(item, index) in trendType" :key="index" :class="{ 'tab-active': index === curTrendType }" @click="selectTrendType(index)">{{ item.label }}</div>
      </div>

      <div class="compare-editor"><span @click="toggleEditor"><i class="key-icon key-icon-btn key-icon-editor"></i>编辑对比{{trendType[curTrendType].label}}</span></div>

      <div class="editor-form" v-if="showEditor">
        <div class="area-type" v-if="curTrendType === 1">
          <div v-for="item in trendAreaType" :class="{active: item.value === curTrendAreaType}" :key="item.value" @click="selectTrendAreaType(item.value)">{{item.label}}</div>
        </div>

        <el-alert
          v-if="showWarning"
          :title="'请先选择' + trendType[curTrendType].label"
          class="text-center"
          type="warning"
          show-icon
          @close="toggleWarning">
        </el-alert>

        <div class="form">
          <div class="form-item" v-for="(item, i) in trendCompareRange" :key="i">
            <i class="key-icon key-icon-btn key-icon-subtract" @click="removeCompareItem(i)"></i>
            <template>{{trendType[curTrendType].label}} ：</template>
            <el-select v-model="item.id" @change="changeSelectStore" v-if="curTrendType === 0" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.value"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="item.value" v-else-if="curTrendType === 1" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="form-item add" v-if="trendCompareRange.length < 3">
            <span @click="addCompareItem"><i class="key-icon key-icon-btn key-icon-add"></i>添加{{trendType[curTrendType].label}}</span>
          </div>
        </div>

        <el-button type="primary" @click="validateCompare">确定</el-button>
        <el-button @click="showEditor = false">取消</el-button>
      </div>

      <div class="compare-view" v-if="!showEditor">
        <div class="time-compare">
          <div class="time-compare-item" v-for="(item, i) in confirmTrendCompareRange" :key="i" v-if="confirmTrendCompareRange.length && trendChartData">
            <i class="key-icon key-icon-btn" :class="{'key-icon-location-one': i === 0, 'key-icon-location-two': i === 1, 'key-icon-location-three': i === 2}"></i>
            <span>{{item.value}}</span>
            <span class="text">对比</span>
          </div>
        </div>

        <div class="compare-view-chart" v-if="trendViewType === 'chart'">
          <div class="none-data" v-if="!trendChartData"><i class="key-icon key-icon-btn key-icon-none" title="编辑对比店铺/区域" @click="toggleEditor"></i>暂无数据，请重新选择对比{{trendType[curTrendType].label}}</div>

          <line-chart :data="trendChartData" :type="trendType[curTrendType].value" v-else-if="trendChartData"></line-chart>
        </div>

        <template v-else-if="trendViewType === 'table'">
          <trend-table :data="trendTableData" v-if="trendTableData"></trend-table>
        </template>
      </div>
    </div>

    <!-- 店铺客流量分布 -->
    <div class="global-item global-distribution" v-loading="loading.distribution">
      <card-title text="店铺客流量分布" tip-name="globalDistribution"></card-title>
      <div class="tab">
        <div v-for="(item, index) in areaType" :key="index" :class="{ 'tab-active': index === curAreaType }" @click="selectAreaType(index)">{{ item.label }}</div>
      </div>
      <div class="distribution-view" v-if="distributionData">
        <el-row>
          <el-col :xs="24" :span="8">
            <div class="map">
              <map-chart :data="distributionData" :type="curAreaType" :min-date="startDate" :max-date="endDate" v-if="distributionData"></map-chart>
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
                <span class="area-type">{{areaType[curAreaType].label}}</span>
                <span>客流量</span>
                <span>{{areaType[curAreaType].label}}占比</span>
              </div>
              <ul class="list-content" v-if="distributionListData.length">
                <li v-for="(item, index) in distributionListData.slice(0, showDistributionListNum)" :key="index">
                  <span class="area"><i>{{index + 1}}.</i>{{ item.area }}</span>
                  <span>{{ item.uvFormat }}</span>
                  <span>{{ item.rate && Math.round(item.rate * 10000) / 100.00 }}<template v-if="item.rate">%</template></span>
                </li>
                <li class="btn-more" v-if="distributionListData.length > showDistributionListNum" @click="getMoreArea">查看更多{{areaType[curAreaType].label}}</li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="none-data" v-else-if="!distributionData"><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
    </div>

    <!-- 店铺流量TOP10 -->
    <div class="global-item global-top" v-loading="loading.topTen">
      <card-title text="店铺流量TOP10"></card-title>
      <div class="global-top-select">
        <span>区域</span>
        <el-cascader :options="dataArea.options" filterable change-on-select :props="{label:'value'}" v-model="dataArea.value" @change="fetchTopTen" separator="-"></el-cascader>
      </div>
      <top-chart
        :valName="'passenger'"
        :data="dataTop.data"
        v-if="dataTop.data.length"></top-chart>
      <div class="none-data" v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
    </div>

    <!-- 客流画像数据 -->
    <el-row :gutter="20">
      <el-col :xs="24" :span="8" style="margin-bottom:20px">
        <el-card v-loading="loading.portrait" style="height:310px">
          <div slot="header">
            <h2 class="dss_profile_title">年龄占比</h2>
            <p class="dss_profile_desc">各年龄段 / 整个品牌全体会员</p>
          </div>
          <chart-bar :data="dataAge.data" v-if="dataAge.data.length"></chart-bar>
          <div class="none-data" v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :span="8" style="margin-bottom:20px">
        <el-card v-loading="loading.portrait" style="height:310px">
          <div slot="header">
            <h2 class="dss_profile_title">性别占比</h2>
            <p class="dss_profile_desc">性别 / 整个品牌全体会员</p>
          </div>
          <dl class="dss_profile_sex">
            <dt><img src="@/dss-store/src/images/boy.png"/>男性</dt>
            <dd>{{dataGender.male}}%</dd>
            <dt><img src="@/dss-store/src/images/girl.png"/>女性</dt>
            <dd style="color:#F4516C">{{dataGender.female}}%</dd>
          </dl>
        </el-card>
      </el-col>
      <el-col :xs="24" :span="8" style="margin-bottom:20px">
        <el-card v-loading="loading.portrait" style="height:310px;overflow:visible">
          <div slot="header">
            <h2 class="dss_profile_title">职业占比</h2>
            <p class="dss_profile_desc">职业 / 整个品牌全体会员</p>
          </div>
          <pie-chart :data="dataJob.data" v-if="dataJob.data.length" legend="职业"></pie-chart>
          <div class="none-data" v-else><i class="key-icon key-icon-btn key-icon-none"></i>暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import baseApi from '@/dss-common/api/base';
import reportApi from '@/dss-common/api/report';
import utils from '@/dss-common/utils';
import StatisticsCategory from '../components/statistics/StatisticsCategory';
import overviewLess from './overview.less';

import CardTitle from '../components/card-title';

import {
  ChartBar,
  ChartPie,
  GlobalTop as TopChart,
  GlobalPie as PieChart,
  GlobalBar as BarChart,
  GlobalMap as MapChart,
  GlobalLine as LineChart,
  GlobalTrend as TrendTable,
  DateRange
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
    DateRange
  },
  data() {
    return {
      loading: {
        distribution: true,
        trend: true,
        topTen: true,
        portrait: true,
        rtInfo: true
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
            value: '全国'
          }
        ],
        value: ['全国']
      },
      dataTop: {
        data: []
      },
      dataRtInfo: {
        todayCustomer: 0,
        lastWeekTodayCustomer: 0,
        todayTarget: 0,
        thisWeekCustomer: 0,
        lastWeekCustomer: 0,
        thisWeekTarget: 0,
        thisMonthCustomer: 0,
        lastMonthCustomer: 0,
        thisMonthTarget: 0
      },
      startDate: '',
      endDate: '',
      // 区域选择： 省份、城市、区
      areaType: [{ label: '省份', value: 'prov' }, { label: '城市', value: 'city' }, { label: '区', value: 'area' }],
      // 当前选中的区域（0省份、1城市、2区）
      curAreaType: 0,
      distributionData: null,
      // 店铺客流量分布lsit数据
      distributionListData: [],
      showDistributionListNum: 10,

      // 店铺 区域选择
      trendType: [{ label: '店铺', value: 'store' }, { label: '区域', value: 'customer' }],
      // 当前选中的趋势类型（0店铺、1区域）
      curTrendType: 0,
      trendViewType: 'chart',
      // 趋势chart数据
      trendChartData: null,
      // 趋势表格数据
      trendTableData: null,
      // trend
      // 显示编辑界面
      showEditor: true,
      // 显示警告提示
      showWarning: false,

      stores: [],
      areas: [],
      trendAreaType: [
        { label: '省', value: 'provs' },
        { label: '市', value: 'citys' },
        { label: '区', value: 'areas' }
      ],
      curTrendAreaType: 'citys',
      // 对比数据
      trendCompareRange: [
        {
          value: ''
        }
      ],
      // 对比数据确定
      confirmTrendCompareRange: [
        {
          value: '',
          id: ''
        }
      ],
      trendTemp: {
        store: null,
        area: null
      },
      options: []
    };
  },
  computed: {
    timeList() {
      return utils.getTimeList(this.startDate, this.endDate);
    }
  },
  methods: {
    // 时间选择器变化时
    onTimePick(val) {
      this.startDate = val[0];
      this.endDate = val[1];

      // 请求客流量趋势数据
      if (this.confirmTrendCompareRange[0].value) {
        this.validateCompare();
      }

      this.fetchDistributionData();

      this.fetchTopTen();
      this.fetchPortrait();
      this.fetchRtInfo();
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
      reportApi
        .distri({
          startDate: this.startDate,
          endDate: this.endDate,
          areaType: this.areaType[this.curAreaType].value
        })
        .then(
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
    // 记住上次选择的区域或者店铺
    setTemp(key, old) {
      this.trendTemp[key] = {
        trendChartData: this.trendChartData,
        trendTableData: this.trendTableData,
        trendCompareRange: this.trendCompareRange,
        confirmTrendCompareRange: this.confirmTrendCompareRange
      };
      const temp = this.trendTemp[old];
      if (temp) {
        (this.trendChartData = temp.trendChartData),
          (this.trendTableData = temp.trendTableData),
          (this.trendCompareRange = temp.trendCompareRange),
          (this.confirmTrendCompareRange = temp.confirmTrendCompareRange);
      } else {
        this.clearTrendData();
      }
    },
    clearTrendData() {
      // 清空趋势数据
      this.trendChartData = null;
      // 清空趋势表格数据
      this.trendTableData = null;
      // 清空选择对比的店铺（地区）
      this.trendCompareRange = [];
      this.confirmTrendCompareRange = [];
    },
    // 选择区域、店铺
    selectTrendType(index) {
      // 设置当前店铺
      this.curTrendType = index;
      if (this.curTrendType === 1) {
        this.setTemp('store', 'area');
        // 首次切换到区域，设置默认数据
        if (this.trendCompareRange.length === 0) {
          this.areas.citys.forEach((item, i) => {
            if (i < 3) {
              this.trendCompareRange.push({ value: item, id: item });
            }
          });
        }
        this.options = this.areas[this.curTrendAreaType].map(item => ({ value: item }));
      } else {
        this.setTemp('area', 'store');
        this.options = this.stores.map(item => ({ value: item.value, id: item.id }));
      }
      this.validateCompare();
      // this.showEditor = true
    },
    // 获取客流量趋势地区
    fetchTrendArea() {
      reportApi.area().then(({ data }) => {
        if (data && (data.areas.length || data.citys.length || data.provs.length)) {
          this.areas = data;
        } else {
          this.areas = {
            provs: [],
            citys: [],
            areas: []
          };
        }
      });
    },
    // 获取客流量趋势店铺
    fetchTrendStore() {
      baseApi.storeList().then(({ data }) => {
        if (!data.length) {
          return;
        }
        this.stores = this.options = data.map(item => ({ value: item.name, id: item.id }));

        // 刷新页面，当获取到店铺数据时触发对比请求(默认3条)
        if (this.stores.length) {
          this.trendCompareRange = [];
          this.stores.forEach((item, i) => {
            if (i < 3) {
              this.trendCompareRange.push({ value: item.value, id: item.id });
            }
          });

          this.validateCompare();
        }
      });
    },
    /**
     * 切换表格视图和趋势视图
     * @param  {[type]} moduleName 'analyseType' 或者 'compareType'
     */
    toggleView(moduleName) {
      this[moduleName] = this[moduleName] === 'chart' ? 'table' : 'chart';
    },
    // 下载客流量趋势数据
    downloadTrendData() {
      let compare = [];
      let compareId = [];

      // 确定的对比范围
      this.confirmTrendCompareRange.forEach(item => {
        compare.push(item.value);
        compareId.push(item.id);
      });

      let params = {
        dlFileName: '客流量趋势',
        isDownload: true,
        startDate: this.startDate,
        endDate: this.endDate,
        tabType: this.trendType[this.curTrendType].value,
        compare,
        compareId
      };
      let url = utils.makeUrl(reportApi.trendUrl, params);
      window.open(url);
    },
    // 切换时段编辑界面
    toggleEditor() {
      this.trendCompareRange = utils.plain(this.confirmTrendCompareRange);
      this.showEditor = !this.showEditor;
    },
    // 客流量趋势比较选择 省市区
    selectTrendAreaType(val) {
      this.curTrendAreaType = val;
      this.trendCompareRange = [{ value: '', id: '' }];
      this.options = this.areas[this.curTrendAreaType].map(item => ({ value: item }));
    },
    // 添加店铺/地区
    addCompareItem() {
      if (this.trendCompareRange.length < 3) {
        this.trendCompareRange.push({
          value: '',
          id: ''
        });
      }
    },
    // 删除店铺/地区
    removeCompareItem(index) {
      if (this.trendCompareRange.length > 1) {
        this.trendCompareRange.splice(index, 1);
      }
    },
    // 选择店铺(fix迁移后storename改为storeid)
    changeSelectStore(val) {
      const storeName = this.options.find(item => item.id === +val);
      this.trendCompareRange.find(item => {
        if (item.id === val) {
          item.value = storeName.value;
        }
      });
    },
    // 确定编辑
    validateCompare() {
      let compare = [];
      let compareId = [];
      for (let i = 0, length = this.trendCompareRange.length; i < length; i++) {
        // 校验是否已选择店铺、地区
        if (!this.trendCompareRange[i].value) {
          this.showWarning = true;
          return;
        }
        compare.push(this.trendCompareRange[i].value);
        compareId.push(this.trendCompareRange[i].id);
      }

      this.confirmTrendCompareRange = utils.plain(this.trendCompareRange);
      this.showEditor = false;
      this.showWarning = false;
      this.fetchTrendData(compare.join(), compareId.join());
    },
    // 请求对比数据
    fetchTrendData(compare, compareId) {
      this.loading.trend = true;
      reportApi
        .trend({
          tabType: this.trendType[this.curTrendType].value,
          compare,
          compareId,
          startDate: this.startDate,
          endDate: this.endDate
        })
        .then(
          ({ data }) => {
            // 无数据
            if (data === null || data === '' || !data.length) {
              this.trendChartData = null;
              this.trendTableData = null;
            } else {
              const chartData = [];
              const tableData = [];
              const timeList = this.timeList;
              this.confirmTrendCompareRange.forEach(item => {
                const store = item.value;
                const series = [];
                timeList.forEach(tdate => {
                  series.push({
                    area: store,
                    storeArea: '',
                    storeCity: '',
                    storeProv: '',
                    customer: 0,
                    storeId: 0,
                    storeName: store,
                    tdate
                  });
                });
                for (let i = data.length - 1; i >= 0; i--) {
                  const _item = data[i];
                  if (_item.name === store) {
                    _item.list.forEach(subItem => {
                      const index = timeList.indexOf(subItem.tdate);
                      if (index !== -1) {
                        series[index] = subItem;
                      }
                    });
                    break;
                  }
                }
                chartData.push({
                  store,
                  series,
                  xAxis: timeList
                });
              });

              timeList.forEach((tdate, index) => {
                const compareData = [];
                this.confirmTrendCompareRange.forEach(item => {
                  let customer = 0;
                  for (let i = chartData.length - 1; i >= 0; i--) {
                    const _item = chartData[i];
                    if (_item.store === item.value) {
                      customer = _item.series[index].customer;
                      break;
                    }
                  }
                  compareData.push({
                    name: item.value,
                    customer
                  });
                });
                tableData.push({
                  compareData,
                  tdate
                });
              });

              // line-chart数据
              this.trendChartData = chartData;

              // table数据
              this.trendTableData = tableData;
            }
            this.loading.trend = false;
          },
          () => (this.loading.trend = false)
        );
    },
    // 请求客流TOP10数据
    fetchTopTen(val = []) {
      this.loading.topTen = true;
      const province = val[0] || '';
      const city = val[1] || '';
      const params = {
        startTime: this.startDate,
        endTime: this.endDate
      };
      if (province && province !== '全国') {
        params.province = province;
      }
      if (city) {
        params.city = city;
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
    // 请求全局画像数据
    fetchPortrait() {
      this.loading.portrait = true;
      reportApi
        .portrait({
          startTime: this.startDate,
          endTime: this.endDate
        })
        .then(
          ({ data }) => {
            data.forEach(item => {
              switch (item.tag) {
                case 'sex':
                  item.data.forEach(subItem => {
                    if (subItem.portraitName === '男') {
                      this.dataGender.male = subItem.portraitRate;
                    } else if (subItem.portraitName === '女') {
                      this.dataGender.female = subItem.portraitRate;
                    }
                  });
                  break;
                case 'user_age':
                  this.dataAge.data = item.data
                    ? item.data.map(item => {
                        item.portraitRate /= 100;
                        return item;
                      })
                    : [];
                  break;
                case 'user_job':
                  this.dataJob.data = item.data;
                  break;
              }
            });
            this.loading.portrait = false;
          },
          () => (this.loading.portrait = false)
        );
    },
    // 请求实时统计数据
    fetchRtInfo() {
      this.loading.rtInfo = true;
      reportApi
        .rtInfo({
          startTime: this.startDate,
          endTime: this.endDate
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
    fetchLocation() {
      reportApi.location().then(({ data }) => {
        if (data && data.length) {
          const list = [];
          data.forEach(item => {
            list.push({
              value: item.province,
              children: item.cities.map(item => {
                return {
                  value: item
                };
              })
            });
          });
          this.dataArea.options = this.dataArea.options.concat(list);
        }
      });
    },
    toggleWarning() {
      this.showWarning = !this.showWarning;
    }
  },
  mounted() {
    this.fetchLocation();
    this.fetchTrendStore();
    this.fetchTrendArea();
  }
};
</script>

