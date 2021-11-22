<template>
  <div class="bar-chart flow-card">
    <div class="title">
      {{title}}
    </div>
    <chart
      :options="options"
      class="chart"
    />
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
      default: ''
    }
  },
  computed: {
    options() {
      return options.getLine(this.data, this.title, this.type);
    }
  }
};
</script>

<style scoped lang="less">
.bar-chart {
  width: 100%;
  height: 100%;
}
</style>
