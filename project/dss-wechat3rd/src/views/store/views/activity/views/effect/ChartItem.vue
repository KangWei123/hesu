<template>
  <div style="width: 100%; height: 100%;">
    <chart :options="lineOptions"></chart>
  </div>
</template>

<script>
  import td from 'throttle-debounce';
  import Chart from '@/dss-common/components/ChartEmpty';

  export default {
    name: 'CustomerLine',
    components: {
      Chart
    },
    props: {
      data: Array
    },
    data() {
      return {
        lineOptions: null
      };
    },

    watch: {
      data: {
        deep: true,
        immediate: true,
        handler(val, oldVal) {
          if (this.data) {
            this.render();
          }
        }
      }
    },
    methods: {
      getOptions() {
        let option = {
          tooltip: {
            trigger: 'axis',
            borderWidth: 0,
            padding: [8, 16, 8, 16],
            extraCssText: 'border-color: transparent;'
          },
          grid: {
            top: 60,
            bottom: 50,
            left: 30,
            right: 30,
            containLabel: true
          },
          legend: {
            data: ['活动之前', '活动期间'],
            right: 30,
            top: -3,
            icon: 'circle',
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 28
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
              connectNulls: false,
              smooth: true,
              showSymbol: false,
              itemStyle: {
                normal: {
                  color: '#fc6042'
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
                        color: 'rgba(255, 159, 128, 0.04)' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(255, 159, 128, 0.04)' // 100% 处的颜色
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
                  color: '#5B76F7'
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
                        color: 'rgba(91, 118, 247, 0.04)' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(91, 118, 247, 0.04)' // 100% 处的颜色
                      }
                    ]
                  }
                }
              },
              data: null
            }
          ]
        };

        // option.xAxis[0].data = this.data[0].xAxis;
        // option.series[0].data = this.data[0].value;
        // option.series[0].name = this.data[0].name;

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

        return option;
      },
      render() {
        this.lineOptions = this.getOptions();
      }
    }
  };
</script>
