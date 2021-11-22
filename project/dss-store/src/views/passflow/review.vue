<template>
  <div class="main">
    <DateRange @pick="receiveDateRage" :maxDate="MAX_DATE"/>
    <div class="customer-container" v-loading="loading">
      <card-title text="新老用户分布和趋势" tip-name="newOldCustomerDistTrend">
      </card-title>
      <div class="customer-chart">
        <!--新老用户－饼图-->
        <div class="pie-content">
          <place-holder v-if="!pieOptions"></place-holder>
          <chart :options="pieOptions" width="160px" height="160px" v-if="!!pieOptions"></chart>
          <div class="portrait_chart_bottom" v-if="!!pieOptions">
            <div>
              <span class="data">{{oldRateStr}}</span>
              <span class="data">{{newRateStr}}</span>
            </div>
            <div>
              <span class="old">老客户</span>
              <span class="new">新客户</span>
            </div>
          </div>
        </div>
        <!--客流量-线性图-->
        <div class="line-content">
          <place-holder v-if="!tableData.length"></place-holder>
          <chart :options="lineOptions" height="100%" v-else></chart>
        </div>
      </div>
    </div>
    <!--新老用户明细-->
    <div class="detail-container">
      <card-title text="新老用户明细" tip-name="newOldCustomerDetail">
        <template slot="right">
          <i title="导出Excel" class="key-icon key-icon-btn key-icon-download" :class="{ disabled: !tableData.length }"
             @click="downloadExcel"></i>
        </template>
      </card-title>
      <div class="customer-chart">
        <div class="pie-content">
          <place-holder v-if="!tableData.length"></place-holder>
          <detail-table :data="tableData" v-if="tableData.length"></detail-table>
        </div>
      </div>
    </div>
    <!--客户回访周期-->
    <!-- rvisit-cycle :curStore="curStore" :dateRange="dateRange"/ -->

  </div>
</template>

<script>
  import reviewLess from './review/review.less';

  import utils from '@/dss-common/utils/index';
  import url from '@/dss-common/utils/url';
  import storeApi from '@/dss-common/api/store';
  import date from '@/dss-common/utils/date';

  import Chart from '@/dss-common/components/ChartEmpty';
  import DateRange from '@/dss-common/components/DateRange';

  import DetailTable from './review/detail-table.vue';
  import RvisitCycle from './review/rvisit-cycle.vue';

  import CardTitle from '../../components/card-title/index';
  import PlaceHolder from '@/dss-common/components/placeholder/index';

  const OLD_RATE = 'oldRate';
  const NEW_RATE = 'newRate';

  const keyDate = 'tdate';
  const keyNewCustomer = 'newCustomer';
  const keyOldCustomer = 'oldCustomer';

  function formatDate(t){
    return utils.timeFormat(t, 'YYYY-MM-DD');
  }

  export default {
    name: 'passflow-review',
    components: {Chart, CardTitle, DetailTable, RvisitCycle, PlaceHolder, DateRange},
    data() {
      return {
        //t-1 数据，不需要今天
        MAX_DATE : date.getDateByDays(new Date(), -1),
        loading: false,
        // 日期选择
        dateRange: null,

        pieOptions: null,//新老用户－饼图数据
        oldRateStr: '',
        newRateStr: '',

        lineOptions: null,//客流量-线性图数据
        tableData: [],
        value: 'day',//
        options: [{
          value: 'day',
          label: '天'
        }]
      }
    },
    computed: {
      curStore() {
        return this.$store.state.curStore
      }
    },
    methods: {
      receiveDateRage(range){
        this.dateRange = range;
        this.api();
      },
      /**
       * 下载excel
       */
      downloadExcel() {
        window.open(url.makeUrl(storeApi.customerDetail, {
          startDate: formatDate(this.dateRange[0]),
          endDate: formatDate(this.dateRange[1]),
          type: this.value,
          isDownload: true,
          dlFileName: '新老用户明细'
        }));
      },
      api() {
        this.loading = true;
        Promise.all([
          this.apiCustomerOverview(),
          this.apiCustomerDetail()
        ]).always(()=>{
          this.loading =false;
        })
      },
      getPieOptions(data) {
        return {
          series: [{
            name: '新老用户占比',
            hoverAnimation: false,
            type: 'pie',
            center: ["50%", "50%"],
            radius: ['65%', '100%'],
            avoidLabelOverlap: false,
            label: {normal: {show: false}},
            labelLine: {normal: {show: false}},
            data: [{
              value: data[0][OLD_RATE],
              name: '老客户',
              itemStyle: {
                normal: {
                  color: "#F3712A",
                  borderColor: "#fff",
                  borderWidth: "5"
                }
              }
            }, {
              value: data[0][NEW_RATE],
              name: '新客户',
              itemStyle: {
                normal: {
                  color: "#2A75FC",
                  borderColor: "#fff",
                  borderWidth: "5"
                }
              }
            }]
          }]
        };
      },

      /**
       *新老用户概览
       */
      apiCustomerOverview() {
        return storeApi.getCustomerOverview(
          formatDate(this.dateRange[0]),
          formatDate(this.dateRange[1]),
          this.value
        )
          .then(result => {
            const data = result.data;
            const handler = function(rate){
              return (rate * 100).toFixed(2) + '%';
            };
            this.pieOptions = (!data[0][OLD_RATE] && !data[0][NEW_RATE]) ? null : this.getPieOptions(data);
            this.oldRateStr = !!this.pieOptions ? handler(data[0][OLD_RATE]) : '-';
            this.newRateStr = !!this.pieOptions ? handler(data[0][NEW_RATE]) : '-';
          });
      },

      /**
       * 新老用户明细
       */
      apiCustomerDetail() {
        return storeApi.getCustomerDetail(
          formatDate(this.dateRange[0]),
          formatDate(this.dateRange[1]),
          this.value
        )
          .then(result => {
            const data = result.data;
            this.tableData = (!!data && !!data.length) ? data : [] ;
            this.lineOptions = this.tableData.length > 0 ? this.getLineOptions(data) : null;
          });
      },

      getLineOptions(res2) {
      	const res = res2.slice();
        res.reverse();
        let xAxis = [], dataNew = [], dataOld = [];
        for (let i in res) {
          xAxis.push(res[i][keyDate]);
          dataNew.push(res[i][keyNewCustomer]);
          dataOld.push(res[i][keyOldCustomer]);
        }

        return {
          tooltip: {
            trigger: 'axis'
          },
          title: {
            text: '{value|客}\n{value|流}\n{value|量}',
            textStyle: {
              fontSize: 12,
              rich: {
                value: {
                  color: '#6f6f6f',
                  lineHeight: 24,
                  fontSize: 12,
                  fontWeight: 600
                }
              }
            }
            ,top: '25%'
          },
          grid: {
            top: 10,
            bottom: 20,
            left: '4%',
            right: '0%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            smooth: true,
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 12,
              align:'right',
              color: '#4a4a4a',
              formatter(value) {
                return value.substring(5)
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
          }],
          yAxis: [{
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#f2f2f2'
              }
            },
            axisLabel: {
              margin: 22,
              color: '#4a4a4a'
            },
            axisTick: {
              length: 8
            },
            splitLine: {
              lineStyle: {
                color: '#f2f2f2',
              }
            },
          }],
          series: [
            {
              name: '新客户',
              type: 'line',
              smooth: true,
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#2A75FC'
                }
              },
              data: dataNew
            },
            {
              name: '老客户',
              type: 'line',
              smooth: true,
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#F3712A'
                }
              },
              data: dataOld
            }
          ]
        };
      }
    }
  }
</script>
