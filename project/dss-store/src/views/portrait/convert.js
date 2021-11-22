const direct = {
  x: 0,
  y: 0,
  x2: 0,
  y2: 1
};
const blueGradient = {
  ...direct,
  type: 'linear',
  colorStops: [
    {
      offset: 1,
      color: 'rgba(72,124,237,0)' // 0% 处的颜色
    },
    {
      offset: 0,
      color: 'rgba(72,124,237,0.2)' // 100% 处的颜色
    }
  ]
};

const lightBlueGradient = {
  ...direct,
  type: 'linear',
  colorStops: [
    {
      offset: 1,
      color: 'rgba(73,206,230,0)' // 0% 处的颜色
    },
    {
      offset: 0,
      color: 'rgba(73,206,230,0.2)' // 100% 处的颜色
    }
  ]
};

const redGrandient = {
  ...direct,
  type: 'linear',
  colorStops: [
    {
      offset: 1,
      color: 'rgba(255,92,86,0)' // 0% 处的颜色
    },
    {
      offset: 0,
      color: 'rgba(255,92,86,0.2)' // 100% 处的颜色
    }
  ]
};

const colors = {
  blue: {
    border: '#487CED',
    area: blueGradient
  },
  lightBlue: {
    border: '#55D4FE',
    area: lightBlueGradient
  },
  red: {
    border: '#FD7758',
    area: redGrandient
  }
};

function toBar(config) {
  const barColor = {
    x: 0,
    y: 0,
    x2: 1,
    y2: 0,
    colorStops: [
      {
        offset: 0,
        color: '#81B6F5' // 0% 处的颜色
      },
      {
        offset: 1,
        color: '#4A80E8' // 100% 处的颜色
      }
    ]
  };
  return {
    grid: {
      top: 22,
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
      data: config.dataAxis,
      axisTick: {
        show: false
      },
      axisLabel: {
        interval: 0,
        color: '#566980'
      },
      axisLine: {
        show: config.hideAxisLine ? false : true,
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
          color: config.barColor || barColor,
          barBorderRadius: 30
        },
        type: 'bar',
        data: config.data,
        barWidth: 30,
        z: 10,
        label: {
          position: 'top',
          show: true,
          color: config.labelColor || '#487CED',
          formatter: '{c}%'
        }
      },
      {
        type: 'bar',
        itemStyle: {
          color: config.bgColor || '#EFF2F5',
          barBorderRadius: 30
        },
        barGap: '-100%',
        barWidth: 30,
        data: config.dataShadow,
        silent: true,
        animation: false
      }
    ]
  };
}

function toPie(config) {
  return {
    color: config.colors || ['#83A0EA', '#FF7E54'],
    series: [
      {
        type: 'pie',
        radius: config.radius || ['46%', '65%'],
        label: {
          normal: {
            show: config.showLabel || false,
            textStyle: {
              color: 'rgba(0, 0, 0, 1)'
            },
            formatter: ['{b}', '{c}'].join('\n')
          },
          emphasis: {
            show: false
          }
        },
        silent: true,
        data: config.data
      }
    ]
  };
}

function toLine(config, color = 'blue') {
  const colorConfig = colors[color] || colors.blue;

  let option = {
    color: colorConfig.border,
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '45',
      right: '47',
      bottom: '24',
      top: '22',
      containLabel: true
    },
    xAxis: [
      {
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
          color: '#566980',
          fontSize: 14,
          margin: 15
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.15)'
          }
        }
      }
    ],
    yAxis: [
      {
        show: config.data.length > 0,
        type: 'value',
        axisLine: {
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.15)'
          }
        },
        axisLabel: {
          color: '#566980',
          fontSize: 14,
          margin: 15
        }
      }
    ],
    series: [
      {
        name: config.title,
        type: 'line',
        symbolSize: 0,
        smooth: true,
        lineStyle: {
          width: 2,
          color: colorConfig.border,
          shadowColor: colorConfig.border,
          shadowOffsetY: 6,
          shadowBlur: 10
        },
        areaStyle: {
          color: colorConfig.area
        },
        data: config.data
      }
    ]
  };
  return option;
}

export default {
  ageToBar(ageData, scale = 100, barColor, labelColor = '#487CED', hideAxisLine = false) {
    let dataAxis = [];
    let data = [];
    let yMax = 100;
    let dataShadow = [];

    ageData.forEach(item => {
      dataAxis.push(item.portraitName);
      data.push((item.portraitRate * scale).toFixed(1));
      dataShadow.push(yMax);
    });
    return barColor
      ? toBar({ dataAxis, data, dataShadow, barColor, labelColor, hideAxisLine })
      : toBar({ dataAxis, data, dataShadow });
  },
  marriToPie(married, unmarried, showLabel, radius, itemColors) {
    const config = {
      data: [married, unmarried === -1 ? 1 - married : unmarried],
      showLabel,
      radius,
      colors: itemColors || ['#83A0EA', '#FF7E54']
    };
    return toPie(config);
  },
  passflowToLine(data, title, color) {
    const xAxisData = [];
    const serieData = [];

    (data || []).forEach(item => {
      xAxisData.push(item.date);
      serieData.push(item.passenger);
    });

    const config = {
      xAxisData,
      title,
      data: serieData
    };
    return toLine(config, color);
  },
  jobToPie(data) {
    const options = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      color: ['#f3894f', '#fec400', '#28cc97', '#21b0df', '#0099ff', '#5b6378', '#f3694f'],
      center: ['50%', '50%'],
      series: [
        {
          name: '职业分布',
          type: 'pie',
          radius: ['0', '55%'],
          data: (data || []).map(item => {
            return {
              name: item.portraitName,
              value: item.portraitCount
            };
          })
        }
      ]
    };
    return options;
  },
  phoneModelToPie(data, count) {
    let dataArray = data.map((dataObj, index) => {
      if (dataObj != null && dataObj.hasOwnProperty('portraitCount') && dataObj.hasOwnProperty('portraitName'))
        return {
          value: dataObj.portraitCount,
          name: dataObj.portraitName,
          dataSource: dataObj
          // itemStyle: {
          //   normal: {
          //     // color: color[index],
          //     borderColor: "#fff",
          //     borderWidth: "5"
          //   }
          // }
        };
    });
    let dataNameArray = data.map((dataObj, index) => {
      if (dataObj != null && dataObj.hasOwnProperty('portraitName')) return dataObj.portraitName;
    });

    return {
      tooltip: {
        trigger: 'item',
        formatter:
          // '{a} <br/>{b} : {c} ({d}%)'
          function(a) {
            return '机型占比 <br/>' + a.name + ' : ' + (a.data.dataSource.portraitRate * 100).toFixed(2) + '%';
          }
      },
      legend: {
        orient: 'horizontal',
        x: 'center',
        y: 'bottom',
        icon: 'circle',
        data: dataNameArray
      },
      color: [
        '#4379ED',
        '#FF7F56',
        '#FFDE74',
        // '#FF5B56',
        '#7274F1',
        '#60CBEE',
        '#189BFC',
        '#5BECBD',
        '#FFAE4C',
        '#BEA06D',
        '#695E4E'
      ],
      series: [
        {
          name: '机型占比',
          hoverAnimation: false,
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['45%', '65%'],
          avoidLabelOverlap: false,
          label: { normal: { show: false } },
          labelLine: { normal: { show: false } },
          data: dataArray
        }
      ]
    };
  }
};
