<template>
  <div class="div-box">
    <div id="clauser" ref="chart" v-if="parenclauser && parenclauser.length"  style="height:300px;"></div>
    <place-holder :height="300" v-else/>
  </div>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: 'clauser',
    props: ['parenclauser'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        newparenclauser: [],
        baifenbi: [],
        city: [],
        temp: []
      };
    },
    watch: {
      parenclauser: {
        deep: true,
        handler() {
          if (this.parenclauser && this.parenclauser.length) {
            this.newparenclauser = this.parenclauser;
            setTimeout(() => {
              this.drawLine2();
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
      this.newparenclauser = this.parenclauser;
      if (this.newparenclauser && this.newparenclauser.length) {
        this.drawLine2();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine2() {
        const margin = this.newparenclauser;
        const that = this;
        let tempscenceValueDesc = [];
        let tempvisitNumRate = [];
        for (let value in margin) {
          tempscenceValueDesc.push(margin[value].scenceValueDesc);
          tempvisitNumRate.push(margin[value].visitNumRate);
        }

        that.city = tempscenceValueDesc;
        that.baifenbi = tempvisitNumRate;
        let baifenbi = that.baifenbi;
        // let grayBar = [1, 1, 1, 1, 1];
        // let paiming = [5, 4, 3, 2, 1];
        // let zongjine = [91230000, 20000000, 30000000, 40000000, 50000000];
        let grayBar = [];
        let paiming = [];
        let zongjine = [];
        for (let i = that.baifenbi.length; i > 0; i--) {
          grayBar.push(1);
          zongjine.push(1);
          paiming.push(i);
        }
        let city = that.city;
        let dom = document.getElementById('clauser');
        // let dom = this.$refs.chart;
        this.echart = echarts.init(dom);
        let option = {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            {
              offset: 0,
              color: '#5BC1FF'
            },
            {
              offset: 1,
              color: '#2E8DFF'
            }
          ]),
          grid: {
            top: '19',
            bottom: '5',
            left: 150,
            right: 30
          },
          xAxis: [
            {
              show: false
            },
            //由于下边X轴已经是百分比刻度了,所以需要在顶部加一个X轴,刻度是金额,也隐藏掉
            {
              show: false
            }
          ],
          yAxis: {
            type: 'category',
            offset: 20,
            axisLabel: {
              interval: 0 /*设置x轴的每个值都显示*/,
              color: '#333333',
              fontSize: 12,
              fontWeight: 400,
              fontFamily: 'PingFangSC-Regular',
              show: true, //让Y轴数据不显示
              // color: '#00C5CD',
              rich: {
                start2: {
                  width: 18,
                  height: 22,
                  align: 'center'
                },
                start1: {
                  width: 18,
                  height: 22,
                  align: 'center'
                }
              },
              formatter: function(value) {
                //富文本固定格式{colorName|这里填你想要写的内容}
                //return value <= 3 ? '{start2|' + value + '}' : '{start1|' + value + '}';
              },
              padding: [5, 5, 5, 5]
            },
            itemStyle: {
              color: '#333333'
            },
            axisTick: {
              show: false //隐藏Y轴刻度
            },
            axisLine: {
              show: false //隐藏Y轴线段
            },
            data: paiming
          },
          series: [
            {
              show: true,
              type: 'bar',
              barGap: '-100%',
              barWidth: 12, //统计条宽度
              itemStyle: {
                normal: {
                  barBorderRadius: [10, 10, 10, 10]
                }
              },
              max: 1,
              label: {
                normal: {
                  show: true,
                  fontSize: 12,
                  color: '#333333',
                  textOutline: 'none',
                  height: 12,
                  padding: [2, 2, 0, 5],
                  textStyle: {
                    color: '#fff' //百分比颜色
                  },
                  position: 'insideRight',
                  //百分比格式
                  formatter: function(data) {
                    return (baifenbi[data.dataIndex] * 100).toFixed(2) + '%';
                  }
                }
              },
              // barMinHeight: 50,//设置最小展示长度
              labelLine: {
                show: false
              },
              z: 2,
              data: baifenbi
            },
            //数据条--------------------我是分割线君------------------------------//
            {
              show: true,
              type: 'bar',
              xAxisIndex: 1, //代表使用第二个X轴刻度!!!!!!!!!!!!!!!!!!!!!!!!
              barGap: '-100%',
              color: '#333333',
              barWidth: 12, //统计条宽度
              itemStyle: {
                normal: {
                  barBorderRadius: 20,
                  color: 'rgba(22,203,115,0.05)'
                }
              },
              label: {
                normal: {
                  show: true,
                  fontSize: 12,
                  textOutline: 'none',
                  height: 12,
                  padding: [2, 2, 0, 5],
                  position: 'left',
                  rich: {
                    //富文本
                    width: 80,
                    black: {
                      //自定义颜色
                      color: '#000'
                    },
                    green: {
                      color: '#70DDA7'
                    },
                    yellow: {
                      color: '#FEC735'
                    }
                  },
                  formatter: function(data) {
                    //富文本固定格式{colorName|这里填你想要写的内容}
                    return '{start2|}{black|' + '  ' + city[data.dataIndex] + '}';
                  }
                }
              },
              data: zongjine
            }
          ]
        };
        this.echart.setOption(option, true);
      }
    }
  };
</script>

<style scoped>
  /*div{*/
    /*font-size:16px;*/
    /*font-family:PingFangSC-Semibold;*/
    /*font-weight:600;*/
    /*color:rgba(44,54,65,1);*/
    /*line-height:22px;*/
    /*width:100%;*/
    /*height:300px;*/
    /*display:inline-block;*/
  /*}*/
</style>
