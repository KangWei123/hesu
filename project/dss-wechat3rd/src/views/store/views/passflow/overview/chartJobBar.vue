<template>
  <div :style="{height}">
    <chart :options="options"></chart>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart';
export default {
  components: {
    Chart
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default: '180px'
    },
    mColor: {
      type: String,
      default: '#3499FE'
    },
    bgColor: {
      type: String,
      default: '#eff3f6'
    },
    keyName: {
      type: String,
      default: 'portraitName'
    },
    valName: {
      type: String,
      default: 'portraitRate'
    }
  },
  computed: {
    options() {
      var dataAxis = [];
      var data = [];

      this.data.forEach(item => {
        dataAxis.push(item[this.keyName]);
        data.push((item[this.valName] * 100).toFixed(1));
      });

      return {
        grid: {
          top: 20,
          bottom: 0,
          right: 0,
          left: 0,
          containLabel: true
        },
        tooltip: {
          formatter: '{c}%<br/>{b}',
          padding: [5, 20]
        },
        xAxis: {
          data: dataAxis,
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            color: '#2e3b4b'
          },
          axisLine: {
            lineStyle: {
              color: '#eaeaea'
            }
          }
        },
        yAxis: {
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            itemStyle: {
              color: this.mColor,
              barBorderRadius: [30, 30, 0, 0]
            },
            type: 'bar',
            barWidth: '30px',
            data: data,
            z: 10,
            label: {
              position: 'top',
              show: true,
              formatter: '{c}%',
              color: 'rgba(59,71,87,1)',
              fontFamily: 'PingFangSC-Regular',
              fontSize: '12px'
            }
          }
        ]
      };
    }
  }
};
</script>

