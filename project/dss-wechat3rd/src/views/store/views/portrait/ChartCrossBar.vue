<template>
  <div :style="{height}">
    <chart :options="options"></chart>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart';
import markerBg from '../../asserts/images/marker-bg.png';

function numMulti(num1, num2) {
  let baseNum = 0;
  try {
    baseNum += num1.toString().split('.')[1].length;
  } catch (e) {}
  try {
    baseNum += num2.toString().split('.')[1].length;
  } catch (e) {}
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum);
}

export default {
  components: { Chart },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: String,
      default: '120px'
    },
    topColor: {
      type: String,
      default: ''
    },
    startColor: {
      type: String,
      default: '#4A80E8'
    },
    endColor: {
      type: String,
      default: '#81B6F5'
    },
    bgColor: {
      type: String,
      default: '#EFF2F5'
    },
    maxRate: {
      type: Number,
      default: 1.3
    },
    hasAvg: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 100
    }
  },
  computed: {
    options() {
      let max = 0;
      let rates = [];
      let points = [];
      const markerSymbol = `image://${markerBg}`;
      const data = this.data.map((item, index) => {
        const value = item.portraitRate;
        const avg = item.fieldAverage;
        max = Math.max(value, max);
        rates.push(value);

        if (this.hasAvg && item.fieldAverage) {
          max = Math.max(avg, max);
          points.push({
            xAxis: avg,
            yAxis: index,
            value: numMulti(avg, this.scale) + '%',
            symbol: markerSymbol,
            symbolSize: [46, 33],
            symbolOffset: [0, -10],
            label: {
              color: '#fff',
              offset: [0, -10]
            }
          });
        }

        return item.portraitRate;
      });
      const shadowData = this.data.map(() => {
        return { value: max * this.maxRate };
      });
      const keys = this.data.map(item => {
        return item.portraitName;
      });

      const barSeries = {
        name: 'data',
        type: 'bar',
        barWidth: 14,
        itemStyle: {
          barBorderRadius: 15,
          color: e => {
            const color = {
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: this.startColor // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: this.endColor // 100% 处的颜色
                }
              ]
            };
            return e.dataIndex === 0 && this.topColor ? this.topColor : color;
          }
        },
        label: {
          normal: {
            show: true,
            position: this.maxRate === 1 ? 'insideRight' : 'right',
            fontSize: 14,
            color: this.maxRate === 1 ? '#fff' : this.startColor,
            formatter: c => {
              const value = rates[c.dataIndex] * this.scale;
              if (this.maxRate === 1) {
                if (c.dataIndex === 0 || value > 30) {
                  return value.toFixed(1);
                }
                return '';
              }
              return value.toFixed(1) + '%';
            }
          }
        },
        data: data
      };

      if (this.hasAvg) {
        barSeries.markPoint = {
          z: 21,
          data: points
        };
      }

      const series = [
        {
          name: 'shadow',
          type: 'bar',
          barGap: '-100%',
          animation: false,
          silent: true,
          barWidth: 14,
          itemStyle: {
            color: this.bgColor,
            barBorderRadius: 15
          },
          data: shadowData
        },
        barSeries
      ];

      if (this.maxRate === 1) {
        series.push({
          name: 'label',
          type: 'bar',
          barGap: '-100%',
          animation: false,
          silent: true,
          barWidth: 14,
          itemStyle: {
            color: 'rgba(255, 0, 0, 0)'
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              fontSize: 14,
              distance: 10,
              color: this.startColor,
              formatter: (c) => {
                const value = rates[c.dataIndex] * this.scale;
                if (c.dataIndex === 0 || value > 30) {
                  return '';
                }
                return value.toFixed(1);
              }
            }
          },
          z: 11,
          data: data
        });
      }

      return {
        grid: {
          left: 6,
          right: 0,
          top: 5,
          bottom: 5,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          min: 0,
          max: max * this.maxRate,
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          splitLine: { show: false }
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: keys,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { margin: 10, color: '#566980', fontSize: 14 }
        },
        series: series
      };
    }
  }
};
</script>

