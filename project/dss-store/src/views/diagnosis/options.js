export default {
  radar(config) {
    const option = {

      tooltip: {},
      radar: {
        // shape: 'circle',
        radius: '60%',
        name: {
          textStyle: {
            color: '#3B4757',
            fontSize: 16,
            padding: [3, 5]
          }
        },
        indicator: config.indicator,
        axisLine: {
          lineStyle: {
            color: '#3499FE',
            type: 'dashed',
            width: 1
          }
        },
        splitLine: {
          lineStyle: {
            color: '#3499FE',
            type: ['dashed'],
            width: 0.5
          }
        },
        splitArea: {
          show: false
        }
      },
      series: [{
        name: '客流诊断指标',
        type: 'radar',
        symbolSize: 0,
        // areaStyle: {normal: {}},
        itemStyle: {
          normal: {
            areaStyle: {
              type: 'default',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: -0.2,
                colorStops: [{
                  offset: 1, color: '#5DFFFF' // 0% 处的颜色
                }, {
                  offset: 0, color: '#3499FE' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
              }
            },
            lineStyle: {
              width: 0
            }
          }
        },
        data: [
          {
            value: config.data,
            name: '客流诊断指标'
          }
        ]
      }]
    };
    return option;
  },
  line(config) {
    let option = {
      color: ['#3499FE', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '45',
        right: '47',
        bottom: '24',
        top: '22',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        boundaryGap: false,
        data: config.xAxisData,
        axisLine: {
          show: false,
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.15)'
          }
        },
        axisLabel: {
          color: '#3B4757',
          fontSize: 14,
          margin: 15
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.15)'
          }
        }
      }],
      yAxis: [{
        show: config.data.length > 0,
        splitNumber: 5,
        type: 'value',
        max: 100,
        axisLine: {
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.15)'
          }
        },
        axisLabel: {
          color: '#3B4757',
          fontSize: 14,
          margin: 15
        },
      }],
      series: [{
        name: config.title,
        type: 'line',
        symbolSize: 0,
        smooth: true,
        lineStyle: {
          width: 3
        },
        data: config.data
      }]
    };
    return option;
  }
}
