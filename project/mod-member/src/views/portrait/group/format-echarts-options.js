/**
 * 格式化为标准的 echarts3 图表 options
 */
'use strict';

import echarts from 'echarts';
// echarts3 支持的动画效果列表
const easingList = [
  'linear',
  'quadraticIn',
  'quadraticOut',
  'quadraticInOut',
  'cubicIn',
  'cubicOut',
  'cubicInOut',
  'quarticIn',
  'quarticOut',
  'quarticInOut',
  'quinticIn',
  'quinticOut',
  'quinticInOut',
  'sinusoidalIn',
  'sinusoidalOut',
  'sinusoidalInOut',
  'exponentialIn',
  'exponentialOut',
  'exponentialInOut',
  'circularIn',
  'circularOut',
  'circularInOut',
  'elasticIn',
  'elasticOut',
  'elasticInOut',
  'backIn',
  'backOut',
  'backInOut',
  'bounceIn',
  'bounceOut',
  'bounceInOut',
];

const formatEchartsOptions = {
  /**
   * 柱状图
   */
  getBar: function (dataInfo) {
    const linear = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: '#f89cb8' },
      { offset: 0.6, color: '#f9a5ab' },
      { offset: 1, color: '#f8b8a3' },
    ]);

    const options = {
      color: ['#26afdc'],
      tooltip: {
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: '#ccc',
            opacity: 0.2,
          },
        },
        backgroundColor: 'rgba(57,56,87,0.75)',
        borderColor: '#393857',
        borderWidth: 1,
        padding: 10,
        z: 8888,
        // textStyle: {
        //     width: 100,
        //     color: '#ff0000'
        // },
        formatter(item) {
          const name = item.name;
          const rate = item.data.rate;

          const valuesFormatter = [];
          let htmlStr =
            '<div style="max-width: 200px; white-space: normal; word-break:break-all; line-height: 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,.5); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px">' +
            name +
            '</div>';

          htmlStr = htmlStr + '覆盖率：' + rate + '%<br/>';

          valuesFormatter.push(htmlStr);

          return valuesFormatter;
        },
      },
      grid: {
        left: '3%',
        right: '2%',
        bottom: '2%',
        top: 20,
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#dddfe0',
            },
          },
          nameTextStyle: {
            color: '#eee',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: '#dddfe0',
            },
          },
        },
      ],
      series: [
        {
          name: dataInfo.name,
          type: 'bar',
          barWidth: 12,
          data: [],
          label: {
            normal: {
              show: false,
              position: 'bottom',
              formatter: '',
              textStyle: {
                color: '#aaa',
              },
            },
          },
          itemStyle: {
            normal: {
              barBorderRadius: 100,
              color: linear,
            },
          },
        },
      ],
    };

    dataInfo.data.map(item => {
      options.xAxis[0].data.push(item.name);

      options.series[0].data.push({
        name: item.name || '其他-',
        value: item.rate,
        rate: item.rate,
        count: item.count,
      });
    });
    return options;
  },
};

export default formatEchartsOptions;
