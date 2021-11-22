<template>
  <div class="pie-chart">
    <div class="title">
      {{title}}
    </div>
    <div class="legend">
      <div v-for="item in list"
           :key="item.name"
           style="margin-bottom:4px">
        {{item.name + "："}}{{item.value|number}}
      </div>
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
    type: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: options.getPie(this.list, this.title)
    };
  },
  computed: {
    list() {
      let data = [];
      for (let key in this.data) {
        let name = key;
        if (this.type === 'gender') {
          name = this.getSexName(key);
        } else if (this.type === 'member') {
          name = this.getMemberName(key);
        }
        data.push({ name: name, value: this.data[key] });
      }
      return data.reverse();
    }
  },
  watch: {
    data(val) {
      this.options = options.getPie(this.list, this.title);
    }
  },

  methods: {
    getSexName(val) {
      let name = val;
      switch (val) {
        case '0':
          name = '女';
          break;
        case '1':
          name = '男';
          break;
      }
      return name;
    },
    getMemberName(val) {
      let name = val;
      switch (val) {
        case '0':
          name = '非会员';
          break;
        case '1':
          name = '会员';
          break;
      }
      return name;
    }
  }
};
</script>

<style scoped lang="less">
.pie-chart {
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

  .legend {
    position: absolute;
    top: 50px;
    left: 14px;
    font-size: 17px;
  }

  .chart {
    // margin-top: -40px;
    // padding-top: 40px;
    // box-sizing: border-box;
    margin-top: 50px;
    box-sizing: border-box;
    height: 188px !important;
  }
}
</style>
