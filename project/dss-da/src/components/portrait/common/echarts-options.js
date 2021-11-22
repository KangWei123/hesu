/**
 *
 */

export default {
  /** echarts项目默认配置 */
  default() {
    const options = {
      tooltip: {
        trigger: 'axis',
        borderWidth: 0,
        padding: [8, 16, 8, 16],
        extraCssText: 'border-color: transparent;'
      },
      grid: {
        top: 60,
        bottom: 50,
        left: 30,
        right: 30,
        containLabel: true
      },
      legend: {
        data: ['曝光量', '点击量'],
        right: 30,
        top: -3,
        icon: 'circle',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 28
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          margin: 26,
          fontSize: 12,
          fontFamily: 'Montserrat, Microsoft Yahei',
          color: 'rgba(1, 35, 52, 0.6)'
        },
        data: []
      },
      yAxis: {
        type: 'value',
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          margin: 38,
          fontSize: 12,
          fontFamily: 'Montserrat, Microsoft Yahei',
          color: 'rgba(1, 35, 52, 0.6)'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(1, 35, 52, 0.12)'
          }
        }
      }
    };

    return options;
  },
  /**
   * echart tooltip html
   * @param  {[type]} config { title: '2017-11-16', data: [{label: 1, value: 2, color: '#333'}] }
   * @return {[type]}        [description]
   */
  tooltip(config) {
    const contentHtml = config.data
      .map(item => {
        return `
               <p class="content">
                    <i class="icon-circle" style="background-color: ${item.color}"></i>
                    <span>${item.label}：</span>
                    <em>${item.value}</em>
               </p>
           `;
      })
      .join('');

    const html = `
           <div class="dsp-echart-tooltip">
               ${config.title ? `<p class="title">${config.title}</p>` : ''}
               ${contentHtml}
           </div>
       `;

    return html;
  }
};
