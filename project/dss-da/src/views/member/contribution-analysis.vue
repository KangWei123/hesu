<template>
  <div class="contribution-container">
    <div class="da-title">贡献分析</div>
    <date-range @pick="onSelectDateRange"
                visible-short-cut
                style="margin-left: 20px" />
    <div class="da-block bar-box"
         v-loading="conLoading.contribution">
      <div class="bar-action-box action-float">
        <span class="da-block-title bar-title">会员贡献分析</span>
        <span class="bar-action"
              :class="analysisType ? 'bar-action-active' : ''"
              @click="analysisType = analysisTypeEnum.LOYALTY">
          按忠诚度分析
        </span>
        <span class="bar-action"
              :class="!analysisType ? 'bar-action-active' : ''"
              @click="analysisType = analysisTypeEnum.PURCHASE">
          按购买力分析
        </span>
      </div>
      <chart :options="barOptions"
             height="300px"
             :key="analysisType"
             v-if="loyaltyData && loyaltyData.length"></chart>
      <place-holder :height="300"
                    v-else />
    </div>

    <div class="da-block"
         v-loading="conLoading.repeat">
      <div class="da-block-title">
        会员复购率
        <span class="da-download-btn"
              v-if="repeatPurchaseData && repeatPurchaseData.length"
              @click="downloadRepeatPurchaseData">导出报表</span>
      </div>

      <el-table :data="repeatPurchaseData"
                stripe
                class="da-table"
                style="width: 100%">
        <el-table-column prop="orderTime"
                         label="日期"
                         align="center">
        </el-table-column>
        <el-table-column prop="userCnt"
                         label="成单会员"
                         align="center">
        </el-table-column>
        <el-table-column prop="userCnt7Rate"
                         align="center"
                         label="7日内">
          <span slot-scope="scope">{{parseFloat(scope.row.userCnt7Rate * 100).toFixed(2)}}%</span>
        </el-table-column>
        <el-table-column prop="userCnt15Rate"
                         align="center"
                         label="15日内">
          <span slot-scope="scope">{{parseFloat(scope.row.userCnt15Rate * 100).toFixed(2)}}%</span>
        </el-table-column>
        <el-table-column prop="userCnt30Rate"
                         align="center"
                         label="30日内">
          <span slot-scope="scope">{{parseFloat(scope.row.userCnt30Rate * 100).toFixed(2)}}%</span>
        </el-table-column>
        <el-table-column prop="userCnt90Rate"
                         align="center"
                         label="90日内">
          <span slot-scope="scope">{{parseFloat(scope.row.userCnt90Rate * 100).toFixed(2)}}%</span>
        </el-table-column>
        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>
    </div>

  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import floatNum from '@/dss-common/utils/float-num.js';
import excel from '@/dss-common/utils/excel.js';
import memberApi from '@/dss-da/src/api/member.js';
import Chart from '@/dss-common/components/ChartEmpty';
import DateRange from '../../components/date-range.vue';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import { bar } from '../../assembler/index.js';

const loyaltyLevel = {
  HIGH: { label: '高', value: 'H' },
  MIDDLE: { label: '中', value: 'M' },
  LOW: { label: '低', value: 'L' }
};

