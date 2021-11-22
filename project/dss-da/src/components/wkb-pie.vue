/**
使用方式， 传入参数主要是 props 里面的属性，详细使用见 atv-analysis/index.vue
<wkb-pie :custom-option="pieCustomOption"
         :url="apiUrl"
         :query-params="queryParams">
</wkb-pie>
*/

<template>
  <div class="wkb-pie"
       v-loading="loading">
    <chart :options="options"
           :id="pieId"
           height="300px"
           class="da-block">
    </chart>
  </div>
</template>

<script>
import Chart from '@/dss-common/components/ChartEmpty';
import services from '@/dss-common/utils/services';
import uuidv1 from 'uuid/v1';
import chartConfig from '../assembler/chartConfig.js';
import { pie } from '../assembler/index.js';

export default {
  name: 'WkbPie',

  components: { Chart },

  props: {
    // 业务自定义 option
    customOption: {
      type: Object,
      default() {
        return null;
      }
    },

    // 查询数据接口地址
    url: {
      type: String,
      default() {
        return '';
      }
    },

    // 接口参数
    queryParams: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data() {
    return {
      loading: false,
      pieId: null,
      data: null,
      options: null
    };
  },

  created() {
    this.pieId = uuidv1(); //获取随机id
  },

  mounted() {
    console.log('----------------->', this.customOption);

    // 获取网络数据
    // this.apiGetData();

    // 假数据
    this.options = pie.pie(this.fakeData());
    this.setCustomOption();
  },

  methods: {
    fakeData() {
      return [
        { name: '1月', value: 10 },
        { name: '2月', value: 20 },
        { name: '3月', value: 30 },
        { name: '4月', value: 40 },
        { name: '5月', value: 50 },
        { name: '6月', value: 60 }
      ];
    },

    setCustomOption() {
      let pieChart = chartConfig.initChart(this.options, this.pieId);
      if (this.customOption) {
        pieChart.setOption(this.customOption);
      }
      console.log('----------------->', pieChart, this.pieId);
    },

    apiGetData() {
      this.loading = true;
      let params = {
        ...this.queryParams
      };

      console.log('this.queryParams ->', this.queryParams);

      services
        .get(this.url, {
          params,
          action: '获取饼图数据'
        })
        .then(res => {
          console.log('wkb-pie, apiGetData------->', res);
          this.data = res.data || [];
          this.options = pie.pie(this.data);
          this.setCustomOption();
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.wkb-pie {
  width: 500px;
}
</style>
