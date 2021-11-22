<template>
  <div class="bar-chart">
    <card-border />
    <div class="title">年龄占比： </div>

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
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      options: options.getBar(this.list)
    };
  },
  computed: {
    list() {
      let data = [];
      for (let key in this.data) {
        let name = this.getName(key);
        data.push({ name: name, value: this.data[key] });
      }
      return data;
    }
  },
  watch: {
    data(val) {
      this.options = options.getBar(this.list);
    }
  },
  methods: {
    getName(val) {
      let name = val;
      switch (val) {
        case '0':
          name = '15岁以下';
          break;
        case '1':
          name = '15-24岁';
          break;
        case '2':
          name = '25-34岁';
          break;
        case '3':
          name = '35-44岁';
          break;
        case '4':
          name = '44岁以上';
          break;
      }
      return name;
    }
  }
};
</script>

<style scoped lang="less">
.bar-chart {
  width: 100%;
  height: 100%;
  background-image: url('../../../asserts/images/face-score/bar-bg.png');
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
    height: 177px;
    position: absolute;
    top: 40px;
    left: 0px;
  }

  .line-box {
    top: 98px;
    right: -50px;
  }
}
</style>
