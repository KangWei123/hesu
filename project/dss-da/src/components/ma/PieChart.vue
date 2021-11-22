<template>
  <div>
    <div id="cladevice" v-if="parencladevice && parencladevice.length" style="height:300px;"></div>
    <place-holder v-else
                  :height="300" />
  </div>

</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: 'cladevice',
    props: ['parencladevice'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        newparencladevice: {},
        newdata: []
      };
    },
    watch: {
      parencladevice: {
        deep: true,
        handler() {
          this.newparencladevice = this.parencladevice;
          if (this.newparencladevice && this.newparencladevice.length) {
            setTimeout(() => {
              this.drawLine3();
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

      this.newparencladevice = this.parencladevice;
      if (this.newparencladevice && this.newparencladevice.length) {
        this.drawLine3();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine3() {
        const margin = this.newparencladevice;
        const that = this;

        let tempArr = [];

        if (margin.length > 10) {
          for (let i = 0; i < 10; i++) {
            tempArr.push({
              value: parseFloat(margin[i].userPercent).toFixed(2),
              name: margin[i].tagValue.slice(0, 14)
            });
          }
        } else {
          for (let val of margin) {
            tempArr.push({
              value: parseFloat(val.userPercent * 100).toFixed(2),
              name: val.tagValue.slice(0, 10)
            });
          }
        }

        that.newdata = tempArr;

        let dom = document.getElementById('cladevice');
        this.echart = echarts.init(dom);
        let option = {
          // title: {
          //   text: '用户设备品牌占比',
          //   left: 'left'
          // },
          textStyle: {
            fontSize: 16,
            color: '#2C3641'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : ({d}%)'
          },
          color: [
            '#4379ED',
            '#FF7F56',
            '#FFDE74',
            // '#FF5B56',
            '#7274F1',
            '#60CBEE',
            '#189BFC',
            '#5BECBD',
            '#FFAE4C',
            '#BEA06D',
            '#695E4E'
          ],
          legend: {
            icon: 'circle',
            textStyle: {
              color: '#333333',
              fontSize: 12,
              fontWeight: 400,
              fontFamily: 'PingFangSC-Regular'
            },
            orient: 'horizontal', //垂直：vertical； 水平 horizontal
            bottom: 'bottom',
            right: 'right'
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['40%', '50%'],
              selectedMode: 'single',
              hoverAnimation: false,
              data: this.newdata,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },
              label: {
                normal: {
                  show: false,
                  position: 'center'
                }
                // normal: {
                //   formatter: '{b}\n{c}'
                // }
              },
              //引导线
              labelLine: {
                normal: {
                  show: false,
                  length: 30
                }
              }
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
