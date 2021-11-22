<template>
  <div class="effect-chart-container">
    <div class="effect-chart">
      <passenger-tab-item v-model="currentTab"/>

      <div class="chart">
        <chart-item :data="chartData" height="428px" v-if="hasChartData"></chart-item>
        <place-holder v-else :height="428"/>
      </div>

    </div>
    <side-item :data="totalNum"/>
  </div>
</template>

<script>
  import PassengerTabItem from './PassengerTabItem';
  import SideItem from './SideItem';
  import PlaceHolder from '@/dss-common/components/placeholder/index';
  import ChartItem from './ChartItem';

  export default {
    components: {
      ChartItem,
      PassengerTabItem,
      SideItem,
      PlaceHolder
    },
    props: {
      data: Object
    },
    data() {
      return {
        currentTab: 'passengerNum',
        chartOptions: null,
        chartData: null
      };
    },
    computed: {
      totalNum() {
        return [
          {
            label: '累计客流 ',
            value: this.data && this.data.total ? this.data.total.passengerNum : 0,
            rate: this.data && this.data.total ? this.data.total.passengerRate : 0
          },
          {
            label: '累计新客',
            value: this.data && this.data.total ? this.data.total.newCustomerNum : 0,
            rate: this.data && this.data.total ? this.data.total.newCustomerRate : 0
          },
          {
            label: '累计老客',
            value: this.data && this.data.total ? this.data.total.oldCustomerNum : 0,
            rate: this.data && this.data.total ? this.data.total.oldCustomerRate : 0
          }
        ];
      },

      hasChartData() {
        //检查chart是否有数据，当前tab下是否有值，数据结构，参考responseParser下返回的数据结构
        return this.chartData && this.chartData.length && this.chartData[0].value && this.chartData[0].value.length;
      }
    },
    watch: {
      currentTab(newVal, oldVal) {
        this.chartData = this.data && this.data.chart ? this.data.chart[newVal] : null;
      },
      data() {
        this.chartData = this.data && this.data.chart ? this.data.chart[this.currentTab] : null;
      }
    },
    methods: {}
  };
</script>


<style lang="less">

  .effect-chart-container {
    display: flex;
    justify-content: space-between;

    .effect-chart {
      flex: 1;
    }
  }
</style>
