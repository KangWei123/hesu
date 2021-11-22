<template>
  <div :style="{height}"
       style="padding-top:20px;">
    <chart :options="options"></chart>
  </div>
</template>

<script>
import Chart from './Chart';
export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default: '300px'
    },
    color: {
      type: String,
      default: '#3399ff'
    },
    keyName: {
      type: String,
      default: 'storeName'
    },
    valName: {
      type: String,
      default: 'customer'
    },
    borderRadius: {
      type: String,
      default: '6'
    },
    hideBg: {
      type: Boolean,
      default: false
    },
    percent: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Chart
  },
  computed: {
    options() {
      let max = 0;
      const keys = [];
      const vals = [];
      const bgData = [];
      this.data
        .sort((prev, next) => {
          return prev[this.valName] > next[this.valName];
        })
        .forEach(item => {
          let val = item[this.valName];
          if (this.percent) {
            val = (val * 100).toFixed(1);
          }
          if (val > max) {
            max = val;
          }
          keys.push(item[this.keyName]);
          vals.push(val);
        });
      if (this.percent) {
        max = 100;
      } else {
        max += parseInt(max / 4);
      }
      for (let i = 0; i < keys.length; i++) {
        bgData.push(max);
      }
      const series = [
        {
          type: 'bar',
          stack: 'chart',
          z: 3,
          barMaxWidth: 12,
          itemStyle: {
            color: this.color,
            barBorderRadius: +this.borderRadius
          },
          label: {
            position: 'right',
            show: true,
            formatter: this.percent ? '{c}%' : '{c}'
          },
          data: vals
        }
      ];
      if (!this.hideBg) {
        series.push({
          type: 'bar',
          itemStyle: {
            color: '#f7f8fa',
            barBorderRadius: +this.borderRadius
          },
          barMaxWidth: 12,
          barGap: '-100%',
          data: bgData,
          animation: false,
          silent: true
        });
      }
      return {
        tooltip: {
          formatter: this.percent ? '{b}: {c}%' : '{b}: {c}'
        },
        grid: {
          top: 0,
          bottom: 40,
          right: 30,
          left: '1%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            max: this.hideBg && !this.percent ? null : max,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisLabel: {
              color: '#3B4757',
              formatter: this.percent ? '{value}%' : '{value}'
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'category',
            data: keys,
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#eaeaea'
              }
            },
            axisLabel: {
              color: '#3B4757'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series
      };
    }
  }
};
</script>
