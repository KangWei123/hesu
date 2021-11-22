import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';

function getPie(data = []) {
  let options = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '性别占比',
        type: 'pie',
        radius: ['63%', '91%'],
        center: ['50%', '50%'],
        data: [
          {
            ...data[0],
            itemStyle: {
              color: 'transparent'
            }
          },
          {
            ...data[1],
            itemStyle: {
              color: '#4891FF'
            }
          }
        ],

        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        }
      },
      {
        name: '性别占比',
        type: 'pie',
        radius: ['63%', '84%'],
        center: ['50%', '50%'],
        data: [
          {
            ...data[0],
            itemStyle: {
              color: '#FF73BC'
            }
          },
          {
            ...data[1],
            itemStyle: {
              color: 'transparent'
            }
          }
        ],
        label: {
          normal: {
            show: false
          },
          emphasis: {
            show: false
          }
        }
      }
    ]
  };

  return options;
}

function getAreaLine(data, legendData, maxValue) {
  let color = [
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: '#C23431'
      },
      {
        offset: 1,
        color: '#CD5A57'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: '#E1B36E'
      },
      {
        offset: 1,
        color: '#CA8622'
      }
    ]),
    new echarts.graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: '#B2DCC8'
      },
      {
        offset: 1,
        color: '#90C7AD'
      }
    ])
  ];

  let yAxisData = [];
  let serieData = [];
  data.forEach((item, index) => {
    if (index < 3) {
      item.itemStyle = {
        color: color[index]
      };
    } else {
      item.itemStyle = {
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: '#3CAADF'
          },
          {
            offset: 0.6,
            color: '#1C71BC'
          }
        ])
      };
    }
    yAxisData.push(item.name);
    serieData.push({ name: item.name, value: maxValue });
  });

  let options = {
    tooltip: {
      trigger: 'item'
    },
    grid: {
      left: 115,
      right: 63,
      top: 30,
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
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      left: 30,
      top: 30,
      bottom: 32,
      textStyle: {
        color: '#fff',
        padding: [0, 0, 0, 10],
        fontSize: 14,
        fontFamily: 'PingFangSC-Regular'
      },
      icon: 'circle',
      itemWidth: 14,
      itemHeight: 14,
      itemGap: 15,
      data: legendData
    },
    series: [
      {
        color: [
          '#61A0A7',
          '#7DA9C5',
          '#846060',
          '#BDA29A',
          '#536570',
          '#797B7F',
          '#749F83',
          '#90C7AD',
          '#CA8622',
          '#C23431'
        ],
        name: '地区分布',
        type: 'pie',
        radius: [0, 0],
        center: [0, 0],
        data: serieData.reverse(),
        label: {
          show: false
        }
      },
      {
        type: 'bar',
        barWidth: 10 /*bar的最大宽度50px*/,
        itemStyle: {
          normal: {
            color: 'rgba(28, 113, 188, 0.2)',
            barBorderRadius: 2
          }
        },
        tooltip: {
          show: false
        },
        silent: true,
        label: {
          show: true,
          color: '#fff',
          position: 'right',
          fontFamily: 'PingFangSC-Regular',
          fontSize: 14,
          offset: [22, 0],
          formatter(params, index) {
            return filters.percent(data[params.dataIndex].value, maxValue);
          }
        },
        data: new Array(data.length).fill(maxValue)
      },
      {
        type: 'bar',
        barWidth: 10,
        barGap: '-100%',
        itemStyle: {
          normal: {
            barBorderRadius: 2
          }
        },
        data: data.reverse()
      }
    ]
  };
  return options;
}

function getLine(data = []) {
  let yAxisData = [];
  let flowData = [];
  const color = new echarts.graphic.LinearGradient(0, 1, 0, 0, [
    {
      offset: 0,
      color: '#3834C4'
    },
    {
      offset: 1,
      color: '#45CBC1'
    }
  ]);
  let hour = 24;
  // let now = new Date();
  // hour = now.getHours();
  // if (hour <= 8) {
  //   hour = 24;
  // }
  let markPointData = [];

  for (let i = 8; i <= hour; i++) {
    yAxisData.push(i + ':00');
    const finded = data.find(itme => itme.description === i + '');
    let obj = {
      name: i + ':00',
      value: 0
    };
    if (finded) {
      obj.value = finded.passengerFlowCount;
      flowData.push(obj);
    } else {
      flowData.push(obj);
    }
  }

  flowData.forEach((item, index) => {
    if (
      flowData[index - 1] &&
      flowData[index + 1] &&
      flowData[index - 1].value < item.value &&
      item.value > flowData[index + 1].value
    ) {
      markPointData.push({
        coord: [item.name, item.value],
        name: item.name,
        value: item.value
      });
    }
  });

  let option = {
    color: ['rgba(121, 255, 232, 0.36)', 'rgba(255, 192, 88, 0.56)'],
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '31',
      right: '33',
      top: '35',
      bottom: '23',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      splitLine: {
        show: false
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
        fontFamily: 'DIN-Medium'
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
        color: '#fff',
        fontFamily: 'DIN-Medium'
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
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          itemStyle: {
            color: '#7CFAFF',
            shadowColor: 'rgba(124,250,255,1)',
            shadowBlur: 5
          },
          label: {
            color: '#7CFAFF',
            position: 'top',
            fontSize: 14,
            fontFamily: 'DIN-Medium',
            formatter(params, index) {
              console.log(params);
              return params.value + '人';
            }
          },
          data: markPointData
        },
        lineStyle: {
          width: 0
        },
        label: {
          show: false
        },
        areaStyle: {
          color: color
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
      color: 'rgba(28, 113, 188, 1)'
    },
    {
      offset: 0.6,
      color: 'rgba(60, 170, 223, 1)'
    }
  ]);
  let maxValue = 0;
  data.forEach(item => {
    // if (Math.abs(item.value) > Number(maxValue)) {
    //   maxValue = Math.abs(item.value);
    // }
    maxValue += Math.abs(item.value);
  });

  let yAxisData = [];
  let serieData = [];
  for (let item of data) {
    yAxisData.push(item.name);
    serieData.push(item.value);
  }
  let option = {
    color: [blue],
    tooltip: {
      trigger: 'item'
    },
    grid: {
      left: -22,
      right: 82,
      top: 16,
      bottom: 0,
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
        margin: 84,
        align: 'left',
        fontSize: 14,
        color: '#fff',
        fontFamily: 'PingFangSC-Regular'
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: 'shadow',
        type: 'bar',
        barWidth: 10 /*bar的最大宽度50px*/,
        itemStyle: {
          normal: {
            color: 'rgba(28, 113, 188, 0.2)',
            barBorderRadius: 2
          }
        },
        tooltip: {
          show: false
        },
        silent: true,
        label: {
          show: true,
          color: '#fff',
          position: 'right',
          fontFamily: 'PingFangSC-Regular',
          fontSize: 14,
          offset: [22, 0],
          formatter(params, index) {
            return filters.number(data[params.dataIndex].value) + '人';
          }
        },
        data: new Array(data.length).fill(maxValue || 1)
      },
      {
        name: '年龄占比',
        type: 'bar',
        barWidth: 10,
        barGap: '-100%',
        itemStyle: {
          normal: {
            barBorderRadius: 2
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
  getAreaLine
};
