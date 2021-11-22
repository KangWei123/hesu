<template>
  <div class="enter-rate-line" v-loading="loading">
    <card-title text="入店率" tip-name="enterRate">
      <template slot="right">
        <i
          :title="enterViewType === 'chart' ? '表格视图' : '趋势视图'"
          class="key-icon key-icon-btn"
          :class="{
            'key-icon-table': enterViewType === 'chart',
            'key-icon-trend': enterViewType === 'table',
            disabled: !enterTableData || !enterChartData
          }"
          @click="toggleView('enterViewType')"
        >
        </i>
        <i
          title="导出Excel"
          class="key-icon key-icon-btn key-icon-download"
          :class="{ disabled: !enterTableData || !enterChartData }"
          @click="downloadData"
        >
        </i>
      </template>
    </card-title>
    <div class="customer-chart" v-if="enterViewType === 'chart'">
      <div class="line-content">
        <!--fixme week和day结构暂时是一样的-->
        <template v-if="flag === 'day' || flag === 'week'">
          <place-holder v-if="!enterChartData" :height="380" />
          <chart-empty :options="enterChartData" v-else height="100%" />
        </template>
      </div>
    </div>
    <template v-else-if="enterViewType === 'table'">
      <enter-rate-table :data="enterTableData" v-if="enterTableData" />
    </template>
  </div>
</template>

<script>
import CardTitle from '../../../components/card-title/index.vue';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import ChartEmpty from '@/dss-common/components/ChartEmpty';
import EnterRateTable from '../../passflow/enter-rate/enter-rate-table';
import newCameraFlowApi from '../../../api/camera-flow.js';
import url from '@/dss-common/utils/url';
export default {
  name: 'enter-rate',
  components: {
    CardTitle,
    PlaceHolder,
    ChartEmpty,
    EnterRateTable
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
          this.getEnterRate();
        }
      }
    }
  },
  data() {
    return {
      enterChartData: null,
      enterTableData: null,
      flag: 'day',
      value: 'day',
      enterViewType: 'chart',
      loading: false
    };
  },
  // mounted() {
  //   this.getEnterRate();
  // },
  methods: {
    getEnterRate() {
      this.loading = true;
      const params = {
        startDate: this.dateSection.startDate,
        endDate: this.dateSection.endDate,
        datetype: 'day',
        deviceType: 2
      };

      newCameraFlowApi
        .getEnterRate(params)
        .then(result => {
          const { diagram, tables } = result.data || {};
          if (!tables || !tables.length) {
            this.enterTableData = [];
            this.enterChartData = null;
          } else {
            this.enterTableData = tables;
            //fixme 周和日的结构一样的时候，用这种方式。暂时的需求是周和日的结构是一样的。
            this.getChartData(diagram);
            //fixme 周和日的结构不一样的时候用下面这种方式。需求可能会改回来，暂时不删除代码
            /*if (this.value === 'day') {
              this.getChartData(diagram);
            } else {
              this.getBarData(diagram);
            }*/
          }
        })
        .always(() => {
          this.loading = false;
        });
    },
    getChartData(res) {
      const xAxis = res.xAxis;
      const rateList = [];
      const passengerList = [];
      const customerList = [];

      res.series.forEach(item => {
        rateList.push((item.enterRate.replace('%', '') - 0).toFixed(2));
        passengerList.push(item.passenger);
        customerList.push(item.customer);
      });

      this.setChartOptions({ rateList, passengerList, customerList, xAxis });
    },
    setChartOptions({ rateList, passengerList, customerList, xAxis }) {
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let toolTips = `${params[0].name}<br/>`;
            params.forEach(item => {
              toolTips += item.marker; //marker：每一列的指示器
              if (item.seriesName === '入店率') {
                if (item.value === 'NaN') {
                  toolTips += `${item.seriesName}: -`;
                } else {
                  toolTips += `${item.seriesName}: ${item.value}%`;
                }
              } else {
                toolTips += `${item.seriesName}: ${item.value}<br/>`;
              }
            });

            return toolTips;
          }
        },
        grid: {
          top: 64,
          left: '2%',
          right: '3%',
          bottom: 10,
          containLabel: true
        },
        legend: {
          right: 56,
          itemGap: 26,
          data: [
            {
              name: '进店人数', //legend text
              icon: 'circle' //legend icon
            },
            {
              name: '路过人数',
              icon: 'circle'
            },
            {
              name: '入店率',
              icon: 'line'
            }
          ]
        },
        xAxis: [
          {
            type: 'category',
            smooth: true,
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 12,
              color: '#4a4a4a',
              formatter(value) {
                return value.substring(5);
              }
            },
            axisTick: {
              show: false
            },
            axisPointer: {
              show: true,
              lineStyle: {
                color: '#2b76fd',
                type: 'dashed',
                width: 1,
                opacity: 0.6
              }
            },
            data: xAxis
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 22,
              color: '#4a4a4a',
              formatter: '{value}'
            },
            axisTick: {
              length: 8
            },
            splitLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          },
          {
            type: 'value',
            position: 'right',
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 22,
              color: '#4a4a4a',
              formatter: '{value} %'
            },
            axisTick: {
              length: 8
            },
            splitLine: {
              show: false,
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          }
        ],
        animationDurationUpdate: 600,
        series: [
          {
            name: '进店人数',
            type: 'bar',
            barWidth: '30%',
            barMaxWidth: 40,
            z: 10,
            itemStyle: {
              normal: {
                color: '#3499FE',
                barBorderRadius: [20, 20, 0, 0]
              }
            },
            data: customerList
          },
          {
            silent: true,
            name: '路过人数',
            type: 'bar',
            barGap: '-100%',
            barWidth: '30%',
            barMaxWidth: 40,
            itemStyle: {
              normal: {
                color: '#9CE8CF',
                barBorderRadius: [20, 20, 0, 0]
              }
            },
            data: passengerList
          },
          {
            name: '入店率',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#FF6F3A'
              }
            },
            z: 20,
            lineStyle: {
              width: 3
            },
            areaStyle: {
              normal: {
                color: {
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(57, 123, 241, 0.04)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(57, 123, 241, 0.04)' // 100% 处的颜色
                    }
                  ]
                }
              }
            },
            data: rateList
          }
        ]
      };
      this.enterChartData = option;
    },
    toggleView(moduleName) {
      this[moduleName] = this[moduleName] === 'chart' ? 'table' : 'chart';
    },
    downloadData() {
      if (this.dateSection) {
        window.open(
          url.makeUrl(newCameraFlowApi.ENTER_RATE_API, {
            isDownload: true,
            startDate: this.dateSection.startDate,
            endDate: this.dateSection.endDate,
            datetype: this.value,
            deviceType: this.deviceType,
            dlFileName: `入店明细(${this.value === 'day' ? '天' : '周'})`
          })
        );
      }
    }
  }
};
</script>

<style lang="less" scoped>
.enter-rate-line {
  background: #fff;

  .card-title {
    //padding: 17px 30px 0px;
  }
  .customer-chart {
    overflow: hidden;
    //padding: 17px 30px;
  }

  .line-content {
    width: 100%;
    height: 380px;
    float: left;
  }
}
</style>
