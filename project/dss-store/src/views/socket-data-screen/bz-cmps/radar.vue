<template>
  <div class="radar-chart blue-shadow-box">
    <div class="box-title">
      {{title}}
    </div>
    <div class="chart-box">
      <chart :options="options"
            class="chart"
            v-if="value.length">
      </chart>
      <div class="no-data" v-else>暂无数据</div>
    </div>
    <slot name="decoration"></slot>
    <radar-tip v-if="title === '用户价值' && value.length"></radar-tip>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import RadarTip from './radar-tip.vue';
import options from './options.js';
import { setTimeout } from 'timers';

export default {
  components: { Chart, RadarTip },
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    title: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      options: {},
      value: [],
      indicator: []
    };
  },
  watch: {
    data(val, oVal) {
      if (val && val.memberId) {
        switch (this.title) {
          case '消费品类占比':
            this.getCategorySales(val);
            break;
          case '用户价值':
            this.getUserValue(val);
        }
      } else {
        this.value = [];
        this.indicator = [];
      }
    }
  },
  methods: {
    getCategorySales(row) {
      let data = [];
      let indicator = [];

      cameraFlowApi
        .getCategroySales({
          memberId: row.memberId
        })
        .then(res => {
          if (res.data && res.data.length < 3) return;
          res.data.forEach((item, index) => {
            indicator.push({
              text: item.categoryName,
              max: this.max
            });
            data.push(item.categoryProportion || 0);
          });
          this.options = options.getRadar(this.title, data, indicator);
        })
        .always(() => {
          this.value = data;
          this.indicator = indicator;
        });
    },
    getUserValue(row) {
      let data = [
        {
          name: '高购买力用户',
          value: [0, 0, 0, 0, 0, 0]
        },
        {
          name: '高忠诚度用户',
          value: [0, 0, 0, 0, 0, 0]
        },
        {
          name: '高促销敏感度用户',
          value: [0, 0, 0, 0, 0, 0]
        }
      ];
      let indicator = [];
      let legend = ['高购买力用户', '高忠诚度用户', '高促销敏感度用户'];

      let map = {
        timeScore: '最近消费时间',
        sumFeeScore: '消费金额',
        maxFeeScore: '单笔最高金额',
        promoteOrderScore: '促销商品占比',
        highGoodsScore: '高单价商品占比',
        orserScore: '消费频率'
      };

      cameraFlowApi
        .getUserValue({
          memberId: row.memberId
        })
        .then(res => {
          if (res.data && !Object.keys(res.data).length) return;
          for (let key in map) {
            indicator.push({
              text: map[key],
              max: this.max
            });
          }
          data[0].value[1] = res.data.sumFeeScore || 0;
          data[0].value[2] = res.data.maxFeeScore || 0;
          data[1].value[0] = res.data.timeScore || 0;
          data[1].value[5] = res.data.orserScore || 0;
          data[2].value[3] = res.data.promoteOrderScore || 0;
          data[2].value[4] = res.data.highGoodsScore || 0;
          this.options = options.getRadar(this.title, data, indicator, legend);
        })
        .always(() => {
          this.value = data;
          this.indicator = indicator;
        });
    }
  }
};
</script>

<style scoped lang="less">
.radar-chart {
  width: 100%;
  height: 100%;
  
  .chart-box {
    width: 100%;
    height: calc(100% - 43px);
  }

}
</style>
