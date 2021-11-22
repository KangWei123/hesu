<template>
<dsp-card class="bar">
    <template>
      <div v-if="hasData">
        <el-select v-model="chartType" size="small" style="width: 114px">
          <el-option label="点击曝光" :value="CHART_TYPE_ENUM.EXPOSURE"></el-option>
          <el-option label="花费情况" :value="CHART_TYPE_ENUM.COST"></el-option>
        </el-select>
        <chart height="460px" :options="chartOptions" :key="chartType"></chart>
      </div>

      <place-holder v-if="!hasData"></place-holder>
    </template>
</dsp-card>
</template>

<script>
import echartOptions from './common/echarts-options';
import PlaceHolder from '@/dss-common/components/placeholder/index';

/** 图表类型枚举 */
const CHART_TYPE_ENUM = {
  /** 点击曝光 */
  EXPOSURE: 'exposure',
  /** 花费情况 */
  COST: 'cost'
};

export default {
  components: {
    PlaceHolder
  },
  props: {
    data: Array
  },
  data() {
    return {
      CHART_TYPE_ENUM,
      /** 图表类型 */
      chartType: CHART_TYPE_ENUM.EXPOSURE,
      chartOptions: null
    };
  },
  watch: {
    data() {
      this.setChartOptions();
    },
    type() {
      this.setChartOptions();
    },
    chartType() {
      this.setChartOptions();
    }
  },
  computed: {
    hasData() {
      return this.data && this.data.length;
    }
  },
  methods: {
    setChartOptions() {
      if (!this.data || !this.data.length) {
        return;
      }

      if (this.chartType === CHART_TYPE_ENUM.COST) {
        this.setCostOptions();
      } else if (this.chartType === CHART_TYPE_ENUM.EXPOSURE) {
        this.setExposureOptions();
      }
    },
    setExposureOptions() {
      const defaultOptions = echartOptions.default();
      const options = $.extend(true, defaultOptions, {
        legend: {
          data: ['曝光量', '点击量', '点击率']
        },
        grid: {
          right: 0
        },
        xAxis: {
          data: this.data.map(item => item.name)
        },
        tooltip: {
          formatter(params) {
            return echartOptions.tooltip({
              title: params[0].name,
              data: params.map(item => {
                return {
                  label: item.seriesName,
                  value: item.data.originValue || item.value,
                  color: typeof item.color === 'string' ? item.color : item.color.colorStops[0].color
                };
              })
            });
          }
        },
        yAxis: [{ ...defaultOptions.yAxis }, { ...defaultOptions.yAxis, show: false }],
        series: [
          {
            name: '曝光量',
            type: 'bar',
            barMaxWidth: 10,
            data: this.data.map(item => item.imp_count_sum),
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5B76F7' },
                { offset: 1, color: 'rgba(148,174,252,0.7)' }
              ])
            }
          },
          {
            name: '点击量',
            type: 'bar',
            barMaxWidth: 10,
            data: this.data.map(item => item.click_count_sum),
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FC6042' },
                { offset: 1, color: 'rgba(254,153,119,0.7)' }
              ])
            }
          },
          {
            name: '点击率',
            type: 'line',
            yAxisIndex: 1,
            data: this.data.map(item => {
              return {
                value: item.ctr.replace('%', '') / 100,
                originValue: item.ctr
              };
            }),
            itemStyle: {
              color: '#FEA80D',
              width: 1
            }
          }
        ]
      });

      this.chartOptions = options;
    },
    setCostOptions() {
      const defaultOptions = echartOptions.default();
      const options = $.extend(true, defaultOptions, {
        xAxis: {
          //data: ['社会', '娱乐', '历史', '健康', '国际', '军事', '时尚', '汽车', '国内', '多人竞技', '休闲']
          data: this.data.map(item => item.name)
        },
        series: [
          {
            name: '花费情况',
            type: 'bar',
            barMaxWidth: 14,
            data: this.data.map(item => 0),
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5B76F7' },
                { offset: 1, color: 'rgba(148,174,252,0.7)' }
              ])
            }
          }
        ]
      });

      this.chartOptions = options;
    }
  }
};
</script>

