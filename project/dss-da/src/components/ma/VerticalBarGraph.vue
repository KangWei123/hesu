<template>
  <div id="simplebar1" v-if="user_age && user_age.length"></div>
  <place-holder v-else
                :height="300" />
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: 'simplebar1',
    props: ['user_age'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        newuser_age: [],
        age: [],
        rate: [],
        temp: []
      };
    },
    watch: {
      user_age: function() {
        if (this.user_age && this.user_age.length) {
          this.newuser_age = this.user_age;
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
      this.newuser_age = this.user_age;
      if (this.user_age && this.user_age.length) {
        this.drawLine1();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine1() {
        const margin = this.newuser_age;
        const that = this;
        let tempscenceValueDesc = [];
        let tempvisitNumRate = [];
        for (let value in margin) {
          tempscenceValueDesc.push(margin[value].tagValue);
          tempvisitNumRate.push(parseFloat(margin[value].userPercent * 100).toFixed(2));
        }
        that.age = tempscenceValueDesc;
        that.rate = tempvisitNumRate;

        let dom = document.getElementById('simplebar1');
        this.echart = echarts.init(dom);
        // app.title = '堆叠条形图';
        let option = {
          xAxis: {
            type: 'category',
            data: this.age,
            axisLabel: {
              interval: 0 /*设置x轴的每个值都显示*/,
              color: '#333333',
              fontSize: 12,
              fontWeight: 400,
              fontFamily: 'PingFangSC-Regular'
            },
            axisTick: {
              show: false /*是否展示x轴刻度*/
            },
            axisLine: {
              show: false /*是否展示x轴线*/,
              lineStyle: {
                color: '#DCDDE0'
              }
            }
          },
          yAxis: [
            {
              type: 'value',
              nameTextStyle: {
                //设置y轴的数据样式
                color: '#333333',
                fontSize: 12,
                fontWeight: 400,
                fontFamily: 'PingFangSC-Regular'
              },
              axisTick: {
                show: false /*是否展示y轴刻度*/
              },
              splitLine: {
                show: false /*是否展示y轴分割线*/
              },
              axisLine: {
                show: false /*是否展示y轴线*/,
                lineStyle: {
                  color: '#DCDDE0'
                }
              },
              axisLabel: {
                show: false /*是否展示y轴label*/,
                lineStyle: {
                  color: '#DCDDE0'
                }
              }
            }
          ],
          grid: {
            left: '45',
            right: '47',
            bottom: '24',
            top: '42',
            containLabel: true,
            borderColor: 'white' /*白色隐藏border*/,
            show: false /*是否展示网格线*/
          },
          series: [
            {
              type: 'bar',
              barWidth: 12,
              barMaxWidth: '12px',
              barGap: '-100%',
              data: this.rate,
              label: {
                normal: {
                  show: true,
                  fontSize: 12,
                  position: 'top',
                  formatter: '{c}%'
                }
              },
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#5BC1FF' },
                    { offset: 1, color: '#2E8DFF' }
                  ]),
                  barBorderRadius: 12
                }
              }
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
  #simplebar1{
    height:300px;
  }
</style>
