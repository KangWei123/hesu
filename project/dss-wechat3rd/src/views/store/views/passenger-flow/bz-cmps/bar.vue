<template>
  <div class="bar-chart flow-card">
    <div class="title">
      {{title}}
    </div>
    <chart :options="options" class="chart" />
  </div>

</template>

<script>
import Chart from '@/dss-common/components/Chart.vue';
import options from './options.js';

export default {
  components: { Chart },
  props: {
    data: {
      type: Array | Object,
      default() {
        return [];
      }
    },
    title: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: ''
    },
    isSex: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    options() {
      let data = [];
      for (let item of this.list) {
        const percent = (item.portraitRate * 100).toFixed(2);
        data.push({ name: item.portraitName, value: +percent });
      }
      return options.getBar(data, this.title, true, this.isSex);
    },
    list() {
      if (this.data && this.data.length) {
        const finded = this.data.find(item => item.tag === this.tag);
        if (finded) {
          return finded.data || [];
        }
      }
      return [];
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

  .title {
    height: 22px;
    padding-top: 21px;
  }

  .chart {
    margin-top: -43px;
    padding-top: 43px;
    box-sizing: border-box;
  }
}
</style>
