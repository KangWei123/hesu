<template>
  <div class="bar-chart">
    <card-border />
    <div class="title">日客流分布： </div>

    <div class="chart-box">
      <chart :options='options'></chart>
    </div>

    <!-- 连接线 -->
    <div class="line-box">
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';
import cardBorder from './card-border.vue';
export default {
  components: { Chart, cardBorder },
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
    data(val) {
      this.options = options.getLine(this.data);
    }
  }
};
</script>

<style scoped lang="less">
.bar-chart {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/line-bg.png');
  position: relative;
  .title {
    position: absolute;
    top: 15px;
    left: 31px;
    font-size: 18px;
    font-weight: 400;
    color: rgba(124, 250, 255, 1);
    line-height: 25px;
  }

  .chart-box {
    display: inline-block;
    width: 522px;
    height: 424px;
    position: absolute;
    top: 40px;
    left: 0px;
  }

  .line-box {
    left: -50px;
    top: 220px;
  }
}
</style>
