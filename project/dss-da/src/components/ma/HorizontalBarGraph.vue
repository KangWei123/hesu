<template>
  <div id="simplebar2" v-if="user_educational && user_educational.length"></div>
  <place-holder v-else
                :height="300" />
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: 'simplebar2',
    props: ['user_educational'],
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
      user_educational: function() {
        if (this.user_educational && this.user_educational.length) {
          this.newuser_educational = this.user_educational;
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
      this.newuser_educational = this.user_educational;
      if (this.user_educational && this.user_educational.length) {
        this.drawLine1();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine1() {
        const margin = this.newuser_educational;
        const that = this;
        let tempscenceValueDesc = ['低', '中', '高'];
        let tempvisitNumRate = [0, 0, 0];
        for (let value in margin) {
          if (tempscenceValueDesc.includes(margin[value].tagValue)) {
            let valueP = tempscenceValueDesc.indexOf(margin[value].tagValue);
            tempvisitNumRate[valueP] = parseFloat(margin[value].userPercent * 100).toFixed(2);
          }
          // tempscenceValueDesc.push(margin[value].tagValue);
          // tempvisitNumRate.push(parseFloat(margin[value].userPercent * 100).toFixed(2));
        }
        that.age = tempscenceValueDesc;
        that.rate = tempvisitNumRate;

        let dom = document.getElementById('simplebar2');
        this.echart = echarts.init(dom);
        // app.title = '堆叠条形图';
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
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'none' },
            formatter: function(params) {
              let customSymbol = '';
              if (params[0].data && params[0].data.Symbol) {
                customSymbol = params[0].data.Symbol;
              }
              return params[0].name + ' : ' + customSymbol + params[0].value + '%';
            }
          },
          yAxis: {
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
              show: false //隐藏Y轴刻度
            },
            axisLine: {
              show: false //隐藏Y轴线段
            }
          },
          xAxis: {
            type: 'value',
            show: false
          },
          series: [
            {
              data: this.rate,
              type: 'bar',
              barWidth: 12,
              itemStyle: {
                normal: {
                  barBorderRadius: [10, 10, 10, 10]
                }
              },
              label: {
                normal: {
                  show: false,
                  fontSize: 12,
                  position: 'top',
                  textOutline: 'none',
                  // color: '#ffffff',
                  formatter: '{c}%'
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
  #simplebar2{
    height:300px;
  }
</style>
