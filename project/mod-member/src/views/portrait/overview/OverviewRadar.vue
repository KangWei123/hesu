<template>
  <div class="dmp_echart_item">
    <div v-if="dataLength < 3" class="other">
      <span
        v-for="(p, index) in pieTitle"
        :key="index"
        class="other_tip"
        :title="p.tip"
        :class="{ w100: dataLength === 1, w50: dataLength === 2 }"
        v-html="p.text"
      >
      </span>
    </div>
    <div class="dmp_echart_content" :class="{ true: 'dmp_echart_other', false: '' }[dataLength < 3]"></div>
    <div class="dmp_echart_empty" v-show="!hasData && !loading">
      <!--<i class="fa fa-search"></i>-->
      没有查询到数据!
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts';

  // 雷达图
  export default {
    props: ['data', 'loading'],
    data() {
      return {
        selector: '.dmp_echart_content',
        pieTitle: [],
        dataLength: 0,
      };
    },
    mounted() {
      this.initChart();
      this.toggleLoading(true);
      window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.resize);
    },
    computed: {
      hasData() {
        return Array.isArray(this.data) && this.data.length;
      },
    },
    methods: {
      // 标题格式化，fname + 条件
      formatFname(itemData, tip, isEchart) {
        let list = itemData.name;

        if (!tip) {
          if (list.length > 8) {
            list = list.slice(0, 8) + '...';
          }
        }

        return list;
      },
      // 饼图参数
      setSeries(data) {
        const ary = [];
        let name = '';
        let center = [];

        this.pieTitle = [];
        data.map((key, index) => {
          if (data.length === 1) {
            center = ['50%', '35%'];
          } else {
            center = index === 0 ? ['25%', '35%'] : ['73.5%', '35%'];
          }

          this.pieTitle.push({
            text: this.formatFname(key),
            tip: this.formatFname(key, 1),
          });

          name = key.rate === '0.00' ? '0%' : key.rate + '%';

          ary.push({
            name: this.formatFname(key),
            type: 'pie',
            radius: ['35%', '40%'],
            center: center,
            label: {
              normal: {
                position: 'center',
                textStyle: {
                  color: '#666',
                  fontSize: 26,
                },
                formatter: '{b}',
              },
            },
            data: [
              {
                name: name,
                value: key.rate / 100,
                itemStyle: {
                  normal: {
                    color: index === 0 ? '#fb95b4' : '#f9b7a1',
                  },
                },
              },
              {
                value: key.rate === '0.00' ? 1 : 1 - key.rate / 100,
                name: key.fuserCount,
                // label: {
                //   normal: {
                //     formatter: '\n人群占比',
                //     textStyle: {
                //       color: '#ccc',
                //       fontSize: 15
                //     }
                //   }
                // },
                tooltip: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: '#dfe2e3',
                  },
                },
              },
            ],
          });
        });
        return ary;
      },
      getOptions(data) {
        if (!this.hasData) {
          return null;
        }

        const dataArr = [];
        const dataTipArr = [];

        data.map(item => {
          if (item.fenabled) {
            dataArr.push(item);
            dataTipArr.push({
              name: item.name,
              fuserCount: item.count || 0,
              value: item.rate,
            });
          }
        });
        this.dataLength = dataArr.length;

        // 取得雷达图最大值
        const maxItem = dataArr.reduce(function (a, b) {
          return a.rate > b.rate ? a : b;
        });
        let maxRate = 100;

        if (maxItem && maxItem.frate) {
          maxRate = Math.ceil(maxItem.rate / 10) * 10 || 100;
        }

        const options = {
          grid: {
            top: 0,
          },
          tooltip: {
            backgroundColor: 'rgba(57,56,87,0.75)',
            borderColor: '#393857',
            borderWidth: 1,
            padding: 10,
            formatter: (params, ticket, callback) => {
              const text = ['<table class="ov_radar_tip_table">'];
              dataArr.map(item => {
                text.push(
                  '<tr><td class="tip_title">',
                  '<span class="ov_tip_icon"></span>',
                  this.formatFname(item) + '</td><td> 人群占比: ' + item.rate + '%</td></tr>'
                );
              });
              return text.join('');
            },
          },
          radar: {
            triggerEvent: true,
            shape: 'circle', // 控制形状为圆形
            indicator: dataArr.map((item, index) => {
              const ind = {
                name: this.formatFname(item, null, true),
                max: maxRate,
              };
              return ind;
            }),
            name: {
              formatter: function (v) {
                return v;
              },
              textStyle: {
                color: '#000',
                fontSize: 12,
              },
            },
            axisLine: {
              lineStyle: {
                type: 'solid',
                opacity: 0.3,
              },
            },
            splitLine: {
              lineStyle: {
                color: '#eee',
              },
            },
            splitArea: {
              areaStyle: {
                color: '#fff',
              },
            },
          },
          itemStyle: {
            normal: {
              color: '#4cd194',
            },
          },
          series: [
            {
              type: 'radar',
              symbol: 'none',
              areaStyle: {
                // 填充样式
                normal: {
                  shadowBlur: 3,
                  shadowColor: 'rgba(0,0,0,.1)',
                  shadowOffsetX: 0,
                  shadowOffsetY: 1,
                  opacity: 0.4,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#9B80D1' },
                    { offset: 0.6, color: '#f9a5ab' },
                    { offset: 1, color: '#F6A0A1' },
                  ]),
                },
              },
              itemStyle: {
                // 线条样式
                normal: {
                  lineStyle: {
                    width: 1,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: '#9B80D1' },
                      { offset: 0.6, color: '#f9a5ab' },
                      { offset: 1, color: '#F6A0A1' },
                    ]),
                  },
                },
              },
              data: [
                {
                  name: '占比分析',
                  value: dataArr.map(item => {
                    return item.rate;
                  }),
                },
              ],
            },
          ],
        };

        const others = {
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(57,56,87,0.75)',
            borderColor: '#393857',
            borderWidth: 1,
            padding: 10,
            formatter: function (params) {
              dataArr.map(item => {
                item.rate += '';
              });

              let htmlTooltip =
                '<div style="border-bottom: 1px solid rgba(255,255,255,.5); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px">' +
                params.seriesName +
                '</div>';

              htmlTooltip = htmlTooltip + '<span style="color: #ff0">人群占比：' + params.name + '</span><br>';

              return htmlTooltip;
            },
          },
          series: this.setSeries(dataArr),
        };

        return dataArr.length > 2 ? options : others;
      },
      initChart() {
        const dom = this.$el.querySelector(this.selector);
        this.echart = echarts.init(dom);
        this.toggleLoading(this.loading);
      },
      // 渲染图表
      render(options) {
        this.echart.setOption(options, true);
        this.toggleLoading(this.loading);
      },
      // window.resize
      resize() {
        window.clearTimeout(this.resizeTimer);
        this.resizeTimer = window.setTimeout(() => {
          this.echart.resize();
        }, 300);
      },
      // 显示或隐藏loading
      toggleLoading(value) {
        if (!this.echart) {
          return;
        }

        this.echart[value ? 'showLoading' : 'hideLoading']({
          effect: 'whirling',
        });
      },
    },
    watch: {
      // 数据变动时重新渲染图表
      data: {
        deep: true,
        handler(value) {
          if (value && value.length) {
            this.options = this.getOptions(value);
            this.render(this.options);
          }
        },
      },
      loading(value) {
        this.toggleLoading(value);
      },
    },
  };
</script>
<style scoped>
  .other {
    width: 96%;
    position: absolute;
    top: 65%;
    z-index: 100;
    font-size: 14px;
  }

  .other_tip {
    float: left;
    text-align: center;
  }
</style>
