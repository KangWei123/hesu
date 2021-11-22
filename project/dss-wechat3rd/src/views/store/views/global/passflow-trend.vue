<template>
  <div class="global-item global-trend" v-loading="loading.trend">
    <card-title text="客流量趋势" tip-name="globalTrend">
      <template slot="right">
        <i
          :title="trendViewType === 'chart' ? '表格视图' : '趋势视图'"
          class="key-icon key-icon-btn"
          :class="{
            'key-icon-table': trendViewType === 'chart',
            'key-icon-trend': trendViewType === 'table',
            disabled: !trendTableData || !trendChartData
          }"
          @click="toggleView('trendViewType')"
        >
        </i>
        <i
          title="导出Excel"
          class="key-icon key-icon-btn key-icon-download"
          :class="{ disabled: !trendTableData || !trendChartData }"
          @click="downloadTrendData"
        >
        </i>
      </template>
    </card-title>

    <date-filter @filter="onDateTypeSelected" style="float:left" />

    <div class="tab">
      <div
        v-for="(item, index) in trendType"
        :key="index"
        :class="{ 'tab-active': index === curTrendType }"
        @click="selectTrendType(index)"
      >
        {{ item.label }}
      </div>
    </div>

    <div class="compare-editor">
      <span @click="toggleEditor">
        <i class="key-icon key-icon-btn key-icon-editor"></i>编辑对比{{ trendType[curTrendType].label }}</span
      >
    </div>

    <div class="editor-form" v-if="showEditor">
      <div class="area-type" v-if="curTrendType === 1">
        <div
          v-for="item in trendAreaType"
          :class="{ active: item.value === curTrendAreaType }"
          :key="item.value"
          @click="selectTrendAreaType(item.value)"
        >
          {{ item.label }}
        </div>
      </div>

      <el-alert
        v-if="showWarning"
        :title="'请先选择' + trendType[curTrendType].label"
        class="text-center"
        type="warning"
        show-icon
        @close="toggleWarning"
      >
      </el-alert>

      <div class="form">
        <div class="form-item" v-for="(item, i) in trendCompareRange" :key="i">
          <i class="key-icon key-icon-btn key-icon-subtract" @click="removeCompareItem(i)"></i>
          <template
            >{{ trendType[curTrendType].label }} ：</template
          >
          <el-select
            v-model="item.id"
            @change="changeSelectStore"
            v-if="curTrendType === 0"
            filterable
            placeholder="请选择"
          >
            <el-option v-for="item in options" :key="item.id" :label="item.value" :value="item.id"> </el-option>
          </el-select>
          <area-select
            v-else-if="curTrendType === 1"
            :options="areas"
            v-model="item.id"
            :label.sync="item.value"
            :level="level"
          ></area-select>
        </div>

        <div class="form-item add" v-if="trendCompareRange.length < 3">
          <span @click="addCompareItem">
            <i class="key-icon key-icon-btn key-icon-add"></i>添加{{ trendType[curTrendType].label }}</span
          >
        </div>
      </div>

      <el-button type="primary" @click="validateCompare">确定</el-button>
      <el-button @click="showEditor = false">取消</el-button>
    </div>

    <div class="compare-view" v-if="!showEditor">
      <div class="time-compare">
        <div
          class="time-compare-item"
          v-for="(item, i) in confirmTrendCompareRange"
          :key="i"
          v-if="confirmTrendCompareRange.length && trendChartData"
        >
          <i
            class="key-icon key-icon-btn"
            :class="{
              'key-icon-location-one': i === 0,
              'key-icon-location-two': i === 1,
              'key-icon-location-three': i === 2
            }"
          ></i>
          <span>{{ item.value }}</span>
          <span class="text">对比</span>
        </div>
      </div>

      <div class="compare-view-chart" v-if="trendViewType === 'chart'">
        <div class="none-data" v-if="!trendChartData">
          <i class="key-icon key-icon-btn key-icon-none" title="编辑对比店铺/区域" @click="toggleEditor"></i
          >暂无数据，请重新选择对比{{ trendType[curTrendType].label }}或时间
        </div>

        <line-chart
          :data="trendChartData"
          :type="trendType[curTrendType].value"
          v-else-if="trendChartData"
        ></line-chart>
      </div>

      <template v-else-if="trendViewType === 'table'">
        <trend-table :data="trendTableData" :type="curTrendType" v-if="trendTableData"></trend-table>
      </template>
    </div>
  </div>
