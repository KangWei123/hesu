<template>
  <div class="pie-chart">
    <card-border />
    <div class="title">地区分布TOP10： </div>

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
  computed: {
    list() {
      let seriesData = [];
      let legendData = [];
      let maxValue = 0;
      this.data.forEach(item => {
        maxValue += Math.abs(item.userCount);
      });
      this.data.forEach(item => {
        if (item.province !== '其他') {
          seriesData.push({ name: item.province, value: item.userCount });
        }
      });

      //按大小排序
      seriesData.sort((a, b) => {
        return b.value - a.value;
      });
      seriesData.forEach(item => {
        legendData.push(item.name);
      });

      return {
        seriesData: seriesData,
        legendData: legendData,
        maxValue
      };
    }
  },
  watch: {
    data(val) {
      this.options = options.getAreaLine(this.list.seriesData, this.list.legendData, this.list.maxValue);
    }
  },

  methods: {}
};
</script>

<style scoped lang="less">
.pie-chart {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/area-bg.png');
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
  .line-box {
    top: 182px;
    right: -50px;
  }

  .chart-box {
    display: inline-block;
    width: 522px;
    height: 349px;
    position: absolute;
    top: 40px;
    left: 0px;
  }
}
</style>
