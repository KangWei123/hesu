<template>
  <div class="analysis-box client-life-cycle">
    <div class="analysis-title">
      客户生命周期分布
      <span style="color: #999; font-size: 12px; padding-left: 10px">更新时间：{{ updateTime | time }}</span>
    </div>
    <div v-loading="loading">
      <div class="bar-action-box">
        <span class="bar-action bar-action-active"></span>
      </div>
      <chart :options="chartOptions" height="300px" v-if="sourceValues && sourceValues.length"></chart>
      <place-holder :height="300" v-else />
    </div>
  </div>
</template>

<script>
  import Chart from '@/dss-common/components/ChartEmpty';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import api from '@/mod-member/src/api/manage.js';

  export default {
    name: 'ClientLifeCycle',
    components: { Chart, PlaceHolder },
    props: {
      currentStore: null,
    },
    data() {
      return {
        loading: false,
        chartOptions: null,
        sourceTitles: null,
        sourceValues: null,
        updateTime: null,
      };
    },
    watch: {
      currentStore(newVal, oldVal) {
        this.getData();
      },
    },
    methods: {
      getData() {
        this.loading = true;
        api
          .getLifeCycleDistribution({
            storeId: this.currentStore,
          })
          .then(res => {
            const { sourceTitles, sourceValues } = res.data;
            this.updateTime = sourceValues && sourceValues[0].lastStatTime;
            this.sourceTitles = sourceTitles || [];
            this.sourceValues = sourceValues || [];
            this.getchartOptions();
          })
          .always(() => {
            this.loading = false;
          });
      },
      getchartOptions() {
        const defaultColor = [
          '#97E7A6',
          '#BEEE8D',
          '#D9EE83',
          '#FAE155',
          '#FFF2A8',
          '#FFD69E', // 第一组色系
          '#3A8BFB',
          '#70D2DF',
          '#73DDC8',
          '#95DAFF',
          '#80CDEE',
          '#80A4EE', // 第二组色系
          '#675FDB',
          '#A26CDD',
          '#C95CCF',
          '#DDB3F0', // 第三组色系
          '#E65A5A',
          '#ED8873',
          '#F08F50',
          '#F084BB', // 第四组色系
        ];
        const legendData = [];
        const xAxisData = [];
        const seriesData = [];
        this.sourceTitles.forEach((item, index) => {
          legendData.push({ label: item, value: 'sum_' + index });
          seriesData.push({
            data: [],
            key: 'sum_' + index,
            name: item,
            type: 'bar',
          });
        });
        (this.sourceValues || []).forEach(item => {
          xAxisData.push(item.stageId === 0 ? '暂无阶段' : item.stageName);
          seriesData.map((seriesItem, index) => {
            seriesItem.data.push(item[seriesItem.key]);
            seriesItem.barMaxWidth = '18';
            const formatIndex = index % 20;
            if (formatIndex < 6) {
              seriesItem.stack = 'group1';
            } else if (formatIndex >= 6 && formatIndex < 12) {
              seriesItem.stack = 'group2';
            } else if (formatIndex >= 12 && formatIndex < 16) {
              seriesItem.stack = 'group3';
            } else if (formatIndex >= 16 && formatIndex < 20) {
              seriesItem.stack = 'group4';
            }
            return seriesItem;
          });
        });
        const opts = {
          color: defaultColor,
          tooltip: {
            trigger: 'axis',
            show: true,
            enterable: true,
            hideDelay: 200,
            axisPointer: {
              type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            extraCssText: 'box-shadow: 0 4px 10px 0px rgba(0, 0, 0, 0.1)',
            position: function (point) {
              return [point[0], '12%'];
            },
            formatter: function (params) {
              let dom =
                '<div style="height: auto; max-height: 200px; overflow-y: auto; color: #666"><p style="margin: 5px 10px;font-weight: bold;">' +
                params[0].axisValue +
                '</p>';
              params.forEach(item => {
                dom += '<div style="margin: 0 10px;">' + item.marker + item.seriesName + '：' + item.value + '人</div>';
              });
              dom += '</div>';
              return dom;
            },
          },
          legend: {
            show: true,
            data: legendData,
            type: 'scroll',
            right: '70',
            bottom: 0,
            itemHeight: 12,
            itemWidth: 12,
          },
          grid: {
            left: '45',
            right: '80',
            bottom: '10',
            top: '25',
            containLabel: true,
            borderColor: 'white',
            show: true,
          },
          xAxis: [
            {
              name: '客户阶段',
              type: 'category',
              data: xAxisData,
              nameTextStyle: {
                color: '#999999',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'PingFangSC-Regular',
              },
              axisTick: {
                show: false /* 是否展示x轴刻度 */,
              },
              axisLine: {
                show: true /* 是否展示x轴线 */,
                lineStyle: {
                  color: '#DCDDE0',
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              show: true,
              name: '客户数',
              axisTick: 'none',
              nameTextStyle: {
                color: '#999999',
                fontSize: '14px',
                fontWeight: 400,
                fontFamily: 'PingFangSC-Regular',
              },
              axisLabel: {
                show: true,
                textStyle: { color: '#BFBFBF' },
                lineStyle: { color: '#DCDDE0' },
              },
              splitLine: {
                show: true,
                lineStyle: { color: '#E6E6E6' },
              },
              axisLine: {
                show: true,
                lineStyle: { color: '#DCDDE0' },
              },
            },
          ],
          series: seriesData,
        };
        this.chartOptions = opts;
        // console.log('=======',opts);
      },
    },
  };
</script>
