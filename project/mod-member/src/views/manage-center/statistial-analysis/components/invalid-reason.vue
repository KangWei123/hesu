<template>
  <div class="analysis-box invalid-reason">
    <div class="analysis-title">
      客户无效原因分析
      <span style="color: #999; font-size: 12px; padding-left: 10px">更新时间：{{ updateTime | time }}</span>
    </div>
    <div v-loading="loading">
      <Chart ref="chart" :options="chartOptions" height="300px" v-if="list && list.length" />
      <PlaceHolder :height="300" v-else />
    </div>
  </div>
</template>

<script>
  import Chart from '@/dss-common/components/ChartEmpty';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import { pie } from '@/dss-common/assembler/index.js';
  import api from '@/mod-member/src/api/manage.js';

  export default {
    name: 'InvalidReason',
    components: { Chart, PlaceHolder },
    props: {
      currentStore: null,
    },
    data() {
      return {
        updateTime: null,
        list: [],
        chartOptions: null,
        loading: false,
      };
    },
    watch: {
      currentStore() {
        this.getData();
      },
    },
    methods: {
      getData() {
        this.loading = true;
        api
          .getInvalidReasonData({
            storeId: this.currentStore,
          })
          .then(res => {
            this.updateTime = (res.data || [])[0].lastStatTime;
            this.list = (res.data || []).map(item => {
              return {
                name: item.invalidReason || '--',
                value: item.invalidClientCount || 0,
                id: item.invalidReasonId,
              };
            });
            if (this.list.length && this.list[0].id === 0) {
              this.list[0].name = '其他原因';
              this.list.push(this.list.splice(0, 1)[0]);
            }
            this.setOptions();
          })
          .always(() => {
            this.loading = false;
          });
      },
      setOptions() {
        const opts = pie.pie(this.list);
        const defaultColor = [
          // '#398BFB', '#FF9956', '#FFC656', '#FFD69E', '#F084BB', '#80A4EE'，
          '#4379ED',
          '#FF7F56',
          '#FFDE74',
          '#7274F1',
          '#60CBEE',
          '#189BFC',
          '#5BECBD',
          '#FFAE4C',
          '#BEA06D',
          '#695E4E',
        ];
        opts.series[0].radius = ['0', '60%'];
        opts.color = defaultColor;
        (opts.tooltip = {
          show: true,
          trigger: 'item',
          formatter: '{b} : {c}人 ({d}%)',
        }),
          (opts.legend = {
            show: true,
            orient: 'vertical',
            left: '55%',
            top: 'center',
            itemGap: 10,
            icon: 'circle',
            itemHeight: 9,
            itemWidth: 9,
            formatter: name => {
              const _obj = (this.list || []).find(item => item.name === name) || '';
              return ` {name|${name}}  {value|${_obj.value}}人`;
            },
            textStyle: {
              rich: {
                name: {
                  align: 'left',
                  color: '#999999',
                  fontSize: 12,
                },
                value: {
                  verticalAlign: 'top',
                  align: 'left',
                  color: '#404040',
                  fontSize: 14,
                },
              },
            },
          });
        // label
        opts.series[0].center = ['25%', '50%'];
        opts.series[0].label = {
          show: false,
        };
        this.chartOptions = opts;
      },
    },
    mounted() {
      this.getData();
    },
  };
</script>

<style lang="less" scoped>
  .invalid-reason {
    display: inline-block;
    width: 100%;
    vertical-align: middle;
    background: #ffffff;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    .pie-box {
      position: absolute;
      top: 100px;
      // right: 31px;
      left: 65%;
    }
    .pie-box span:nth-child(1) {
      font-size: 1.5rem;
      color: #404040;
    }
    .pie-box span:nth-child(3) {
      font-size: 0.8rem;
      color: #a8a8a8;
    }
  }
</style>
