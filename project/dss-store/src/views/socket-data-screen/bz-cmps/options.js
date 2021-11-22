import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';

function getRadar(title, data = [], indicator = [], legend = []) {
  let options1 = {
    radar: {
      indicator: indicator,
      startAngle: 60,
      nameGap: 10,
      center: ['50%', '50%'],
      radius: '65%',
      axisLine: {
        show: false
      },
      splitLine: {
        lineStyle: {
          color: '#606266'
        }
      },
      splitArea: {
        areaStyle: {
          color: 'rgba(0,0,0,0)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        itemStyle: {
          color: '#FFFFFF'
        },
        lineStyle: {
          color: '#25B5FF'
        },
        areaStyle: {
          opacity: 0.8,
          color: {
            type: 'linear',
            x: 0,
            y: 0.2,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#4157FF' // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#3CD1F1' // 100% 处的颜色
              }
            ]
          }
        },
        data: [
          {
            name: title,
            value: data
          }
        ]
      }
    ]
  };

  // 用户价值雷达图
  const colors = [
    {
      type: 'linear',
      x: 0,
      y: 0.2,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#4157FF' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#3CD1F1' // 100% 处的颜色
        }
      ]
    },
    {
      type: 'linear',
      x: 0,
      y: 0.2,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#FF6E41' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#A82E3C' // 100% 处的颜色
        }
      ]
    },
    {
      type: 'linear',
      x: 0,
      y: 0.2,
      x2: 0,
      y2: 1,
      colorStops: [
        {
          offset: 0,
          color: '#FF6E41' // 0% 处的颜色
        },
        {
          offset: 1,
          color: '#FFB956' // 100% 处的颜色
        }
      ]
    }
  ];
  let options2 = {
    color: colors,
    legend: {
      x: 'center',
      bottom: 20,
      itemWidth: 14,
      itemGap: 40,
      textStyle: {
        color: '#FAFBFC'
      },
      data: legend
    },
    radar: {
      startAngle: 60,
      nameGap: 10,
      indicator: indicator,
      center: ['50%', '40%'],
      radius: '65%',
      name: {
        textStyle: {
          color: '#19C1FF'
        }
      },
      axisLine: {
        lineStyle: {
          color: '#FF6E41'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#FF6E41'
        }
      },
      splitArea: {
        areaStyle: {
          color: 'rgba(0,0,0,0)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        itemStyle: {
          opacity: 0
        },
        lineStyle: {
          color: 'rgba(0,0,0,0)'
        },
        areaStyle: {
          opacity: 0.8
        },
        data: data
      }
    ]
  };

  if (title === '用户价值') {
    return options2;
  } else {
    return options1;
  }
}

function getPie(data = [], title) {
  let dataStyle = {
    formatter: '{label|{b}}\n{d}{percent| %}',
    show: true,
    grid: {
      left: '40%',
      top: 10
    },
    textStyle: {
      fontSize: 24,
      fontWeight: 'normal',
      color: '#fff',
      fontFamily: 'Helvetica'
    },
    rich: {
      percent: {
        fontSize: 16,
        fontFamily: 'din',
        color: '#fff',
        verticalAlign: 'bottom'
      },
      label: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'PingFangSC-Regular'
      }
    }
  };

  let options = {
    color: ['rgba(255, 202, 50, 1)', 'rgba(121, 255, 232, 1)'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['45%', '65%'],
        center: ['55%', '60%'],
        data: data,
        label: dataStyle
      }
    ]
  };

  return options;
}

function isLeapYear(year) {
  if (year % 100 === 0 && year % 400 === 0) {
    return true;
  } else if (year % 100 !== 0 && year % 4 === 0) {
    return true;
  }
  return false;
}

function getDaysOfMonth(isLeap, month) {
  let days = 0;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      days = 31;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      days = 30;
      break;
    case 2:
      if (isLeap) {
        days = 29;
      } else {
        days = 28;
      }
  }
  return days;
}

function getLine(data = [], title, type) {
  let yAxisData = [];
  let flowData = [];
  let vipData = [];

  if (type === 'month') {
    const now = new Date();
    const nums = getDaysOfMonth(isLeapYear(now.getFullYear()), now.getMonth() + 1);
    for (let i = 1; i <= nums; i++) {
      yAxisData.push(i);
      const finded = data.find(itme => itme.description === i + '');
      if (finded) {
        flowData.push(finded.passengerFlowCount);
        vipData.push(finded.vipCount);
      } else {
        flowData.push(0);
        vipData.push(0);
      }
    }
  } else {
    for (let i = 8; i <= 24; i++) {
      yAxisData.push(i + ':00');
      const finded = data.find(itme => itme.description === i + '');
      if (finded) {
        flowData.push(finded.passengerFlowCount);
        vipData.push(finded.vipCount);
      } else {
        flowData.push(0);
        vipData.push(0);
      }
    }
  }
  let option = {
    color: ['rgba(121, 255, 232, 0.36)', 'rgba(255, 192, 88, 0.56)'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '30',
      right: '30',
      top: '37',
      bottom: '22',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      splitNumber: 4,
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 14,
        color: '#fff',
        fontFamily: 'Helvetica'
      }
    },
    xAxis: {
      type: 'category',
      data: yAxisData,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 14,
        color: '#fff'
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '客流量',
        type: 'line',
        data: flowData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 0
        },
        areaStyle: {
          color: 'rgba(121, 255, 232, 0.3685)'
        }
      },
      {
        name: '会员量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: vipData,
        lineStyle: {
          width: 0
        },
        areaStyle: {
          color: 'rgba(255, 192, 88, 0.5613)'
        }
      }
    ]
  };
  return option;
}

function getBar(data = [], title) {
  const blue = new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    {
      offset: 0,
      color: 'rgba(50,255,234,1)'
    },
    {
      offset: 1,
      color: 'rgba(50,78,255,1)'
    }
  ]);
  let yAxisData = [];
  let serieData = [];
  for (let item of data) {
    yAxisData.push(item.name);
    serieData.push(item.value);
  }
  let option = {
    color: [blue],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '12',
      right: '12',
      top: '10',
      bottom: '0',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: false
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Helvetica'
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: title,
        type: 'bar',
        barWidth: 11,
        label: {
          show: true,
          position: 'insideBottomLeft',
          color: '#fff',
          fontSize: 16,
          offset: [6, -10],
          formatter(params) {
            return filters.number(params.value);
          }
        },
        data: serieData
      }
    ]
  };
  return option;
}

export default {
  getPie,
  getBar,
  getLine,
  getRadar
};
