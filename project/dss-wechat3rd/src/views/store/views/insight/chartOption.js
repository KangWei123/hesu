const pieColors = ['#FFDB5C', '#FF9F7F', '#FB7293', '#E062AE', '#E690D1', '#E7BCF3'];
const lineColors = ['#3F90FF', '#FF70B2'];

function titleConfig(title) {
  return {
    text: title,
    x: 32,
    textStyle: {
      color: '#606266',
      fontSize: 14
    }
  };
}

export default {
  getPieOption(config) {
    const option = {
      color: pieColors,
      isEmpty: config.isEmpty,
      title: titleConfig(config.title),
      tooltip: {
        trigger: 'item',
        formatter: function(param) {
          let html = `${param.seriesName}<br />`;
          html += `${param.marker}${param.name}：${param.value} (${param.percent}%)<br />`;
          return html;
        }
      },
      series: [
        {
          name: config.title,
          type: 'pie',
          radius: '45%',
          center: ['50%', '60%'],
          data: config.data || [],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            color: '#606266',
            formatter: '{d}% {b}',
            fontSize: 10
          }
        }
      ]
    };
    return option;
  },
  getBarOption(config, isHorizon = false) {
    config = config || {};

    const series = [];
    if (config.data && config.data.length) {
      config.data.forEach(item => {
        series.push({
          name: item.name,
          type: 'bar',
          barGap: 0,
          barMaxWidth: item.barMaxWidth || '20',
          label: {
            normal: {
              show: true,
              formatter: '{c}%',
              position: item.labelPosition || 'top',
              fontSize: 10,
              color: 'rgba(96,98,102,1)'
            }
          },
          data: item.data || []
        });
      });
    }

    const valueAxis = {
      type: 'value',

      boundaryGap: [0, 0.01],
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
        lineStyle: {
          color: 'rgba(240,243,245,1)'
        }
      }
    };

    const categoryAxis = {
      type: 'category',
      data: config.xAxisData || [],
      axisTick: {
        show: false
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(240,243,245,1)'
        }
      }
    };

    const option = {
      isEmpty: config.isEmpty,
      color: lineColors,
      title: titleConfig(config.title),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter(params) {
          if (params.length === 0) {
            return;
          }
          const firstSerie = params[0];

          let html = `${firstSerie.axisValue}<br />`;
          for (let serie of params) {
            const {value, count} = serie.data;
            html += `${serie.marker}${serie.seriesName}：${count} (${value}%)<br />`;
          }

          return html;
        }
      },
      grid: {
        left: '32',
        right: '32',
        bottom: '8',
        containLabel: true
      },
      series: series
    };

    if (isHorizon) {
      valueAxis.splitLine.show = false;
      valueAxis.axisLine = {
        show: !config.isEmpty,
        lineStyle: {
          color: 'rgba(240,243,245,1)'
        }
      };
      option.xAxis = valueAxis;
      option.yAxis = categoryAxis;
    } else {
      categoryAxis.splitLine.show = false;
      option.yAxis = valueAxis;
      option.xAxis = categoryAxis;
    }

    return option;
  }
};
