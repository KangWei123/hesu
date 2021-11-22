<template>
  <div class="track-chart">
    <chart :options="options"
           class="chart">
    </chart>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';

export default {
  components: { Chart },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      options: null
    };
  },
  watch: {
    data(newVal) {
      if (this.data) {
        this.getOptions();
      }
    }
  },
  mounted() {
    this.getOptions();
  },
  methods: {
    getOptions() {
      let list = this.data.map(item => {
        return { value: item.count, name: item.storeAreaName };
      });
      this.options = options.getFunnel(list);
    }
  }
};
</script>

<style scoped lang="less">
.track-chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  border-radius: 4px;

  .chart {
    margin-top: -40px;
    padding-top: 40px;
    box-sizing: border-box;
  }
}
</style>
