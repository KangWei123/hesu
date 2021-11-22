<template>
  <div class="map-chart flow-card">
    <div class="title">
      {{title}}
    </div>
    <chart
      :options="options"
      class="chart"
      style="width: 60%"
    />
    <chart
      :options="barOption"
      class="chart"
      style="width: 40%"
    />
  </div>

</template>

<script>
import '@/dss-common/utils/china.js';
import { cityData } from '@/dss-common/utils/data.js';
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';

const temData = [
  {
    name: '广东',
    value: 80.2
  },
  {
    name: '山东',
    value: 1.9
  },
  {
    name: '香港特别行政区',
    value: 1.9
  },
  {
    name: '浙江',
    value: 1.9
  },
  {
    name: '上海',
    value: 0.9
  },
  {
    name: '湖南',
    value: 0.9
  },
  {
    name: '广西',
    value: 0.9
  },
  {
    name: '山西',
    value: 0.9
  },
  {
    name: '湖北',
    value: 0.9
  },
  {
    name: '福建',
    value: 0.9
  }
];

export default {
  components: { Chart },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    options() {
      let data = this.data.map(item => {
        return {
          name: item.province.replace(/(市|省)$/, ''),
          value: item.passengerRate
        };
      });

      return options.getMap(data, this.title, this.type);
    },
    barOption() {
      let data = [];
      let len = this.data.length;
      for (let i = 0; i < len && i < 10; i++) {
        const item = this.data[i];
        data.push({
          name: item.province,
          value: item.passengerRate
        });
      }
      return options.getBar(data, this.title, false);
    }
  }
};
</script>

<style scoped lang="less">
.map-chart {
  white-space: nowrap;

  /deep/ .chart {
    display: inline-block;
  }
}
</style>
