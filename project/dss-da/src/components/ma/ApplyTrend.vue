<template>
  <div class="container">
    <div class="bar-action-box"><span class="da-block-title bar-title">今日小时趋势图</span></div>
    <div id="container" v-if="parenStackedArea"></div>
    <place-holder :height="300" v-else/>
  </div>
</template>

<script>
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';

  export default {
    name: '',
    props: ['parenStackedArea'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        temp: [],
        activevalue: [],
        newactivevalue: [],
        newparenStackedArea: {}
      };
    },
    watch: {
      parenStackedArea: {
        deep: true,
        handler() {
          if (this.parenStackedArea && this.parenStackedArea.length) {
            this.newparenStackedArea = this.parenStackedArea;
            setTimeout(() => {
              this.drawLine1();
            }, 10);
          }
        }
      }
    },
    mounted() {
      // 这个函数不能放在methods里，同个页面有多个相同组件，debounce会有影响
      this.resize = td.debounce(300, () => {
        if (this.echart) {
          if (this.$el.clientWidth) {
            this.echart.resize();
          }

          // 计算当前屏幕的宽度
          const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
          this.$emit('resize', width);
        }
      });

      window.addEventListener('resize', this.resize);
      this.newparenStackedArea = this.parenStackedArea;
      if (this.newparenStackedArea && this.newparenStackedArea.length) {
        this.drawLine1();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine1() {
        const margin = this.newparenStackedArea;
        //console.log(this.activevalue);
        const that = this;
        this.temp = Array.from(new Array(24).keys());
        //console.log(this.temp);
        let tempActive = [];
        let tempNeweActive = [];
        this.temp.forEach(function(value) {
          tempActive.push(0);
          tempNeweActive.push(0);
          let i = 0;
          for (i = 0; i < margin.length; i++) {
            if (value === margin[i].statHour) {
              tempActive[value] = margin[i].activeUserCnt;
              tempNeweActive[value] = margin[i].newActiveUserCnt;
            }
          }
        });

        that.activevalue = tempActive;
        that.newactivevalue = tempNeweActive;

        let dom = document.getElementById('container');
        this.echart = echarts.init(dom);
        // let app = {};
        let option = null;
        option = {
          // title: {
          //   text: '今日小时趋势图'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#999999'
              }
            }
          },
          legend: {
            data: ['访问人数', '新增访问'],
            show: true,
            right: 24,
            itemGap: 27,
            itemHeight: 16,
            itemWidth: 16,
            icon: 'rect',
            textStyle: {
              color: '#999999',
              fontSize: 14,
              fontFamily: 'PingFangSC-Regular'
            }
          },
          grid: {
            top: '42',
            left: '45',
            right: '47',
            bottom: '0%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCDDE0'
                }
              },
              axisLabel: {
                color: '#999999',
                fontFamily: 'PingFangSC-Regular',
                fontWeight: 400
              },
              axisTick: {
                length: 8,
                lineStyle: {
                  width: 2,
                  color: 'rgba(255,255,255,0.2)'
                }
              },
              data: [
                '00:00',
                '01:00',
                '02:00',
                '03:00',
                '04:00',
                '05:00',
                '06:00',
                '07:00',
                '08:00',
                '09:00',
                '10:00',
                '11:00',
                '12:00',
                '13:00',
                '14:00',
                '15:00',
                '16:00',
                '17:00',
                '18:00',
                '19:00',
                '20:00',
                '21:00',
                '22:00',
                '23:00'
              ]
            }
          ],
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: true,
                color: '#DCDDE0'
              },
              axisLine: {
                lineStyle: {
                  color: '#DCDDE0'
                }
              },
              axisLabel: {
                color: '#999999',
                fontFamily: 'PingFangSC-Regular',
                fontWeight: 400
              },
              minInterval: 1,
              show: true
            }
          ],
          series: [
            {
              name: '访问人数',
              type: 'line',
              stack: '总量1',
              color: '#2E8DFF',
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: 2
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba(46, 141, 255, 0.13)'
                }
              },
              data: this.activevalue,
              smooth: true
            },
            {
              name: '新增访问',
              type: 'line',
              stack: '总量2',
              color: '#37BE8F',
              symbol: 'none',
              lineStyle: {
                normal: {
                  width: 2
                }
              },
              areaStyle: {
                normal: {
                  color: 'rgba(55, 190, 143, 0.13)'
                }
              },
              data: this.newactivevalue,
              smooth: true
            }
          ]
        };
        if (option && typeof option === 'object') {
          this.echart.setOption(option, true);
        }
      }
    }
  };
</script>

<style scoped>
  .container{
    position:relative;
    background: #ffffff;
    border-radius: 4px;
    padding: 20px;
    box-sizing: border-box;
    margin-top:20px;
  }
  #container{
    height: 400px;
    width:100%;
  }
  .bar-action-box{
      position: absolute;
      top: 15px;
      vertical-align: top;
      z-index: 1;
      span{
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: #222b4d;
        line-height: 22px;
        margin-right: 31px;
      }
    }
</style>
