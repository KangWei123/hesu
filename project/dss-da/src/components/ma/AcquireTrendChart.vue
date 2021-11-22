<template>
  <div class="container">
    <div class="bar-action-box"><span class="da-block-title bar-title">趋势图</span></div>
    <div id="container" v-if="parentrendmap && parentrendmap.length"></div>
    <place-holder :height="300" v-else/>
  </div>
</template>

<script>
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import echarts from 'echarts';
  import td from 'throttle-debounce';
  export default {
    name: '',
    props: ['parentrendmap'],
    components: {
      PlaceHolder
    },
    data() {
      return {
        newparentrendmap: {},
        downcontent: [],
        temptype: []
      };
    },
    watch: {
      parentrendmap: function() {
        this.newparentrendmap = this.parentrendmap;
        if (this.parentrendmap && this.parentrendmap.length) {
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
      this.newparentrendmap = this.parentrendmap;
      if (this.parentrendmap && this.parentrendmap.length) {
        this.drawLine1();
      }
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    methods: {
      drawLine1() {
        const margin = this.newparentrendmap;
        const that = this;
        let tempdowncontent = []; //获取下标所有出现的日期
        let temptype = []; //获取所有可能出现的场景

        margin.forEach(function(value) {
          if (!tempdowncontent.includes(value.statDate)) {
            tempdowncontent.push(value.statDate);
          } //获取下标所有出现的日期
          if (!temptype.includes(value.scenceValueDesc)) {
            temptype.push(value.scenceValueDesc);
          } //获取所有可能出现的场景
        });

        //生成对应的二维数组
        let typearray = new Array();
        for (let k = 0; k < temptype.length; k++) {
          typearray[k] = new Array();
          for (let t = 0; t < tempdowncontent.length; t++) {
            typearray[k][t] = '';
          }
        }

        //给二维数组填充值
        for (let i = 0; i < temptype.length; i++) {
          for (let j = 0; j < tempdowncontent.length; j++) {
            margin.forEach(function(value) {
              //场景值一
              if (temptype[i] === value.scenceValueDesc && tempdowncontent[j] === value.statDate) {
                typearray[i][j] = parseFloat(value.visitNumRate * 100).toFixed(2);
              }
            });
            if (!typearray[i][j]) {
              typearray[i][j] = 0;
            }
          }
        }

        that.downcontent = tempdowncontent;
        that.temptype = temptype;
        that.typearray = typearray;

        // console.log(that.typearray);
        let dom = document.getElementById('container');
        this.echart = echarts.init(dom);
        // app.title = '堆叠条形图';
        let option = {
          color: [
            '#B386F2',
            '#1C4EDD',
            '#2DAAFF',
            '#d48265',
            '#91c7ae',
            '#749f83',
            '#ca8622',
            '#bda29a',
            '#6e7074',
            '#546570',
            '#c4ccd3'
          ],
          tooltip: {
            trigger: 'axis',
            show: true,
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
            // formatter: function(datas) {
            //   let res = datas[0].name + '<br/>',
            //     val;
            //   for (let i = 0, length = datas.length; i < length; i++) {
            //     val = datas[i].value + '%';
            //     res += datas[i].seriesName + '：' + val + '<br/>';
            //   }
            //   return res;
            // }
          },
          legend: {
            data: this.temptype,
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
            left: '45',
            right: '47',
            bottom: '24',
            top: '42',
            containLabel: true,
            borderColor: 'white' /*白色隐藏border*/,
            show: true /*是否展示网格线*/
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#999999',
              fontFamily: 'PingFangSC-Regular',
              fontWeight: 400,
              interval: 'auto',
              formatter: '{value}% '
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#DCDDE0'
              }
            }
          },
          xAxis: {
            nameTextStyle: {
              color: '#999999',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'PingFangSC-Regular'
            },
            axisTick: {
              show: false /*是否展示x轴刻度*/
            },
            axisLabel: {
              color: '#999999',
              fontFamily: 'PingFangSC-Regular',
              fontWeight: 400
            },
            axisLine: {
              show: true /*是否展示x轴线*/,
              lineStyle: {
                color: '#DCDDE0'
              }
            },
            data: this.downcontent
          },
          series: getdata(this.typearray, this.temptype)
        };
        function getdata(typearray, temptype) {
          let seriesdata = [];
          for (let i = 0; i < 5; i++) {
            let obj = {
              name: temptype[i],
              type: 'bar',
              stack: '总量',
              barCategoryGap: '40%',
              label: {
                normal: {
                  show: false,
                  fontSize: '14px',
                  textOutline: 'none',
                  color: '#ffffff',
                  position: 'inside',
                  formatter: function(params) {
                    if (params.value) {
                      return params.value + '%';
                    } else {
                      return '';
                    }
                  }
                }
              },
              itemStyle: {
                barBorderRadius: 0
              },
              barMaxWidth: '50',
              data: typearray[i]
            };
            seriesdata.push(obj);
          }
          return seriesdata;
        }
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
