<template>
  <chart :options="options"></chart>
</template>

<script>
import '../utils/china'
import Chart from './Chart'
import { provinceData, cityData } from '../utils/data'
import utils from '../utils'

export default {
  props: {
    // 当前选中的区域（0省份、1城市、2区
    type: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: []
    },
    minDate: {
      type: String,
      default: ''
    },
    maxDate: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      options: {}
    }
  },
  components: { Chart },
  methods: {
    //根据data得到每个data中城市的坐标
    convertData(data) {
      let geoCoordMap = cityData
      let res = []
      for (let i = 0; i < data.length; i++) {
        let geoCoord = geoCoordMap[data[i].name]
        if (geoCoord) {
          let size = data[i].value ? 20 * (data[i].value / data[0].value) : 0
          res.push({
            name: data[i].name,
            value: geoCoord.concat(data[i].value),
            area: data[i].area,
            // 散点大小
            symbolSize: size > 14 ? 14 : size < 8 ? 8 : size
          })
        }
      }
      return res
    },
    getOption () {
                  // 省份
      if (this.type === 0) {
        const opts = {
          tooltip: {
            trigger: 'item',
            // formatter: '{b}: {c}%'
            formatter(params) {
              return `${params.seriesName}</br>${params.name}: ${params.value ? utils.addSeparator(params.value) : '-'}`
            }
          },
          visualMap: {
            show: false,
            textStyle: {
              color: '#39393a'
            },
            min: 0,
            max: 1000,
            left: 10,
            bottom: 70,
            text: ['高', '低'], // 文本，默认为数值文本,
            calculable: false,
            color: ['#246efc', '#4e85ed']
          },
          series: [
            {
              name: null,
              type: 'map',
              mapType: 'china',
              roam: false,
              itemStyle: {
                normal: {
                  areaColor: '#e1e5eb',
                  borderColor: '#fff'
                },
                emphasis: {
                  // areaColor: '#adadad'
                }
              },
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              data: null
            }
          ]
        }

        opts.series[0].data = this.data.map(item => ({
          name: item && item.storeProv && item.storeProv.replace(/省$|市$|自治区$|[壮族|维吾尔|回族]+自治区$/g, ''),
          value: item && item.uv
        }))

        opts.visualMap.max = opts.series[0].data[0].value
        opts.series[0].name = `${this.minDate}~${this.maxDate}`
        return opts
      }

      // 城市
      if (this.type === 1 || this.type === 2) {
        const opts = {
          backgroundColor: '#fff',
          tooltip: {
            trigger: 'item',
            formatter: null
          },
          geo: {
            map: 'china',
            // regions: [{name: '南海诸岛', value: 0, itemStyle: {normal: {opacity: 0, label: {show: false}}}}],
            label: {
              emphasis: {
                show: false
              }
            },
            roam: false,
            itemStyle: {
              normal: {
                areaColor: '#e1e5eb',
                borderColor: '#fff'
              },
              emphasis: {
                areaColor: '#e1e5eb'
              }
            }
          },
          series: [
            {
              name: null,
              type: 'scatter',
              coordinateSystem: 'geo',
              data: null,
              // symbolSize (val) {
              //     return Math.max(val[2] / 10, 10);
              // },
              // showEffectOn: 'render',
              // rippleEffect: {
              //     period: 0,
              //     brushType: 'stroke'
              // },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: '{b}',
                  position: 'right',
                  color: '#fff',
                  show: false
                },
                emphasis: {
                  // formatter: '{b}',
                  position: 'right',
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  color: '#246efc'
                  // shadowBlur: 20,
                  // shadowColor: '#333'
                }
              },
              zlevel: 1
            }
          ]
        }

        let cityData = this.data.map(item => {
          return {
            name: item && item.storeCity && item.storeCity.replace(/市$|市市辖区$/g, ''),
            value: item && item.uv,
            area: item.storeArea
          }
        })
        opts.series[0].data = this.convertData(cityData)

        if (this.type === 1) {
          opts.tooltip.formatter = params => {
            if (params.data.value) {
              return `${params.seriesName}</br>${params.data.name}: ${utils.addSeparator(params.data.value[2])}`
            }
          }
        } else {
          opts.tooltip.formatter = params => {
            if (params.data.value) {
              return `${params.seriesName}</br>${params.data.area}: ${utils.addSeparator(params.data.value[2])}`
            }
          }
        }
        opts.series[0].name = `${this.minDate}~${this.maxDate}`
        return opts
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      handler() {
        this.options = this.getOption()
      }
    }
  }
}
</script>
