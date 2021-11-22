import echarts from 'echarts';
import filters from '@/dss-common/utils/filters';

function getBar(data = [], title) {
  const blue = '#40C6F5';
  let yAxisData = [];
  let serieData = [];
  for (let item of data) {
    yAxisData.push(item.name);
    serieData.push(item.value);
  }

  let option = {
    tooltip: {
      trigger: 'item',
      formatter(params) {
        let gender = '';
        let genderDistributePercentList = data[params.dataIndex].genderDistributePercentList;
        genderDistributePercentList.forEach(item => {
          gender += '<br />' + item.genderDescription + '占比：' + item.percent + '%';
        });

        let Age = '';
        let ageDistributePercentList = data[params.dataIndex].ageDistributePercentList;
        ageDistributePercentList.forEach(item => {
          Age += '<br />' + item.ageDescription + '：' + item.percent + '%';
        });

        return title + '量：' + params.value + gender + Age;
      },
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 25,
      position: function(point, params, dom, rect, size) {
        // 固定在顶部
        return [point[0], point[1]];
      },
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: 20,
      right: 100,
      top: 10,
      bottom: 20,
      containLabel: true
    },
    xAxis: {
      type: 'value',
      show: true,
      axisLabel: {
        fontSize: 12,
        color: '#A8A8A8'
      },
      splitLine: { show: false },
      axisLine: {
        lineStyle: {
          color: '#E6E6E6'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      inverse: true,
      axisLabel: {
        fontSize: 12,
        color: '#A8A8A8',
        formatter: function(value, index) {
          if (value.length > 10) {
            value = value.substring(0, 10) + '\n' + value.substring(10, 20);
          }

          return value;
        }
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#E6E6E6'
        }
      },
      axisTick: {
        show: false
      }
    },
    series: [
      {
        name: 'shadow',
        type: 'bar',
        barMaxWidth: '19px' /*bar的最大宽度50px*/,
        itemStyle: {
          normal: {
            color: blue
          }
        },
        tooltip: {
          show: true
        },
        data: serieData
      }
    ]
  };
  return option;
}

export default {
  getBar
};
