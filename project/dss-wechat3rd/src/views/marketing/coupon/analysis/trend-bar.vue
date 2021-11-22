<template>
  <div class="trend-bar-container">
    <el-card class="coupon-card">
      <div slot="header">
        <h3 class="card-title">领取趋势</h3>
      </div>
      <div class="cart-content">
        <chart-empty :options="chartOptions"
                     height="100%"></chart-empty>
      </div>

    </el-card>
  </div>
</template>

<script>
import ChartEmpty from '@/dss-common/components/ChartEmpty';
import date from '@/dss-common/utils/date';
import CouponApi from '@/dss-wechat3rd/src/api/couponApi.js';
export default {
  components: {
    ChartEmpty
  },
  props: {
    couponId: {
      type: Number,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    },
    dateRange: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      chartOptions: null,
      loading: false
    };
  },

  watch: {
    type: {
      deep: true,
      handler() {
        this.geTrend();
      }
    },
    dateRange: {
      deep: true,
      handler() {
        this.geTrend();
      }
    }
  },

  mounted() {},

  methods: {
    getData(data) {
      let useList = [];
      let relist = [];
      let xAxis = [];
      data.forEach(item => {
        relist.push(item.receiveCount);
        useList.push(item.useCount);
        if (item.weekOrMonth) {
          if (this.type === 1) {
            xAxis.push(item.weekOrMonth + '周');
          } else {
            xAxis.push(item.weekOrMonth + '月');
          }
        } else {
          xAxis.push(date.format(new Date(item.tDate), 'MM/DD'));
        }
      });
      this.chartOptions = this.setChartOptions(relist, useList, xAxis);
    },
    geTrend() {
      this.loading = true;
      let queryParams = {
        type: this.type,
        couponInfoId: this.couponId,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      };
      CouponApi.queryTrendBar(queryParams)
        .then(rs => {
          this.getData(rs.data || []);
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loading = false;
        });
    },
    /*
     * @param {Array} passengerList 已领取
     * @param {Array} customerList 使用
     * @param {Array} xAxis x轴参数
     * */
    setChartOptions(passengerList, customerList, xAxis) {
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            let toolTips = `${params[0].name}<br/>`;
            params.forEach(item => {
              toolTips += item.marker; //marker：每一列的指示器

              toolTips += `${item.seriesName}: ${item.value}<br/>`;
            });

            return toolTips;
          }
        },
        grid: {
          top: 50,
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
              name: '已使用', //legend text
              icon: 'circle' //legend icon
            },
            {
              name: '已领取',
              icon: 'circle'
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
              color: '#4a4a4a'
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
            name: '已使用',
            type: 'bar',
            barWidth: '30%',
            barMaxWidth: 20,
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
            name: '已领取',
            type: 'bar',
            barGap: '-100%',
            barWidth: '30%',
            barMaxWidth: 20,
            itemStyle: {
              normal: {
                color: '#9CE8CF',
                barBorderRadius: [20, 20, 0, 0]
              }
            },
            data: passengerList
          }
        ]
      };
      return option;
    }
  }
};
</script>

<style lang="less">
.trend-bar-container {
  padding: 10px 10px 10px 20px;
}
.cart-content {
  height: 300px;
}
</style>
