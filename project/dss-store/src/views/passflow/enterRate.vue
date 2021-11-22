<template>
  <div class="main enter-rate-container">
    <div class="toolbar">
      <DateRange @pick="receiveDateRage" :maxDate="MAX_DATE">
        <el-select v-model="value" popper-class="date-select" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="btn" type="primary" @click="startQuery">筛选</el-button>
      </DateRange>
    </div>

    <div class="dss-card enter-rate-line" v-loading="loading">
      <card-title text="入店率" tip-name="enterRate">
      </card-title>
      <div class="customer-chart" style="margin-top:-40px">
        <div class="line-content">
          <!--fixme week和day结构暂时是一样的-->
          <template v-if="flag === 'day' || flag === 'week'">
            <place-holder v-if="!chartOptions" :height="380"></place-holder>
            <chart-empty :options="chartOptions" v-else height="100%"></chart-empty>
          </template>

          <!--fixme week和day结构暂时是一样的，如果结构变化了，可以用下面这种结构-->
          <!--<keep-alive>
            <template v-if="flag === 'week'">
              <place-holder v-if="!chartBarOptions"></place-holder>
              <chart-empty :options="chartBarOptions" v-else height="100%"></chart-empty>
            </template>
          </keep-alive>-->

        </div>
      </div>
    </div>
    <div class="dss-card detail-container" v-loading="loading">
      <card-title text="入店明细" tip-name="enterRateDetail" v-if="flag === 'week'">
        <template slot="right">
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             :class="{ disabled: !tableData.length }"
             @click="downloadExcel"
          ></i>
        </template>
      </card-title>
      <card-title text="入店明细" v-else-if="flag === 'day'">
        <template slot="right">
          <i title="导出Excel"
             class="key-icon key-icon-btn key-icon-download"
             :class="{ disabled: !tableData.length }"
             @click="downloadExcel"
          ></i>
        </template>
      </card-title>
      <div class="customer-chart">
        <div class="pie-content">
          <!--fixme week和day结构暂时是一样的-->
          <template v-if="flag === 'day' || flag === 'week'">
            <place-holder v-if="!tableData.length"></place-holder>
            <rate-table v-else :data="tableData"></rate-table>
          </template>
          <!--fixme week和day结构暂时是一样的，如果结构变化了，可以用下面这种结构-->
          <!--<template v-if="flag === 'week'">
            <place-holder v-if="!tableData.length"></place-holder>
            <rate-detail-week v-else :data="tableData"></rate-detail-week> &lt;!&ndash; 周入店明细 &ndash;&gt;
          </template>-->
        </div>
      </div>
    </div>
    <div class="dss-card enter-time-distribution">
      <!--<div class="distribution-label">进店次数分布</div>-->
      <card-title text="进店次数分布" tip-name="enterTimes" :customer-indicator="enterTimesIndicator"/>
      <el-row>
        <el-col :span="6">
          <div class="enter-container passenger-container">
            <div class="enter-time-num passenger-num">{{passenger}}</div>
            <div class="enter-time-label">路过人数</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="enter-container">
            <div class="enter-time-num">{{oneTwoCus}}</div>
            <div class="enter-time-label">1~2次进店</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="enter-container">
            <div class="enter-time-num">{{threeFiveCus}}</div>
            <div class="enter-time-label">3~5次进店</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="enter-container">
            <div class="enter-time-num">{{sixCus}}</div>
            <div class="enter-time-label">6次以上进店</div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>

</template>

