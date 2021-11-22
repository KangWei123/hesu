<template>
  <div class="bar-chart">
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
      type: Object,
      default() {
        return {};
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: options.getBar(this.list, this.title)
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
      this.options = options.getBar(this.list, this.title);
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
          name = '15到24岁';
          break;
        case '2':
          name = '25到34岁';
          break;
        case '3':
          name = '35到44岁';
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
  box-sizing: border-box;
  color: rgba(255, 255, 255, 1);
  background:linear-gradient(90deg,rgba(29,35,71,1) 0%,rgba(29,70,67,1) 100%);
  border-radius: 4px;

  .title {
    height: 40px;
    line-height: 40px;
    background:rgba(255,255,255,0.0232);
    padding-left: 10px;
    font-size: 22px;
    color:rgba(50,255,234,1);
  }

  .chart {
    margin-top: -40px;
    padding-top: 40px;
    box-sizing: border-box;
  }
}
</style>
