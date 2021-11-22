<template>
  <div v-loading="loading">

    <chart height="340px"
           :options="option"
           v-if="list&&list.length"></chart>

    <place-holder :height="340"
                  v-else />
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty.vue';
import echarts from 'echarts';
import services from '@/dss-common/utils/services';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
const config = [
  {
    borderWidth: 12,
    textSize: 12,
    subTextSize: 8,
    size: 100
  },
  {
    borderWidth: 12,
    textSize: 12,
    subTextSize: 8,
    size: 120
  },
  {
    borderWidth: 12,
    textSize: 12,
    subTextSize: 8,
    size: 130
  },
  {
    borderWidth: 15,
    textSize: 17,
    subTextSize: 12,
    size: 140
  },
  {
    borderWidth: 15,
    textSize: 19,
    subTextSize: 13,
    size: 160
  },
  {
    borderWidth: 20,
    textSize: 24,
    subTextSize: 16,
    size: 180
  }
];

export default {
  components: {
    Chart,
    PlaceHolder
  },
  data() {
    return {
      option: null,
      positions: [],
      list: [],
      loading: false
    };
  },
  props: {
    // 查询数据接口地址
    url: {
      type: String,
      default() {
        return '';
      }
    },

    // 接口参数
    queryParams: {
      type: Object,
      default() {
        return null;
      }
    },
    // 字段
    field: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    queryParams: {
      deep: true,
      handler() {
        this.getData();
      }
    }
  },
  mounted() {},
  methods: {
    getData() {
      this.loading = true;
      let params = this.queryParams;
      services
        .get(this.url, {
          params,
          action: '获取气泡图数据'
        })
        .then(res => {
          this.list = res.data;
          this.getField();
          this.getOption();
        })
        .always(() => {
          this.loading = false;
        });
    },
    getField(data) {
      this.list.forEach(item => {
        item.categoryName = item[this.field[0]];
        item.saleFee = item[this.field[1]];
        item.saleFeeRate = item[this.field[2]];
      });
    },
    getOption() {
      const formatData = this.formatData(this.list);
      this.option = {
        grid: {
          show: false,
          top: 5,
          left: 50,
          bottom: 50
        },
        xAxis: {
          gridIndex: 0,
          type: 'value',
          min: 0,
          max: 20,
          show: false
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 8,
          gridIndex: 0,
          show: false
        },
        series: [
          {
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 120,
            z: 2,
            label: {
              normal: {
                show: true,
                formatter: '{b}',
                color: '#fff',
                textStyle: {
                  fontSize: '12'
                }
              }
            },
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                  { offset: 0, color: '#a04cf7e0' },
                  { offset: 1, color: '#B386F2' }
                ])
              }
            },
            data: formatData.data
          },
          {
            type: 'scatter',
            symbol: 'circle',
            symbolSize: 120,
            silent: true,
            z: 1,
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: 'rgba(227, 214, 246, 1)'
              }
            },
            data: formatData.shadow
          }
        ]
      };
      console.log(this.option);
    },

    random(min, max) {
      let range = max - min;
      let num = min + parseFloat((Math.random() * range).toFixed(3));
      return num;
    },
    getPosition(data) {
      const list = [
        { x: '3', y: '1.5' },
        { x: '1.28', y: '4.172' },
        { x: '4.349', y: '5.912' },
        { x: '10.666', y: '3.385' },
        { x: '12.081', y: '6.422' },
        { x: '9.16', y: '6.532' },
        { x: '18.858', y: '5.05' },
        { x: '0.404', y: '6.431' },
        { x: '0.198', y: '0.995' },
        { x: '6.675', y: '2.205' },
        { x: '21', y: '4.587' },
        { x: '7.693', y: '5.61' },
        { x: '14.424', y: '5.561' },
        { x: '8.962', y: '1.235' },
        { x: '16.909', y: '1.86' },
        { x: '14.726', y: '1.076' },
        { x: '12.53', y: '2.22' },
        { x: '16.634', y: '4.91' },
        { x: '11', y: '6.477' },
        { x: '20', y: '1.177' },
        { x: '21', y: '5.477' },
        { x: '13.5', y: '6.877' },
        { x: '18', y: '2.477' },
        { x: '20', y: '1.977' },
        { x: '2.3', y: '6.8' },
        { x: '12.234', y: '4.61' }
      ];
      if (this.positions.length !== data.length) {
        this.positions = list;
      }
    },
    formatData(data) {
      let min = null;
      let max = null;
      data.forEach(item => {
        if (!min) {
          min = item.saleFee;
          max = item.saleFee;
          return;
        }
        min = Math.min(min, item.saleFee);
        max = Math.max(max, item.saleFee);
      });

      this.getPosition(data);

      const step = (max - min) / config.length || 1;
      const list = [];
      const shadowList = [];
      data.forEach((item, i) => {
        let index = 0;
        if (stop === 0) {
          index = config.length - 1;
        } else {
          const tem = parseInt((item.saleFee - min) / step) - 1;
          if (tem < 0) {
            index = 0;
          } else if (tem >= config.length) {
            index = config.length - 1;
          } else {
            index = tem;
          }
        }
        let position;
        if (this.positions[i]) {
          position = [this.positions[i].x, this.positions[i].y, item.saleFee];
        } else {
          position = [this.random(0, 20), this.random(0, 8), item.saleFee];
        }
        const render = config[index];
        shadowList.push({
          name: '',
          value: position,
          symbolSize: render.size + render.borderWidth
        });
        let name = this.field[3] || '销售额';
        list.push({
          name:
            item.categoryName +
            '\n\n' +
            name +
            '：' +
            item.saleFee +
            '\n\n占比：' +
            (item.saleFeeRate * 100).toFixed(1) +
            '%',
          value: position,
          symbolSize: render.size,
          label: {
            normal: {
              align: 'center',
              textStyle: {
                fontSize: 11
              }
            }
          }
        });
      });
      return {
        data: list,
        shadow: shadowList,
        min,
        max
      };
    }
  }
};
</script>

<style>
.test {
  color: #81fff0;
}
</style>
