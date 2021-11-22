import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';
import imgMale from '@/dss-store/src/asserts/images/flow/male.png';
import imgFemale from '@/dss-store/src/asserts/images/flow/female.png';

function getPie(data = [], title) {
  let dataStyle = {
    formatter: '{label|{b}}\n{d}{percent| %}',
    show: true,
    textStyle: {
      fontSize: 18,
      fontWeight: 'normal',
      color: '#fff',
      fontFamily: 'Helvetica'
    },
    rich: {
      percent: {
        fontSize: 12,
        fontFamily: 'din',
        color: '#fff',
        verticalAlign: 'bottom'
      },
      label: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'PingFangSC-Regular'
      }
    }
  };

  let options = {
    color: ['rgba(89, 95, 255, 1)', 'rgba(255, 202, 89, 1)', 'rgba(89, 218, 255, 1)'],
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    grid: {
      top: 0,
      bottom: 43
    },
    series: [
      {
        name: title,
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['50%', '50%'],
        data: data,
        label: dataStyle
      }
    ]
  };

  return options;
}

function getLine(data = [], title) {
  let yAxisData = [];
  let flowData = [];

  const hour = new Date().getHours();

  for (let i = 8; i <= 24; i++) {
    yAxisData.push(i + ':00');
    const finded = data.find(itme => itme.date === i + '');
    if (finded) {
      flowData.push(finded.value);
    } else {
      let val = i <= hour ? 0 : '-';
      flowData.push(val);
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
          color: 'rgba(255,255,255, 0.2)'
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
        name: title,
        type: 'line',
        data: flowData,
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 2,
          color: 'rgba(89, 232, 255, 1)'
        },
        areaStyle: {
          color: 'rgba(89, 232, 255, 0.1)'
        }
      }
    ]
  };
  return option;
}

function getBar(data = [], title, isNormal = true, isSex = false) {
  const blue = new echarts.graphic.LinearGradient(1, 0, 0, 0, [
    {
      offset: 0,
      color: 'rgba(146, 239, 255, 1)'
    },
    {
      offset: 1,
      color: 'rgba(89, 218, 255, 1)'
    }
  ]);
  let yAxisData = [];
  let serieData = [];
  for (let item of data) {
    yAxisData.push(item.name);
    serieData.push(item.value);
  }
  let axisLabel = {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Helvetica',
    margin: 22
  };
  if (isSex) {
    axisLabel = {
      formatter: function(value) {
        return `${value} {${value === '男' ? 'male' : 'female'}|}`;
      },
      fontSize: 16,
      color: '#fff',
      fontFamily: 'Helvetica',
      margin: 22,
      rich: {
        male: {
          height: 24,
          align: 'center',
          backgroundColor: {
            image: imgMale
          }
        },
        female: {
          height: 24,
          align: 'center',
          backgroundColor: {
            image: imgFemale
          }
        }
      }
    };
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
      left: isSex ? 64 : 40,
      right: '80',
      top: '0',
      bottom: '20',
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
      },
      axisLabel,
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: title,
        type: 'bar',
        barWidth: isNormal ? 8 : 4,
        label: {
          show: true,
          position: isNormal ? 'right' : 'insideTopLeft',
          color: '#fff',
          fontSize: 14,
          offset: isNormal ? null : [-2, 8],
          formatter(params) {
            return filters.number(params.value) + '%';
          }
        },
        data: serieData
      }
    ]
  };
  return option;
}

const config = [
  {
    textSize: 10,
    size: 70
  },
  {
    textSize: 12,
    size: 86
  },
  {
    borderWidth: 5,
    textSize: 14,
    subTextSize: 8,
    size: 106
  },
  {
    textSize: 16,
    size: 118
  },
  {
    textSize: 20,
    size: 149
  }
  /*,
  {
    borderWidth: 7,
    textSize: 18,
    subTextSize: 12,
    size: 170
  },
  {
    borderWidth: 7,
    textSize: 19,
    subTextSize: 13,
    size: 180
  },
  {
    borderWidth: 10,
    textSize: 24,
    subTextSize: 16,
    size: 200
  }*/
];

const positions = [
  { x: '3', y: '1' },
  { x: '16.16', y: '7.032' },
  { x: '10.666', y: '3.385' },
  { x: '6.081', y: '1.422' },
  { x: '18.658', y: '7.05' },
  { x: '0.198', y: '0.995' },
  { x: '20', y: '4.587' },
  { x: '7.693', y: '5.61' },
  { x: '14.424', y: '4.561' },
  { x: '8.962', y: '1.235' },
  { x: '3.675', y: '3.705' },
  { x: '16.909', y: '0.286' },
  { x: '14.726', y: '1.076' },
  { x: '4.349', y: '6.412' },
  { x: '12.53', y: '2.22' },
  { x: '17.234', y: '4.91' },
  { x: '11', y: '6.477' },
  { x: '20', y: '1.177' },
  { x: '21', y: '6.477' },
  { x: '1.28', y: '4.172' },
  { x: '13.5', y: '6.877' },
  { x: '0.604', y: '6.931' },
  { x: '18', y: '2.477' },
  { x: '12', y: '0.977' },
  { x: '2.3', y: '6.8' },
  { x: '12.234', y: '4.61' }
];

