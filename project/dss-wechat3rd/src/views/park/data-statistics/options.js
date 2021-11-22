function getOption(data = []) {
  const option = {
    color: ['#6ac0ff', '#fba845'],
    title: [
      {
        show: false,
        text: '停车收费统计',
        left: 0,
        textStyle: {
          fontSize: 20,
        },
      },
    ],

    tooltip: {
      trigger: 'axis',
    },

    grid: {
      show: false,
      left: '3%',
      right: '20',
      bottom: '3%',
      containLabel: true,
    },

    xAxis: {
      type: 'category',
      data: [],
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#e8edf1',
        },
      },
      nameTextStyle: {
        color: '#303133',
        fontSize: '12',
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        color: '#303133',
        fontSize: '12',
        margin: 14,
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#e8edf1',
        },
      },
      axisLabel: {
        show: true,
        color: '#303133',
        fontSize: '12',
      },

      axisTick: {
        show: false,
      },
    },

    series: [
      {
        name: '订单金额',
        type: 'line',
        data: [],
        symbolSize: 14,
      },
      {
        name: '实付金额',
        type: 'line',
        data: [],
        symbolSize: 14,
      },
    ],
  };

  option.xAxis.data = data.map(item => item.payDate || item.payHour);
  option.series[0].data = data.map(item => (item.orderTotalAmount / 100).toFixed(2));
  option.series[1].data = data.map(item => (item.orderTotalActualPayAmount / 100).toFixed(2));

  return option;
}

export default {
  getOption,
};
