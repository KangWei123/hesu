<template>
  <div class="bar-chart">
    <div class="bar-chart-item" v-for="(item, index) in curData" :key="index" v-if="curData.length">
      <p class="item-title"><i>{{index + 1}}.</i>{{item.area}}</p>
      <div class="item-container">
        <div class="item-chart">
          <chart :options="item.options"></chart>
        </div>
        <p class="uv">{{item.uvFormat}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../utils'
import Chart from './Chart'

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  components: { Chart },
  data() {
    return {
      curData: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        if (this.data.length) {
          this.setOptions()
        }
      }
    }
  },
  methods: {
    setOptions() {
      if (!this.data.length) {
        return
      }

      const option = {
        color: ['#246efc'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
          // confine: true
        },
        grid: {
          left: '5%',
          right: '3%',
          top: 0,
          bottom: 0,
          containLabel: false
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: null,
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            // max: null,
            // min: 0,
            scale: true,
            axisTick: {
              show: false
            },
            axisLine: {
              // onZero: false,
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '客流量',
            type: 'bar',
            barWidth: '50%',
            barMaxWidth: 4,
            data: null
          }
        ]
      }

      let data = this.data.map(item => {
        let opts = utils.plain(option)
        // opts.series[0].data = [];
        // opts.xAxis[0].data = [];
        opts.series[0].data = item.details.map(val => val.uv)
        opts.xAxis[0].data = item.details.map(val => val.tdate)

        // let maxData = Math.max.apply( Math, opts.series[0].data );
        // opts.yAxis[0].max = maxData;
        // opts.yAxis[0].min = 0;

        return {
          area: item.area,
          uvFormat: item.uvFormat,
          options: opts
        }
      })
      this.curData = data
    }
  }
}
</script>
