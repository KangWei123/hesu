<template>
  <div class="trend-analysis-container">
    <div class="da-block bar-box">
      <div class="bar-action-box">
        <span class="bar-title">实时趋势图</span>
        <span class="bar-action" :class="analysisType === 0 ? 'bar-action-active' : ''" @click="analysisType = analysisTypeEnum.SALES">
          销售额
        </span>
        <span class="bar-action" :class="analysisType === 1 ? 'bar-action-active' : ''" @click="analysisType = analysisTypeEnum.ORDER">订单量
        </span>
        <span class="bar-action" :class="analysisType === 2 ? 'bar-action-active' : ''" @click="analysisType = analysisTypeEnum.UNITPRICE">平均客单价
        </span>
        <span class="bar-action" :class="analysisType === 3 ? 'bar-action-active' : ''" @click="analysisType = analysisTypeEnum.AVERAGEPRICE">平均件单价
        </span>
        <span class="bar-action" :class="analysisType === 4 ? 'bar-action-active' : ''" @click="analysisType = analysisTypeEnum.JOINTRATE">连带率
        </span>
      </div>
      <chart :options="currenLineToptions"></chart>
    </div>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import storage from '@/dss-common/utils/storage';
  import daApi from '@/dss-da/src/api/da';
  import services from '@/dss-common/utils/services';
  import date from '@/dss-common/utils/date';
  import Chart from '@/dss-common/components/ChartEmpty';
  import { line } from '../../assembler/index.js';


  const analysisTypeEnum = { SALES: 0, ORDER: 1 , UNITPRICE: 2 , AVERAGEPRICE: 3, JOINTRATE: 4};
  export default {
    name: 'sales-overview',

    components: {
      Chart
    },

    data() {
      return {
        analysisTypeEnum,
        analysisType: analysisTypeEnum.SALES,
        salesOptions: null,
        orderOptions: null,
        currenLineToptions: null
      };
    },
    mounted() {
      this.setsalesOptions();
      this.setorderOptions();
      this.currenLineToptions = this.salesOptions;
    },

    watch: {
      analysisType(newVal, oldVal) {
        // console.log(newVal);
        switch (newVal){
          case 0:
            this.currenLineToptions = this.salesOptions;
            break;
          case 1:
            this.currenLineToptions = this.orderOptions;
            break;
          case 2:
            this.currenLineToptions = this.salesOptions;
            break;
          case 3:
            this.currenLineToptions = this.salesOptions;
            break;
          case 4:
            this.currenLineToptions = this.salesOptions;
            break;
        }
      }
    },
    methods: {
      /**
       * 设置销售额options报表options
       */
      setsalesOptions() {
        this.salesOptions = line.assembleLineOptions(
          this.fakeMemberData(),
          'date',
          'number',
          'level',
          utils.getTimeList(new Date('2018-10-01'), new Date('2018-10-08'))
        );
        const sortSeries = [];
        this.salesOptions.series.forEach(item => {
          switch (item.name) {
            case '今日':
              sortSeries[0] = item;
              break;
            case '上周同期':
              sortSeries[1] = item;
              break;
          }
        });
        this.salesOptions.series = sortSeries;
      },
      /**
       * 设置订单量options报表options
       */
      setorderOptions() {
        this.orderOptions = line.assembleLineOptions(
          this.fakeMemberData2(),
          'date',
          'number',
          'level',
          utils.getTimeList(new Date('2018-10-01'), new Date('2018-10-08'))
        );
        const sortSeries = [];
        this.orderOptions.series.forEach(item => {
          switch (item.name) {
            case '今日':
              sortSeries[0] = item;
              break;
            case '上周同期':
              sortSeries[1] = item;
              break;
          }
        });
        this.orderOptions.series = sortSeries;
      },
      fakeMemberData() {
        return [
          { date: '2018-10-01', number: '300', level: '今日' },
          { date: '2018-10-01', number: '400', level: '上周同期' },

          { date: '2018-10-02', number: '500', level: '今日' },
          { date: '2018-10-02', number: '200', level: '上周同期' },

          { date: '2018-10-03', number: '100', level: '今日' },
          { date: '2018-10-03', number: '350', level: '上周同期' },

          { date: '2018-10-04', number: '100', level: '今日' },
          { date: '2018-10-04', number: '320', level: '上周同期' },

          { date: '2018-10-05', number: '120', level: '今日' },
          { date: '2018-10-05', number: '200', level: '上周同期' },

          { date: '2018-10-06', number: '380', level: '今日' },
          { date: '2018-10-06', number: '180', level: '上周同期' },

          { date: '2018-10-07', number: '450', level: '今日' },
          { date: '2018-10-07', number: '220', level: '上周同期' },

          { date: '2018-10-08', number: '480', level: '今日' },
          { date: '2018-10-08', number: '420', level: '上周同期' }
        ];
      },
      fakeMemberData2() {
        return [
          { date: '2018-10-01', number: '300', level: '今日' },
          { date: '2018-10-01', number: '440', level: '上周同期' },

          { date: '2018-10-02', number: '500', level: '今日' },
          { date: '2018-10-02', number: '200', level: '上周同期' },

          { date: '2018-10-03', number: '100', level: '今日' },
          { date: '2018-10-03', number: '350', level: '上周同期' },

          { date: '2018-10-04', number: '100', level: '今日' },
          { date: '2018-10-04', number: '370', level: '上周同期' },

          { date: '2018-10-05', number: '130', level: '今日' },
          { date: '2018-10-05', number: '200', level: '上周同期' },

          { date: '2018-10-06', number: '380', level: '今日' },
          { date: '2018-10-06', number: '180', level: '上周同期' },

          { date: '2018-10-07', number: '450', level: '今日' },
          { date: '2018-10-07', number: '220', level: '上周同期' },

          { date: '2018-10-08', number: '420', level: '今日' },
          { date: '2018-10-08', number: '420', level: '上周同期' }
        ];
      }
    }
};
</script>
<style>
  .trend-analysis-container {
  .bar-box {
    position: relative;

  .bar-action-box {
    position: absolute;
    top: 15px;
    vertical-align: top;
    z-index: 1;
  }

  .bar-title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(34, 43, 77, 1);
    line-height: 22px;
    margin-right: 31px;
  }

  .bar-action {
    height: 22px;
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
    line-height: 22px;
    cursor: pointer;
  }

  .bar-action + .bar-action {
    margin-left: 20px;
  }

  .bar-action-active {
    color: rgba(56, 121, 251, 1);
    border-bottom: 2px solid rgba(56, 121, 251, 1);
  }
  }
  }
</style>
