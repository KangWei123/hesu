import dataParser from './dataParser.js';
import echarts from 'echarts';

const defaultColor = [
  '#B386F2',
  '#1C4EDD',
  '#2DAAFF',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];

export default {
  /**
   * 组装矩形树状图 Options
   * @param sourceData 源数据，数组
   */
  assembleTreemapOptions(sourceData) {
    if (!sourceData || !sourceData.length) {
      return null;
    }
    // todo data parser
    // const { legendData, xAxisData, seriesData } = dataParser.parseBarOrLineData(sourceData)
    // todo fake series data
    let seriesData = sourceData;

    const seriesOptions = {
      width: '100%',
      height: '100%',
      leafDepth: 1,
      roam: false,
      breadcrumb: {
        show: false,
      },
      nodeClick: false,
      // 图表标签
      label: {
        formatter(params) {
          let res = params.name;
          if (res.length > 7) {
            res = res.substring(0, 8) + '...';
          }
          const val = Number((params.value * 100).toPrecision(12)).toFixed(2) + '%';
          return `${res} \n ${val}`;
        },
      },
    };

    seriesData = {
      ...sourceData[0],
      ...seriesOptions,
    };

    return {
      color: defaultColor,
      legend: {
        show: false,
      },
      tooltip: {
        show: true,
        trigger: 'item',
      },
      series: seriesData,
    };
  },
};
