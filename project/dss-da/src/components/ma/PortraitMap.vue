<template>
  <div id="clamap" v-if="user_life_city_province && user_life_city_province.length" style="height:300px;"></div>
  <place-holder v-else
                :height="300" />
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: 'clamap',
    props: ['user_life_city_province'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        newuser_life_city_province: {},
        newdata: []
      };
    },
    watch: {
      user_life_city_province: function() {
        if (this.user_life_city_province && this.user_life_city_province.length) {
          this.newuser_life_city_province = this.user_life_city_province;
          setTimeout(() => {
            this.drawLine();
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
      this.newuser_life_city_province = this.user_life_city_province;
      if (this.user_life_city_province && this.user_life_city_province.length) {
        this.drawLine();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine() {
        const margin = this.newuser_life_city_province;
        const that = this;

        let tempArr = [];
        for (let val of margin) {
          tempArr.push({
            value: parseFloat(val.userPercent * 100).toFixed(2),
            name: val.tagValue
          });
        }
        that.newdata = tempArr;
        // console.log(that.newdata);

        let dom = document.getElementById('clamap');
        this.echart = echarts.init(dom);
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: function(params) {
              // debugger;
              if (Number.isNaN(params.value)) {
                return params.name;
              } else {
                return params.name + ':' + params.value + '%';
              }
            }
          },
          visualMap: {
            type: 'continuous',
            min: 0,
            max: 100,
            left: 'left',
            top: 'bottom',
            realtime: false,
            text: ['高', '低'],
            formatter: function(value) {
              return value.toFixed(0) + '%'; // 范围标签显示内容。
            },
            inRange: {
              color: ['#e0ffff', '#006edd']
            },
            calculable: true
          },
          geo: {
            map: 'china',
            roam: true,
            itemStyle: {
              normal: {
                areaColor: '#e6ecf1',
                borderColor: '#fff'
              },
              emphasis: {
                areaColor: '#e2e2e2',
                borderColor: '#fff'
              }
            },
            label: {
              emphasis: {
                show: false
              }
            }
          },
          series: [
            {
              name: 'iphone',
              type: 'map',
              geoIndex: 0,
              // tooltip: {show: false},
              data: this.newdata
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
