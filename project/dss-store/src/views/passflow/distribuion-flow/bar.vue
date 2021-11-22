<template>
  <div class="track-chart">
    <chart :options="options"
           height='400px'
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
    },
    title: {
      type: String,
      default() {
        return null;
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
      this.options = options.getBar(this.data, this.title === 'flow' ? '客流' : '客户');
    }
  }
};
</script>

<style scoped lang="less">
.track-chart {
  width: 70%;
  height: 400px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  border-radius: 4px;

  .chart {
    box-sizing: border-box;
  }
}
</style>
