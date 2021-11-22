<template>
  <div>
    <chart :options="options" height="250px" width="100%" v-if="data.length" style="margin: -30px auto 0 auto"></chart>
    <h2 v-else style="text-align: center;color: #ccc;font-weight: normal;font-size: 16px;">暂无数据</h2>
  </div>
</template>

<script>
import Chart from './Chart'
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    legend: {
      type: String,
      default: ''
    }
  },
  components: {
    Chart
  },
  computed: {
    options () {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color: [
          "#f3894f",
          "#fec400",
          "#28cc97",
          "#21b0df",
          "#0099ff",
          "#5b6378",
          "#f3694f"
        ],
        center: ['50%', '50%'],
        series: [
          {
            name: this.legend,
            type: 'pie',
            data: this.data.map(item => {
              return {
                name: item.portraitName,
                value: item.portraitCount
              }
            })
          }
        ]
      }
    }
  }
}
</script>
