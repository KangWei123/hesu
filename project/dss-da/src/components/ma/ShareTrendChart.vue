<template>
  <div class="container">
    <div class="bar-action-box"><span class="da-block-title bar-title">活跃趋势图</span></div>
    <div id="container" v-if="parenStackedArea && parenStackedArea.length"></div>
    <place-holder :height="300" v-else/>
  </div>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: '',
    props: ['parenStackedArea', 'strDateRange'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        temp: [],
        activevalue: [],
        newactivevalue: [],
        newparenStackedArea: [],
        downcontent: [],
        fixXAxisData: [],
        margin: []
      };
    },
    watch: {
      parenStackedArea: function() {
        this.fixXAxisData = this.getBetweenDateStr(this.strDateRange[0], this.strDateRange[1]);
        if (this.parenStackedArea && this.parenStackedArea.length) {
          this.newparenStackedArea = this.parenStackedArea;
          setTimeout(() => {
            this.drawLine1();
          }, 10);
        }
      },
      strDateRange: function() {
        this.fixXAxisData = this.getBetweenDateStr(this.strDateRange[0], this.strDateRange[1]);
        if (this.parenStackedArea && this.parenStackedArea.length) {
          this.newparenStackedArea = this.parenStackedArea;
          setTimeout(() => {
            this.drawLine1();
          }, 10);
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
        let AxisData = [];
        this.fixXAxisData.forEach(item => {
          let store = null;
          this.newparenStackedArea.forEach(it => {
            if (it.statDate === item) {
              store = it;
            }
          });
          if (store === null) {
            AxisData.push({
              statDate: item,
              shareNum: 0,
              shareUserNum: 0
            });
          } else {
            AxisData.push(store);
          }
        });
        this.margin = AxisData;
        const that = this;
        let tempdowncontent = [];
        let tempActive = [];
        let tempNeweActive = [];

        this.margin.forEach(item => {
          tempdowncontent.push(item.statDate);
          tempActive.push(item.shareNum);
          tempNeweActive.push(item.shareUserNum);
        });

        that.downcontent = tempdowncontent;
        that.activevalue = tempActive;
        that.newactivevalue = tempNeweActive;

        let dom = document.getElementById('container');
        this.echart = echarts.init(dom);
        // let app = {};
        let option = null;
        option = {
          // title: {
          //   text: '活跃趋势图'
          // },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            },
            selectedMode: 'single'
          },
          legend: {
            data: ['分享次数', '分享人数'],
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
            },
            selectedMode: 'single'
          },
          toolbox: {
            // feature: {
            //   saveAsImage: {}
            // }
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
              data: this.downcontent
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
              name: '分享次数',
              type: 'line',
              stack: '总量',
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
              smooth: false
            },
            {
              name: '分享人数',
              type: 'line',
              stack: '总量',
              color: '#487CED',
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
              data: this.newactivevalue,
              smooth: false
            }
          ]
        };
        if (option && typeof option === 'object') {
          this.echart.setOption(option, true);
        }
      },
      getBetweenDateStr(start, end) {
        let result = [];
        let beginDay = start.split('-');
        let endDay = end.split('-');
        let diffDay = new Date();
        let dateList = new Array();
        let i = 0;
        diffDay.setDate(beginDay[2]);
        diffDay.setMonth(beginDay[1] - 1);
        diffDay.setFullYear(beginDay[0]);
        result.push(start);
        while (i == 0) {
          let countDay = diffDay.getTime() + 24 * 60 * 60 * 1000;
          diffDay.setTime(countDay);
          dateList[2] = diffDay.getDate();
          dateList[1] = diffDay.getMonth() + 1;
          dateList[0] = diffDay.getFullYear();
          if (String(dateList[1]).length == 1) {
            dateList[1] = '0' + dateList[1];
          }
          if (String(dateList[2]).length == 1) {
            dateList[2] = '0' + dateList[2];
          }
          result.push(dateList[0] + '-' + dateList[1] + '-' + dateList[2]);
          if (dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]) {
            i = 1;
          }
        }
        // console.log(result);
        return result;
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
    position:relative;
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
