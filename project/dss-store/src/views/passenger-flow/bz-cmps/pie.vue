<template>
  <div class="pie-chart flow-card">
    <div class="title">
      {{title}}
    </div>
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
    }
  },
  computed: {
    options() {
      let data = this.list.map(item => {
        return {
          name: item.portraitName,
          value: item.portraitCount
        };
      });
      return options.getPie(data, this.title);
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
.pie-chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;


  .chart {
    margin-top: -43px;
    padding-top: 43px;
    box-sizing: border-box;
  }
}
</style>
