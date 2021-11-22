<template>
  <chart :options="options"></chart>
</template>

<script>
import Chart from './Chart';

export default {
  components: { Chart },
  props: {
    type: String,
    data: Array
  },
  computed: {
    options() {
      let option = {
        tooltip: {
          trigger: 'axis',
          formatter(params) {
            let res = params[0].axisValueLabel + '';
            for (let i = 0, l = params.length; i < l; i++) {
              res +=
                '<br/>' +
                  params[i].marker +
                  params[i].name +
                  '  客流: ' +
                  params[i].value +
                  '  客户：' +
                  params[i].data.customer || 0;
            }
            return res;
          }
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
            smooth: true,
            boundaryGap: false,
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
            smooth: true,
            connectNulls: false, // 连接空值
            showSymbol: true,
            itemStyle: {
              normal: {
                color: '#246efc'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(57, 123, 241, 0.04)'
              }
            },
            data: null
          },
          {
            name: null,
            type: 'line',
            smooth: true,
            showSymbol: true,
            connectNulls: false,
            itemStyle: {
              normal: {
                color: '#43cb83'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(57, 123, 241, 0.04)'
              }
            },
            data: null
          },
          {
            name: null,
            type: 'line',
            smooth: true,
            connectNulls: false,
            showSymbol: true,
            itemStyle: {
              normal: {
                color: '#b95ced'
              }
            },
            areaStyle: {
              normal: {
                color: 'rgba(185, 92, 237, 0.04)'
              }
            },
            data: null
          }
        ]
      };

      // option.xAxis[0].data = this.data[0].xAxis;
      option.series[0].data = null;
      option.series[1].data = null;
      option.series[2].data = null;
      // option.series[0].name = this.data[0].name;

      if (!this.data.length) {
        return;
      }

      option.xAxis[0].data = this.data[0].xAxis;

      if (this.type === 'store') {
        this.data.forEach((item, index) => {
          option.series[index].name = item.store;

          // 该系列所有值均为null时，connectNulls设置为true,解决echarts报错
          let data = item.series.map(vdata => vdata.passenger);
          if (!Math.max.apply(Math, data)) {
            option.series[index].connectNulls = true;
          } else {
            option.series[index].connectNulls = false;
          }
          option.series[index].data = item.series.map(val => ({
            value: val.passenger === null ? '-' : val.passenger,
            name: val.storeName,
            customer: val.customer
          }));

          // 仅有一天数据的时候显示Symbol
          if (option.xAxis[0].data.length < 2) {
            option.series[index].showSymbol = true;
          }
        });
      } else if (this.type === 'customer') {
        this.data.forEach((item, index) => {
          option.series[index].name = item.store;

          // 该系列所有值均为null时，connectNulls设置为true,解决echarts报错
          let data = item.series.map(vdata => vdata.passenger);
          if (!Math.max.apply(Math, data)) {
            option.series[index].connectNulls = true;
          } else {
            option.series[index].connectNulls = false;
          }

          option.series[index].data = item.series.map(val => ({
            value: val.passenger === null ? '-' : val.passenger,
            name: val.area,
            customer: val.customer
          }));

          // 仅有一天数据的时候显示Symbol
          if (option.xAxis[0].data.length < 2) {
            option.series[index].showSymbol = true;
          }
        });
      }

      return option;
    }
  }
};
</script>