</template>

<script>
import CardTitle from '../../components/card-title';
import baseApi from '@/dss-common/api/base';
import utils from '@/dss-common/utils';
import reportApi from '@/dss-common/api/report';
import AreaSelect from '../../components/area-select';
import Qs from 'qs';
import { GlobalLine as LineChart, GlobalTrend as TrendTable } from '@/dss-common/components';
import DateFilter from '../passflow/overview/DateFilter';

const TREND_STORE = 0;

export default {
  components: {
    LineChart,
    CardTitle,
    TrendTable,
    AreaSelect,
    DateFilter
  },
  props: {
    dateSection: {
      type: Object,
      default: function() {
        return { startDate: '', endDate: '' };
      }
    },
    deviceType: {
      type: Number,
      default: 0
    }
  },
  watch: {
    dateSection: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal && newVal.startDate && newVal.endDate) {
          if (this.stores && this.stores.length) {
            this.reload();
          } else {
            this.fetchTrendStore();
          }
        }
      }
    }
  },

  data() {
    return {
      trendViewType: 'chart',
      loading: {
        trend: true
      },
      stores: [],
      areas: [],
      trendTemp: {
        store: null,
        area: null
      },
      curTrendAreaType: 'citys',
      // 趋势chart数据
      trendChartData: null,
      // 趋势表格数据
      trendTableData: null,
      // 店铺 区域选择
      trendType: [{ label: '店铺', value: 'store' }, { label: '区域', value: 'customer' }],
      trendAreaType: [
        { label: '省', value: 'provs' },
        { label: '市', value: 'citys' },
        { label: '区', value: 'areas' }
      ],
      // 当前选中的趋势类型（0店铺、1区域）
      curTrendType: TREND_STORE,
      // 显示编辑界面
      showEditor: true,
      // 显示警告提示
      showWarning: false,
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
      options: [],
      dateType: {}
    };
  },
  computed: {
    timeList() {
      return utils.getTimeList(this.dateSection.startDate, this.dateSection.endDate);
    },
    level() {
      switch (this.curTrendAreaType) {
        case 'provs':
          return 1;
        case 'citys':
          return 2;
        case 'areas':
          return 3;
      }
      return 0;
    }
  },
  mounted() {
    this.fetchTrendArea();
  },
  methods: {
    onDateTypeSelected(dateType) {
      this.dateType = dateType;
      this.validateCompare();
    },
    // 删除店铺/地区
    removeCompareItem(index) {
      if (this.trendCompareRange.length > 1) {
        this.trendCompareRange.splice(index, 1);
      }
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

      const params = this.formatParam(compare, compareId);
      params.fileName = '客流量趋势.csv';
      const url = Qs.stringify(params, {
        deviceType: this.deviceType,
        addQueryPrefix: true,
        arrayFormat: 'indices',
        allowDots: true
      });
      window.open(reportApi.trendUrl + url);
    },
    toggleEditor() {
      this.trendCompareRange = utils.plain(this.confirmTrendCompareRange);
      this.showEditor = !this.showEditor;
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
      this.fetchTrendData(compare, compareId);
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
    formatParam(compare, compareId) {
      const compareType = this.curTrendType;
      const params = {
        tabType: this.trendType[this.curTrendType].value,
        compareType,
        startDate: this.dateSection.startDate,
        endDate: this.dateSection.endDate,
        deviceType: this.deviceType,
        ...this.dateType
      };
      if (this.curTrendType === TREND_STORE) {
        params.storeIdList = compareId;
      } else {
        params.areaList = compareId.map(id => {
          const ids = (id + '').split('-');
          const area = {
            provinceId: ids[0],
            cityId: ids[1],
            areaId: ids[2]
          };
          for (let key in area) {
            // 删除无效属性
            if (!area[key] || area[key] === 'NA') {
              delete area[key];
            }
          }
          return area;
        });
        const areaType = this.curTrendAreaType;
        params.orderRule = areaType === 'provs' ? 'store_prov' : areaType === 'citys' ? 'store_city ' : 'store_area';
      }
      return params;
    },
    // 请求对比数据
    fetchTrendData(compare, compareId) {
      this.loading.trend = true;
      const params = this.formatParam(compare, compareId);
      reportApi
        .trend(params)
        .done(({ data }) => {
          // 无数据
          if (!data || data === '') {
            this.trendChartData = null;
            this.trendTableData = null;
            return data;
          }

          //判断无数据
          let isNull = false;
          if (!Object.keys(data).length) {
            return;
          }
          for (let key in data) {
            if (!data[key] || !data[key].length) {
              isNull = true;
            }
          }
          if (isNull) {
            this.trendChartData = null;
            this.trendTableData = null;
            return;
          }

          const chartData = [];
          const tableData = [];

          let timeList = [];
          this.confirmTrendCompareRange.forEach(item => {
            const store = item.value;
            const series = [];
            const serieData = data[store];
            if (!serieData) {
              return;
            }
            timeList = [];
            serieData.forEach(seri => {
              timeList.push(seri.date);
            });
            timeList.forEach(tdate => {
              series.push({
                area: store,
                customer: 0,
                passenger: 0,
                storeId: 0,
                storeName: store,
                tdate: tdate
              });
            });

            if (serieData && serieData.length) {
              series.forEach((s, i) => {
                const finded = serieData.find(d => d.date === s.tdate);
                if (finded) {
                  s.passenger = finded.count; //客流
                  s.customer = finded.customer; //客户
                  if (finded.dayOfWeek) {
                    s.tdate = finded.date + '\n\n' + finded.dayOfWeek;
                    timeList[i] = finded.date + '\n\n' + finded.dayOfWeek;
                  }
                }
              });
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
              let passenger = 0;
              for (let i = chartData.length - 1; i >= 0; i--) {
                const _item = chartData[i];
                if (_item.store === item.value) {
                  passenger = _item.series[index].passenger;
                  break;
                }
              }
              compareData.push({
                name: item.value,
                passenger
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
          this.trendTableData = tableData.reverse();
        })
        .always(() => {
          this.loading.trend = false;
        });
    },
    fetchTrendArea() {
      reportApi.areaTree().done(({ data }) => {
        this.areas = data || [];
      });
    },
    // 客流量趋势比较选择 省市区
    selectTrendAreaType(val) {
      this.curTrendAreaType = val;
      this.trendCompareRange = [{ value: '', id: '' }];
    },
    // 选择区域、店铺
    selectTrendType(index) {
      // 设置当前店铺
      this.curTrendType = index;
      if (this.curTrendType === 1) {
        this.setTemp('store', 'area');
        // 首次切换到区域，设置默认数据
        if (this.trendCompareRange.length === 0) {
          this.getDefaultArea(this.areas, this.level, 3).forEach(area => {
            // 用NA补全省市区
            for (let i = 0; i < 3 - this.level; i++) {
              area.id += '-NA';
            }
            this.trendCompareRange.push(area);
          });
        }
      } else {
        this.setTemp('area', 'store');
        this.options = this.stores.map(item => ({ value: item.value, id: item.id }));
      }
      this.validateCompare();
      // this.showEditor = true
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
        this.trendChartData = temp.trendChartData;
        this.trendTableData = temp.trendTableData;
        this.trendCompareRange = temp.trendCompareRange;
        this.confirmTrendCompareRange = temp.confirmTrendCompareRange;
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
    reload() {
      if (this.confirmTrendCompareRange[0].value) {
        this.validateCompare();
      }
    },
    toggleWarning() {
      this.showWarning = !this.showWarning;
    },
    getDefaultArea(list, level, count, startLevel = 1, idPath = '', namePath = '') {
      if (startLevel > level) {
        return [];
      }
      let result = [];
      if (startLevel === level) {
        // 到达指定级别
        for (let i = 0, len = list.length; i < len && i < count; i++) {
          const findedNode = list[i];
          result.push({
            id: `${idPath}-${findedNode.id}`.replace('-', ''),
            value: `${namePath}-${findedNode.name}`.replace('-', '')
          });
        }
      } else {
        for (const node of list) {
          if (node.childNode && node.childNode.length) {
            const temResult = this.getDefaultArea(
              node.childNode,
              level,
              count,
              startLevel + 1,
              `${idPath}-${node.id}`,
              `${namePath}-${node.name}`
            );
            result = result.concat(temResult);
            if (temResult.length === count || count <= 0) {
              return result;
            }
            count = count - temResult.length;
          }
        }
      }
      return result;
    }
  }
};
</script>