<script>
  import './enter-rate/enter-rate.less';

  import utils from '@/dss-common/utils/index';
  import url from '@/dss-common/utils/url';
  import storeApi from '@/dss-common/api/store';
  import date from '@/dss-common/utils/date';

  import ChartEmpty from '@/dss-common/components/ChartEmpty';
  import DateRange from '@/dss-common/components/DateRange';

  import CardTitle from '../../components/card-title/index.vue';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';

  import RateTable from './enter-rate/enter-rate-table.vue';
  import RateDetailWeek from './enter-rate/enter-rate-week.vue';

  function formatDate(t) {
    return utils.timeFormat(t, 'YYYY-MM-DD');
  }

  export default {
    name: 'visit-time',
    components: { ChartEmpty, CardTitle, DateRange, RateTable, RateDetailWeek, PlaceHolder },
    data() {
      return {
        //t-1 数据，不需要今天
        MAX_DATE: date.getDateByDays(new Date(), -1),
        loading: false,
        dateRange: null,
        tableData: [],

        chartOptions: null,
        chartBarOptions: null,

        everSearch: false,

        value: 'day',
        flag: 'day',
        options: [
          {
            value: 'day',
            label: '天'
          },
          {
            value: 'week',
            label: '周'
          }
        ],
        enterTimes: {
          passenger: null,
          oneTwoCus: null,
          threeFiveCus: null,
          sixCus: null
        },
        enterTimesIndicator: {
          title: '进店次数分布',
          text: '以当前选中日期最后一天为基准的最近三十天的数据'
        }
      };
    },
    computed: {
      curStore() {
        return this.$store.state.curStore;
      },

      passenger() {
        return this.enterTimes && this.enterTimes.passenger ? utils.addSeparator(this.enterTimes.passenger) : 'N/A';
      },
      oneTwoCus() {
        return this.enterTimes && this.enterTimes.oneTwoCus ? utils.addSeparator(this.enterTimes.oneTwoCus) : 'N/A';
      },
      threeFiveCus() {
        return this.enterTimes && this.enterTimes.threeFiveCus ? utils.addSeparator(this.enterTimes.threeFiveCus) : 'N/A';
      },
      sixCus() {
        return this.enterTimes && this.enterTimes.sixCus ? utils.addSeparator(this.enterTimes.sixCus) : 'N/A';
      }
    },
    methods: {
      receiveDateRage(range) {
        this.dateRange = range;
        if (!this.everSearch) {
          this.everSearch = true;
          this.getEnterRate();
          this.getEnterTimes();
        }
      },
      startQuery() {
        this.flag = this.value;
        this.getEnterRate();
        this.getEnterTimes();
      },
      getEnterRate() {
        this.loading = true;
        const dateRange = this.dateRange;
        storeApi
          .getEnterRate(formatDate(dateRange[0]), formatDate(dateRange[1]), this.value)
          .then(result => {
            const { diagram, tables } = result.data || {};
            if (!tables || !tables.length) {
              this.tableData = [];
              this.chartOptions = null;
              this.chartBarOptions = null;
            } else {
              this.tableData = tables;
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

      getEnterTimes() {
        storeApi
          .getEnterTimes(formatDate(this.dateRange[1]))
          .done(res => {
            this.enterTimes = res.data;
          })
          .always(() => {});
      },

      getBarData(res) {
        let asisData = [], //辅助数据，颜色设置为透明
          minData = [],
          maxData = [],
          avgData = [];
        let series = res.series;

        for (let i in series) {
          asisData.push((series[i].minRate * 100).toFixed(3));
          minData.push(((series[i].avgRate - series[i].minRate) * 100).toFixed(3));
          maxData.push(((series[i].maxRate - series[i].avgRate) * 100).toFixed(3));
        }

        this.setBarOptions(res.xAxis, asisData, minData, maxData, avgData);
      },
      setBarOptions(xAixs, asisData, minData, maxData) {
        let option = {
          xAxis: {
            type: 'category',
            data: xAixs,
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
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 22,
              color: '#48586c'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              let avg = parseFloat(params[0].value) + parseFloat(params[1].value);
              let max = parseFloat(params[2].value) + avg;

              return (
                params[0].name +
                '<br/>最低入店率 : ' +
                parseFloat(params[0].value).toFixed(2) +
                '%<br/>' +
                '平均入店率 : ' +
                avg.toFixed(2) +
                '%<br/>最高入店率 : ' +
                max.toFixed(2) +
                '%'
              );
            }
          },
          grid: {
            top: 20,
            bottom: 20,
            left: '2%',
            right: '3%',
            containLabel: true
          },
          yAxis: {
            type: 'value',
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
              lineStyle: {
                color: '#f2f2f2'
              }
            }
          },
          boundaryGap: true,
          series: [
            {
              name: '辅助',
              type: 'bar',
              stack: '总量',
              itemStyle: {
                normal: {
                  barBorderColor: 'rgba(0,0,0,0)',
                  color: 'rgba(0,0,0,0)'
                }
              },
              data: asisData
            },
            {
              name: '最低入店',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  barBorderColor: '#246efc80',
                  color: '#246efc33'
                }
              },
              data: minData
            },
            {
              name: '最高入店',
              type: 'bar',
              stack: '总量',
              label: {
                normal: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  barBorderColor: '#246efc80',
                  color: '#246efc33'
                }
              },
              data: maxData
            }
          ]
        };

        this.chartBarOptions = option;
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
                  toolTips += `${item.seriesName}: ${item.value}%`;
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
        this.chartOptions = option;
      },
      // 下载表格
      downloadExcel() {
        if (this.dateRange) {
          window.open(
            url.makeUrl(storeApi.ENTER_RATE_API, {
              isDownload: true,
              startDate: formatDate(this.dateRange[0]),
              endDate: formatDate(this.dateRange[1]),
              datetype: this.value,
              dlFileName: `入店明细(${this.value === 'day' ? '天' : '周'})`
            })
          );
        }
      }
    }
};
</script>
