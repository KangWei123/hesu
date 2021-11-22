<template>
  <div class="bubble-chart flow-card">
    <div class="title">
      {{title}}
    </div>
    <chart
      :options="options"
      class="chart"
    >
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
      type: Object | Array,
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
      const data = this.list.map(item => {
        return {
          name: item.portraitName,
          commoditySale: item.portraitCount
        };
      });
      return options.getBubble(data, this.title);
    },
    list() {
      if (this.data && this.data.length) {
        const finded = this.data.find(item => item.tag === 'mobile_phone_brand');
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
</style>
