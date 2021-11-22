<template>
  <div class="trade-line-container"
       v-loading="loading">
    <el-card class="coupon-card">
      <div slot="header">
        <h3 class="card-title">拉动交易情况</h3>

        <div class="trade-info">
          <div class="name"
               style="color: #F98571">交易总额</div>
          <div class="count"
               style="color: #F98571">{{totalCount | price}}</div>
        </div>

        <div class="trade-info">
          <div class="name"
               style="color: #72D0F0">用券交易总额</div>
          <div class="count"
               style="color: #72D0F0">{{useCouponTotalCount | price}}</div>
        </div>

        <div class="trade-info">
          <div class="name">用券比例</div>
          <div class="count">{{useCouponPercent}}</div>
        </div>
      </div>

      <div style="width: 100%; height: 100%;">
        <chart :options="lineOptions"></chart>
      </div>
    </el-card>
  </div>
</template>

<script>
import './common.less';
import CouponApi from '@/dss-wechat3rd/src/api/couponApi.js';
import Chart from '@/dss-common/components/ChartEmpty.vue';
import DateTimeUtil from '@/dss-common/utils';
import MockData from './mockData.js';

export default {
  name: 'CouponTradeLine',

  components: {
    Chart
  },

  props: {
    couponId: {
      type: Number,
      default() {
        return 0;
      }
    },

    dateRange: {
      type: Array,
      default() {
        return [];
      }
    },

    // type 0 按天查询，1 按周， 2 按月
    type: {
      type: Number,
      default() {
        return 0;
      }
    }
  },

  data() {
    return {
      loading: false,
      data: [],
      lineOptions: null,
      totalCount: 1000,
      useCouponTotalCount: 100
    };
  },

  computed: {
    useCouponPercent() {
      if (!this.totalCount) {
        return 0;
      }
      return ((this.useCouponTotalCount * 100) / this.totalCount).toFixed(2) + '%';
    }
  },

  watch: {
    dateRange(newVal) {
      if (!!newVal && newVal.length > 0) {
        this.apiQueryTradeLine();
      }
    },

    type(newVal, oldVal) {
      // 这个值会为 0 / 1 / 2
      if (newVal !== oldVal) {
        this.apiQueryTradeLine();
      }
    }
  },

  methods: {
    apiQueryTradeLine() {
      this.loading = true;
      let params = {
        couponInfoId: this.couponId,
        appId: 296,
        startTime: this.dateRange[0],
        endTime: this.dateRange[1],
        type: this.type
      };
      CouponApi.queryTradeLine(params)
        .then(res => {
          console.log('apiQueryTradeLine --->', res);
          this.totalCount = res.data.totalCount;
          this.useCouponTotalCount = res.data.useCouponTotalCount;
          this.buildLineData(res.data.detail);
          this.lineOptions = this.getOptions();
        })
        .catch(err => {
          console.error('queryTradeLine, error --->', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    buildLineData(resDetail) {
      let detailList = resDetail || [];
      let actualFees = {
        xAxis: [],
        value: [],
        name: '交易额'
      };
      let payFees = {
        xAxis: [],
        value: [],
        name: '用券交易额'
      };

      detailList.forEach(item => {
        if (item.weekOrMonth) {
          if (this.type === 1) {
            actualFees.xAxis.push(item.weekOrMonth + '周');
            payFees.xAxis.push(item.weekOrMonth + '周');
          } else {
            actualFees.xAxis.push(item.weekOrMonth + '月');
            payFees.xAxis.push(item.weekOrMonth + '月');
          }
        } else {
          actualFees.xAxis.push(this.formatDate(item.tDate, 'MM/DD'));
          payFees.xAxis.push(this.formatDate(item.tDate, 'MM/DD'));
        }

        actualFees.value.push(this.price(item.actualFee));
        payFees.value.push(this.price(item.payFee));
      });

      this.data.length = 0;
      this.data.push(actualFees);
      this.data.push(payFees);
      // console.log('buildTradeLineData --------->', JSON.stringify(this.data));
    },

    getOptions() {
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          top: 20,
          left: '2%',
          right: '3%',
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            show: true,
            smooth: true,
            boundaryGap: false,
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
            data: null
          }
        ],
        yAxis: [
          {
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
                color: '#f2f2f2'
              }
            }
          }
        ],
        series: [
          {
            name: null,
            type: 'line',
            connectNulls: false,
            smooth: true,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#72D0F0'
              }
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
            data: null
          },
          {
            name: null,
            type: 'line',
            connectNulls: false,
            smooth: true,
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#F98571'
              }
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
            data: null
          }
        ]
      };

      if (this.data.length > 0) {
        option.xAxis[0].data = this.data[0].xAxis;
        this.data.forEach((item, index) => {
          // 该系列所有值均为null时，connectNulls设置为true,解决echarts报错
          if (!Math.max.apply(Math, item.value)) {
            option.series[index].connectNulls = true;
          } else {
            option.series[index].connectNulls = false;
          }

          option.series[index].data = item.value;
          option.series[index].name = item.name;

          // 仅有一天数据的时候显示Symbol
          if (option.xAxis[0].data.length < 2) {
            option.series[index].showSymbol = true;
          }
        });
      }
      // console.log('getOptions ----------->', JSON.stringify(option));

      return option;
    },

    formatDate(datetime, format) {
      if (!!datetime) {
        return DateTimeUtil.timeFormat(datetime, format);
      }
      return null;
    },

    price(value, scale = 100) {
      return value ? (value / scale).toFixed(2) : '0.00';
    }
  }
};
</script>

<style lang="less">
.trade-line-container {
  padding: 10px 20px;
}

.coupon-card {
  .trade-info {
    margin: 20px 50px 0 20px;
    max-width: 130px;
    display: inline-block;

    .name {
      font-size: 14px;
      font-weight: 300;
      font-family: DIN-Medium;
      line-height: 22px;
    }

    .count {
      margin-top: 15px;
      font-size: 22px;
      font-weight: 500;
      font-family: MicrosoftYaHei;
      line-height: 16px;
    }
  }
}
</style>