function random(min, max) {
  let range = max - min;
  let num = min + parseFloat((Math.random() * range).toFixed(3));
  return num;
}

function formatData(data) {
  let min = null;
  let max = null;
  data.forEach(item => {
    if (!min) {
      min = item.commoditySale;
      max = item.commoditySale;
      return;
    }
    min = Math.min(min, item.commoditySale);
    max = Math.max(max, item.commoditySale);
  });

  const step = (max - min) / config.length;

  const list = [];
  data.forEach((item, i) => {
    let index = 0;
    if (step === 0) {
      index = config.length - 1;
    } else {
      const tem = parseInt((item.commoditySale - min) / step) - 1;
      if (tem < 0) {
        index = 0;
      } else if (tem >= config.length) {
        index = config.length - 1;
      } else {
        index = tem;
      }
    }
    let position;
    if (positions[i]) {
      position = [positions[i].x, positions[i].y, item.commoditySale];
    } else {
      position = [random(0, 20), random(0, 8), item.commoditySale];
    }

    const render = config[index];
    list.push(
      {
        name: item.commoditySale,
        value: position,
        symbolSize: render.size,
        z: 1,
        label: {
          normal: {
            align: 'center',
            position: ['50%', '60%'],
            lineHeight: render.textSize,
            textStyle: {
              fontSize: render.textSize,
              color: '#fff'
            }
          }
        }
      },
      {
        name: item.name,
        value: position,
        symbolSize: render.size,
        z: 2,
        silent: true,
        label: {
          normal: {
            align: 'center',
            position: ['50%', '35%'],
            textStyle: {
              fontSize: render.textSize,
              color: '#fff'
            }
          }
        },
        itemStyle: {
          normal: {
            color: 'transparent'
          }
        }
      }
    );
  });
  return {
    data: list,
    min,
    max
  };
}

function getBubble(data = [], title) {
  const newdatas = formatData(data).data;
  const option = {
    grid: {
      show: false,
      top: 25,
      left: 50,
      bottom: 50
    },
    xAxis: {
      gridIndex: 0,
      type: 'value',
      min: 0,
      max: 20,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 8,
      gridIndex: 0,
      show: false
    },
    series: [
      {
        type: 'scatter',
        symbol: 'circle',
        symbolSize: 120,
        label: {
          normal: {
            show: true,
            formatter: '{b}',
            color: '#fff',
            textStyle: {
              fontSize: '20'
            }
          }
        },
        itemStyle: {
          normal: {
            color: 'rgba(89,208,255,0.8)'
          }
        },
        data: newdatas
      }
    ]
  };
  return option;
}

function getMap(data = [], title) {
  const options = {
    tooltip: {
      trigger: 'item',
      formatter(params) {
        if (params.seriesIndex === 1) {
          return '';
        }
        return `${params.name}<br>占比：${params.value}%`;
      }
    },
    visualMap: {
      show: true,
      min: 0,
      max: 100,
      text: ['高', '低'],
      left: 10,
      textStyle: {
        color: '#ffffff'
      },
      //'rgba(89, 95, 255, 1)', 'rgba(255, 202, 89, 1)', 'rgba(89, 218, 255, 1)'
      // ['rgba(89, 95, 255, 1)', 'rgba(255, 202, 89, 1)', 'rgba(89, 218, 255, 1)'],
      inRange: {
        color: ['#66d8f9', '#5890cd', '#5168b6', '#4b45a1']
      }
    },
    geo: {
      map: 'china',
      //layoutCenter: ['50%', '50%'],
      //layoutSize: '100%',
      zoom: 1.23,
      itemStyle: {
        normal: {
          areaColor: '#031525',
          borderColor: '#3B5077'
        },
        emphasis: {
          areaColor: '#2B91B7'
        }
      },
      label: {
        emphasis: {
          show: false
        }
      }
    },
    series: [
      {
        name: '客群分布',
        type: 'map',
        roam: false,
        geoIndex: 0,
        label: {
          show: false
        },
        data: data
      }
    ]
  };
  return options;
}

export default {
  getPie,
  getBar,
  getLine,
  getBubble,
  getMap
};