const analysisTypeEnum = { PURCHASE: 0, LOYALTY: 1 };
export default {
  name: 'contribution-analysis',

  components: {
    Chart,
    DateRange,
    PlaceHolder
  },

  data() {
    return {
      analysisTypeEnum,
      conLoading: {
        contribution: false,
        repeat: false
      },
      dateRange: null,
      analysisType: analysisTypeEnum.LOYALTY,
      barOptions: null,
      loyaltyData: null,
      purchaseData: null,
      repeatPurchaseData: null
    };
  },

  computed: {},

  watch: {
    analysisType(newVal, oldVal) {
      this.barOptions = null;
      if (newVal) {
        this.setLoyaltyOptions();
      } else {
        this.setPurchaseOptions();
      }
    }
  },

  methods: {
    onSelectDateRange(dateRange) {
      this.dateRange = dateRange;
      this.listLoyaltyData();
      this.listRepeatPurchase();
    },
    /**
     * 设置贡献分析报表options
     */
    assembleBarOptions() {
      const barData = this.analysisType === analysisTypeEnum.LOYALTY ? this.loyaltyData : this.purchaseData;
      const sortLegendData = [loyaltyLevel.HIGH, loyaltyLevel.MIDDLE, loyaltyLevel.LOW];
      this.barOptions = bar.assembleBarXOptions(
        barData,
        'orderTime',
        'saleFee',
        this.analysisType === analysisTypeEnum.LOYALTY ? 'loyalty' : 'buypower',
        // utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1])),
        null,
        sortLegendData
      );
      if (this.barOptions) {
        if (this.barOptions.series) {
          this.barOptions.series.forEach(item => {
            item.stack = loyaltyLevel.HIGH.value;
          });
        }
        if (this.barOptions.tooltip) {
          this.barOptions.tooltip.formatter = params => {
            /*总额*/
            const totalSaleFee = floatNum.floatAdd(
              floatNum.floatAdd(params[0].value, params[1].value),
              params[2].value
            );
            const sourceData = this.analysisType === analysisTypeEnum.LOYALTY ? this.loyaltyData : this.purchaseData;
            /*拿到legend的key*/
            const field = this.analysisType === analysisTypeEnum.LOYALTY ? 'loyalty' : 'buypower';
            /*找到对应的值，拿到指定的会员数*/
            const targetHighData = sourceData.find(item => {
              return item.orderTime === params[0].name && item[field] === 'H'; /*日期和类型对的上*/
            });
            const highUserCount = targetHighData ? targetHighData.userCnt : 0;
            const targetMiddleData = sourceData.find(item => {
              return item.orderTime === params[1].name && item[field] === 'M';
            });
            const middleUserCount = targetMiddleData ? targetMiddleData.userCnt : 0;
            const targetLowData = sourceData.find(item => {
              return item.orderTime === params[2].name && item[field] === 'L';
            });
            const lowUserCount = targetLowData ? targetLowData.userCnt : 0;
            let name = '忠诚度';
            if (this.analysisType === analysisTypeEnum.PURCHASE) {
              name = '购买力';
            }
            return (
              params[0].name +
              '<br/>' +
              '总销售额: ' +
              totalSaleFee +
              '<br/>' +
              params[0].marker +
              '高' +
              name +
              '会员销售额: ' +
              params[0].value +
              '<br/>' +
              params[0].marker +
              '高' +
              name +
              '会员人数: ' +
              highUserCount +
              '<br/>' +
              params[1].marker +
              '中等' +
              name +
              '会员销售额: ' +
              params[1].value +
              '<br/>' +
              params[1].marker +
              '中等' +
              name +
              '会员人数: ' +
              middleUserCount +
              '<br/>' +
              params[2].marker +
              '低' +
              name +
              '会员销售额: ' +
              params[2].value +
              '<br/>' +
              params[2].marker +
              '低' +
              name +
              '会员人数: ' +
              lowUserCount
            );
          };
        }
      }
    },
    /**
     * 设置忠诚度报表data
     */
    setLoyaltyOptions() {
      if (!this.loyaltyData) {
        this.loyaltyData = this.listLoyaltyData();
      } else {
        this.assembleBarOptions();
      }
    },
    /**
     * 设置购买力度报表options
     */
    setPurchaseOptions() {
      if (!this.purchaseData) {
        this.purchaseData = this.listPurchasingData();
      } else {
        this.assembleBarOptions();
      }
    },

    listRepeatPurchase() {
      this.conLoading.repeat = true;
      const params = {
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      };
      memberApi
        .listRepeatPurchase(params)
        .then(res => {
          this.repeatPurchaseData = res.data;
        })
        .always(() => {
          this.conLoading.repeat = false;
        });
    },
    listLoyaltyData() {
      this.conLoading.contribution = true;
      const params = {
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      };
      memberApi
        .listLoyaltyAnalysisData(params)
        .then(res => {
          this.loyaltyData = res.data;
          if (this.analysisType === analysisTypeEnum.LOYALTY) {
            this.assembleBarOptions();
          }
        })
        .always(() => {
          this.conLoading.contribution = false;
        });
    },
    listPurchasingData() {
      this.conLoading.contribution = true;
      const params = {
        startTime: this.dateRange[0],
        endTime: this.dateRange[1]
      };
      memberApi
        .listPurchaseAnalysisData(params)
        .then(res => {
          this.purchaseData = res.data;
          if (this.analysisType === analysisTypeEnum.PURCHASE) {
            this.assembleBarOptions();
          }
        })
        .always(() => {
          this.conLoading.contribution = false;
        });
    },
    downloadRepeatPurchaseData() {
      const downloadRepeatPurchaseData = this.parseDownloadRepeatPurchaseData();
      excel.export2Excel(
        [
          { key: 'orderTime', label: '日期' },
          { key: 'userCnt', label: '成单会员' },
          { key: 'userCnt7Rate', label: '7日内' },
          { key: 'userCnt15Rate', label: '15日内' },
          { key: 'userCnt30Rate', label: '30日内' },
          { key: 'userCnt90Rate', label: '90日内' }
        ],
        downloadRepeatPurchaseData,
        '会员复购率报表'
      );
    },
    parseDownloadRepeatPurchaseData() {
      const downloadRepeatPurchaseData = this.$plain(this.repeatPurchaseData);
      downloadRepeatPurchaseData.forEach(item => {
        item.userCnt7Rate = parseFloat(item.userCnt7Rate * 100).toFixed(2) + '%';
        item.userCnt15Rate = parseFloat(item.userCnt15Rate * 100).toFixed(2) + '%';
        item.userCnt30Rate = parseFloat(item.userCnt30Rate * 100).toFixed(2) + '%';
        item.userCnt90Rate = parseFloat(item.userCnt90Rate * 100).toFixed(2) + '%';
      });
      return downloadRepeatPurchaseData;
    }
  }
};
</script>

<style lang="less">
.contribution-container {
  .bar-box {
    position: relative;

    .action-float {
      position: absolute;
    }
  }
}

@media screen and (max-width: 1000px) {
  .contribution-container {
    .bar-box {
      .action-float {
        position: relative;
      }
    }
  }
}
</style>
