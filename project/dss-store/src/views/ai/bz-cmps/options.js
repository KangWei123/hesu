import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';

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
        radius: ['50%', '75%'],
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
  getLine
};
