<template>
  <div class="analysis-box invalid-reason">
    <div class="analysis-title">
      无效客户来源分析
      <span style="color: #999; font-size: 12px; padding-left: 10px">更新时间：{{ updateTime | time }}</span>
    </div>
    <div v-loading="loading">
      <Chart ref="chart" :options="chartOptions" height="300px" v-if="list && list.length"></Chart>
      <PlaceHolder :height="300" v-else />
    </div>
  </div>
</template>

<script>
  import Chart from '@/dss-common/components/ChartEmpty';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import { treemap } from '@/dss-common/assembler/index.js';
  import api from '@/mod-member/src/api/manage.js';

  export default {
    name: 'InvalidChannel',
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
    methods: {
      getData() {
        this.loading = true;
        api
          .getInvalidChannelData({
            storeId: this.currentStore,
          })
          .then(res => {
            this.updateTime = (res.data || [])[0].lastStatTime;
            this.list = (res.data || [])
              .filter(item => item.invalidClientCount)
              .map((item, index) => {
                return {
                  name: item.source || '',
                  num: item.invalidClientCount || 0,
                  value: item.proportion || 0,
                };
              });
            this.setOptions();
          })
          .always(() => {
            this.loading = false;
          });
      },
      setOptions() {
        const opts = treemap.assembleTreemapOptions([
          {
            type: 'treemap',
            data: this.list,
          },
        ]);
        opts.color = [
          '#3A8BFB',
          '#70D2DF',
          '#73DDC8',
          '#95DAFF',
          '#80CDEE',
          '#80A4EE',
          '#97E7A6',
          '#BEEE8D',
          '#D9EE83',
          '#FAE155',
          '#FFF2A8',
          '#FFD69E',
          '#675FDB',
          '#A26CDD',
          '#C95CCF',
          '#DDB3F0',
          '#E65A5A',
          '#ED8873',
          '#F08F50',
          '#F084BB',
        ];
        (opts.tooltip = {
          show: true,
          trigger: 'item',
          confine: true,
          position(point, params, dom, rect, size) {
            return {
              top: point[1] - size.contentSize[1] + 'px',
              left: point[0] - Math.ceil(size.contentSize[0] / 2) + 'px',
            };
          },
          backgroundColor: 'transparent',
          formatter: (params, ticket, callback) => {
            const length = params.name.length;
            let a = '';
            let b = '';
            if (length > 12) {
              a = params.name.substring(0, parseInt(length / 2));
              b = params.name.substring(parseInt(length / 2), length);
            } else {
              a = params.name;
              b = '';
            }
            return `
            <div style="position:relative;text-align:center;padding:23px;background-color:#000;opacity:0.78;border-radius:4px" id="toolTipBox">
              <p style="font-size:12px;margin-bottom:23px;color:#fff";>${a}<br>${b}</p>
              <p style="font-size:12px;margin:0px;color:#fff">占比
                <span style="color:#40C6F5;display:inline-block;margin-left:10px">${(params.value * 100).toFixed(
                  2
                )}%</span>
              </p>
              <p style="font-size:12px;margin:0px;color:#fff">无效客户数
                <span style="color:#40C6F5;display:inline-block;margin-left:10px">${params.data.num}人</span>
              </p>
              <p style="position:absolute;bottom:-5px;padding:0;width:0;height:0;left:0;right:0;margin:auto;opacity:0.78;border:5px solid #000;transform:rotate(45deg)"></p>
            </div>
            `;
          },
        }),
          (this.chartOptions = opts);
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
