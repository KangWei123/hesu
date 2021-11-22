import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';

function getTrack(data = [], links) {
  let option = {
    color: ['rgb(46, 141, 255)', 'rgb(46, 141, 255)', 'rgb(46, 141, 255)'],
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    animation: false,
    series: [
      {
        type: 'sankey',
        bottom: 80,
        focusNodeAdjacency: 'allEdges',
        data: data,
        links: links,
        orient: 'vertical',
        label: {
          position: 'top'
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        draggable: false,
        itemStyle: {
          normal: {
            borderWidth: 0
          }
        },
        lineStyle: {
          normal: {
            color: 'source',
            curveness: 0
          }
        }
      }
    ]
  };

  return option;
}

function getFunnel(data = []) {
  const blue = new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    {
      offset: 0,
      color: '#3CD1F1'
    },
    {
      offset: 1,
      color: '#4157FF'
    }
  ]);

  //取最大值
  let max = 0;
  data.forEach(item => {
    if (item.value > max) {
      max = item.value;
    }
  });

  let options = {
    color: blue,
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return (
          params.name + '：' + params.value + '人<br />转化率：' + filters.rate(filters.number(params.value / max))
        );
      }
    },
    series: [
      {
        name: '漏斗图',
        type: 'funnel',
        left: '20%',
        top: 20,
        bottom: 80,
        width: '60%',
        min: 0,
        max: max,
        minSize: '30%',
        maxSize: '100%',
        gap: 20,
        label: {
          show: true,
          position: 'inside',
          color: '#fff',
          formatter: '{b}'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        data: data
      }
    ]
  };

  return options;
}

function getBar(data = [], title, isSex = false) {
  //取最大值
  let sum = 0;
  data.forEach(item => {
    sum += item.value;
  });

  const blue = new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    {
      offset: 0,
      color: '#5BC1FF'
    },
    {
      offset: 1,
      color: '#2E8DFF'
    }
  ]);

  let yAxisData = [];
  let serieData = [];
  for (let item of data) {
    yAxisData.push(item.name);
    serieData.push(item.value);
  }

  for (let i = 0; i < 8; i++) {
    if (!yAxisData[i]) {
      yAxisData.push('');
    }
  }

  let option = {
    tooltip: {
      trigger: 'axis',
      formatter(params) {
        return params[0].name + '：' + filters.rate(filters.number(params[0].value / sum));
      },
      axisPointer: { type: 'none' }
    },
    grid: {
      left: 10,
      right: 50,
      top: 10,
      bottom: 10,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      inverse: true,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: 'shadow',
        type: 'bar',
        barMaxWidth: '12px' /*bar的最大宽度50px*/,
        itemStyle: {
          normal: {
            color: '#F2F4F7',
            barBorderRadius: 12
          }
        },
        tooltip: {
          show: false
        },
        silent: true,
        data: new Array(serieData.length).fill(sum)
      },
      {
        name: title,
        type: 'bar',
        barGap: '-100%',
        barMaxWidth: 12,
        itemStyle: {
          normal: {
            color: blue,
            barBorderRadius: 12
          }
        },
        label: {
          show: true,
          position: 'right',
          color: blue,
          fontSize: 14,
          offset: null,
          formatter(params) {
            return filters.rate(filters.number(params.value / sum));
          }
        },
        data: serieData
      }
    ]
  };
  return option;
}

export default {
  getTrack,
  getFunnel,
  getBar
};
