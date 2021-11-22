<template>
  <div class="bar-chart">
    <div class="title">
      {{title}}
    </div>
    <div class="legend">
      <span class="point point-flow"></span>
      <span style="right: 104px;" class="legend-name">客流量</span>
      <span class="point point-vip"></span>
      <span style="right:20px;" class="legend-name">会员量</span>
    </div>
    <chart :options="options" class="chart">

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
      default: ''
    },
    type: {
      type: String,
      default: 'month'
    }
  },
  data() {
    return {
      options: options.getLine(this.data, this.title, this.type)
    };
  },
  watch: {
    data(val) {
      this.options = options.getLine(this.data, this.title, this.type);
    }
  }
};
</script>

<style scoped lang="less">
.bar-chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  background:linear-gradient(90deg,rgba(29,35,71,1) 0%,rgba(29,70,67,1) 100%);
  border-radius:4px;

  .title {
    height: 40px;
    line-height: 40px;
    background:rgba(255,255,255,0.023);
    padding-left: 10px;
    font-size: 22px;
    color: #32FFEA;
  }

  .chart {
    margin-top: -40px;
    padding-top: 40px;
    box-sizing: border-box;
  }

  .legend {
    position: absolute;
    top: 0;
    right: 0px;
    font-size: 16px;
    vertical-align: middle;

    span {
      display: inline-block;
      padding-bottom: 12px;
      position: absolute;
      top: 14px;
    }

    .point {
      width: 12px;
      height: 12px;
      position: relative;
      padding: 0;
    }

    .legend-name {
      width: 50px;
      text-align: right;
      margin-top: -4.5px;
    }

    .point-flow {
      background: rgba(121, 255, 232, 1);
      right: 142px;
    }

    .point-vip {
      background: rgba(255, 216, 121, 1);
      right: 72px;
    }
  }
}
</style>
