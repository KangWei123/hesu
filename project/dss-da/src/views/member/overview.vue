<template>
  <div class="overview-container">
    <div class="da-title">会员概览</div>
    <member-real-today real-time />
    <div class="da-block bar-box"
         v-loading="overviewLoading.trend">
      <div class="bar-action-box action-float">
        <span class="da-block-title bar-title">指标小时趋势</span>
        <span class="bar-action"
              :class="trendType.value === trendTypeEnum.NEW.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.NEW">
          新增会员
        </span>
        <span class="bar-action"
              :class="trendType.value === trendTypeEnum.ACTIVE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.ACTIVE">
          活跃会员数
        </span>
        <span class="bar-action"
              :class="trendType.value === trendTypeEnum.NEW_RATE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.NEW_RATE">
          新增会员占比
        </span>
        <span class="bar-action"
              :class="trendType.value === trendTypeEnum.CUST_PRICE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.CUST_PRICE">
          会员客单价
        </span>
      </div>
      <chart :options="trendOptions"
             height="300px"
             :key="trendType.value"
             v-if="trendData && trendData.length"></chart>
      <place-holder :height="300"
                    v-else />
    </div>

    <div>
      <div class="da-block bar-box distribute-box"
           v-loading="overviewLoading.level">
        <div class="bar-action-box">
          <span class="da-block-title bar-title">会员等级分布</span>
          <chart :options="memberLevelOptions"
                 height="300px"
                 key="member-level"
                 v-if="memberLevelData && memberLevelData.length"></chart>
          <place-holder :height="300"
                        v-else />
        </div>
      </div>
      <div class="da-block bar-box distribute-box"
           v-loading="overviewLoading.consume">
        <div class="bar-action-box">
          <span class="da-block-title bar-title">会员消费金额分析</span>
          <chart :options="consumeFeeOptions"
                 height="300px"
                 key="member-level"
                 v-if="consumeFeeData && consumeFeeData.length"></chart>
          <place-holder :height="300"
                        v-else />
        </div>
      </div>
      <div class="da-block bar-box distribute-box"
           v-loading="overviewLoading.lifeCircle">
        <div class="bar-action-box">
          <span class="da-block-title bar-title">会员生命周期分布</span>
          <chart :options="memberLifecycleOptions"
                 height="300px"
                 key="member-level"
                 v-if="memberLifecycleData && memberLifecycleData.length"></chart>
          <place-holder :height="300"
                        v-else />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import utils from '@/dss-common/utils';
  import memberApi from '@/dss-da/src/api/member.js';
  import time from '../../utils/time.js';
  import Chart from '@/dss-common/components/ChartEmpty';
  import MemberRealToday from './member-real-today.vue';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import { line, bar, pie } from '../../assembler/index.js';
  import '../../style/da-base.less';

const trendTypeEnum = {
  NEW: { value: 'new', label: '新增会员' },
  ACTIVE: { value: 'active', label: '活跃会员数' },
  NEW_RATE: { value: 'newRage', label: '新增会员占比' },
  CUST_PRICE: { value: 'custPrice', label: '会员客单价' },
  CON_RATE: { value: 'conRate', label: '会员贡献率' }
};
const lgendEnum = { LAST_WEEK: { label: '上周同期', value: 'last' }, TODAY: { label: '今日', value: 'new' } };
export default {
  name: 'overview',

  components: {
      Chart,
      MemberRealToday,
      PlaceHolder
  },

  data() {
      return {
        trendTypeEnum,
        overviewLoading: {
          trend: false,
        level: false,
          consume: false,
          lifeCircle: false
        },
        dateRange: null,
        trendType: trendTypeEnum.NEW,
        trendOptions: null,
        trendData: null,
        newData: null,
        activeData: null,
        newRateData: null,
        custPriceData: null,
        memberLevelOptions: null,
        memberLevelData: null,
        consumeFeeOptions: null,
        consumeFeeData: null,
        memberLifecycleOptions: null,
        memberLifecycleData: null
      };
  },

  computed: {
      totalMemberCount() {
        return this.memberLifecycleData.reduce((preTotal, cur) => {
          return preTotal + cur.number;
        }, 0);
      }
  },

  watch: {
      trendType(newVal, oldVal) {
        this.trendData = null;
        switch (newVal) {
          case trendTypeEnum.NEW:
            this.setNewOptions();
            break;
          case trendTypeEnum.ACTIVE:
            this.setActiveOptions();
            break;
          case trendTypeEnum.NEW_RATE:
            this.setNewRateOptions();
            break;
          case trendTypeEnum.CUST_PRICE:
            this.setCustPriceOptions();
            break;
        }
      }
  },
  mounted() {
      this.listNewData();
      this.listMemberLevelData();
      this.listConsumeFeeData();
      this.listMemberLifecycleData();
  },

  methods: {
      /**
       * 设置贡献分析报表options
       */
      setTrendLineOptions() {
        let valueType = 'newMember';

        switch (this.trendType.value) {
          case trendTypeEnum.NEW.value:
          this.trendData = this.newData;
            valueType = 'newMember';
            break;
          case trendTypeEnum.ACTIVE.value:
            this.trendData = this.activeData;
            valueType = 'activeMember';
            break;
          case trendTypeEnum.NEW_RATE.value:
            this.trendData = this.newRateData;
            valueType = 'rate';
            break;
          case trendTypeEnum.CUST_PRICE.value:
            valueType = 'pac';
            this.trendData = this.custPriceData;
            break;
        }

        if (!this.trendData || !this.trendData.length) {
          return;
        }

        const sortLegendData = [lgendEnum.TODAY, lgendEnum.LAST_WEEK];
        this.trendOptions = line.assembleLineOptions(
          this.trendData,
          'statDate',
          valueType,
          'timeGroup',
          time.getTimeList(1, 24),
          sortLegendData
        );

        if (this.trendOptions) {
          if (this.trendType === trendTypeEnum.NEW_RATE) {
            this.trendOptions.yAxis[0].axisLabel.formatter = '{value} %';
            this.trendOptions.yAxis[0].max = 100;
          } else {
            this.trendOptions.yAxis[0].axisLabel.formatter = '{value}';
            this.trendOptions.yAxis[0].max = null;
          }
        }
      },
      setMemberLevelOptions() {
        this.memberLevelOptions = pie.pie(this.memberLevelData);
      },
      setNewOptions() {
        if (!this.newData) {
          this.listNewData();
        } else {
          this.setTrendLineOptions();
        }
      },
      setActiveOptions() {
      if (!this.activeData) {
          this.listActiveData();
        } else {
          this.setTrendLineOptions();
        }
      },
      setNewRateOptions() {
        if (!this.newRateData) {
          this.listNewRateData();
        } else {
          this.setTrendLineOptions();
        }
      },
      setCustPriceOptions() {
        if (!this.custPriceData) {
          this.listCustPriceData();
        } else {
          this.setTrendLineOptions();
        }
      },
      listNewData() {
        this.overviewLoading.trend = true;
        const params = {};
        memberApi
          .listNewHourData(params)
          .then(res => {
            this.newData = res.data;
            this.setTrendLineOptions();
          })
          .always(() => {
            this.overviewLoading.trend = false;
          });
      },
      listActiveData() {
        this.overviewLoading.trend = true;
        const params = {};
        memberApi
          .listActiveHourData(params)
          .then(res => {
            this.activeData = res.data;
            this.setTrendLineOptions();
          })
          .always(() => {
            this.overviewLoading.trend = false;
          });
      },
      listCustPriceData() {
        this.overviewLoading.trend = true;
        const params = {};
        memberApi
          .listPctHourData(params)
          .then(res => {
            this.custPriceData = res.data;
            this.setTrendLineOptions();
          })
          .always(() => {
            this.overviewLoading.trend = false;
          });
      },
      listNewRateData() {
        this.overviewLoading.trend = true;
        const params = {};
        memberApi
          .listNewRateHourData(params)
          .then(res => {
            this.newRateData = res.data;
            this.setTrendLineOptions();
          })
          .always(() => {
            this.overviewLoading.trend = false;
          });
      },
      listMemberLevelData() {
        this.overviewLoading.level = true;
        const params = {};
        memberApi
          .listLEVELData(params)
          .then(res => {
            this.memberLevelData = res.data;
            this.setMemberLevelOptions();
          })
          .always(() => {
            this.overviewLoading.level = false;
          });
      },
      listConsumeFeeData() {
        this.overviewLoading.consume = true;
        const params = {};
        memberApi
          .listDistributiData(params)
          .then(res => {
            this.consumeFeeData = res.data;
            this.getConsumeFeeOPions();
          })
          .always(() => {
            this.overviewLoading.consume = false;
          });
      },
      listMemberLifecycleData() {
        this.overviewLoading.lifeCircle = true;
        const params = {};
        memberApi
          .listDistributionData(params)
          .then(res => {
            this.memberLifecycleData = res.data;
            this.getMemberLifecycleOPions();
          })
          .always(() => {
            this.overviewLoading.lifeCircle = false;
          });
      },
      getMemberLifecycleOPions() {
        this.memberLifecycleOptions = bar.assembleBarXShadowOptions(this.memberLifecycleData, 'dateRange', 'userCnt');
      },
      getConsumeFeeOPions() {
        this.consumeFeeOptions = bar.assembleBarYOptions(this.consumeFeeData, 'feeQua', 'userCnt', null, 0);
        if (this.consumeFeeOptions) {
          this.consumeFeeOptions.grid = {
            top: '19',
            bottom: '5',
            left: 100,
            right: 10
          };
          this.consumeFeeOptions.yAxis[0].axisLabel.margin = 100;
          /*不显示排序*/
          this.consumeFeeOptions.yAxis[0].axisLabel.formatter = function(value) {
            return value;
          };
        }
      },
      fakeTrendData() {
        return [
          {
            orderTime: '06:00',
            value: '420',
            type: 'new'
          },
          {
            orderTime: '07:00',
            value: '420',
            type: 'new'
          },
          {
            orderTime: '08:00',
            value: '420',
            type: 'new'
          },
          {
            orderTime: '09:00',
            value: '420',
            type: 'new'
          },
          {
            orderTime: '10:00',
            value: '420',
            type: 'new'
          },
          {
            orderTime: '06:00',
            value: '520',
            type: 'last'
          },
          {
            orderTime: '07:00',
            value: '620',
            type: 'last'
          },
          {
            orderTime: '08:00',
            value: '720',
            type: 'last'
          },
          {
            orderTime: '09:00',
            value: '820',
            type: 'last'
          },
          {
            orderTime: '10:00',
            value: '920',
            type: 'last'
          }
        ];
      }
  }
};
</script>

<style lang="less">
.overview-container {
  font-size: 0;

  .member-real-today .real-title {
    margin-top: 0;
  }

  .bar-box {
    position: relative;

    .action-float {
      position: absolute;
    }
  }

  .distribute-box {
    display: inline-block;
    width: 32.6%;
    height: 340px;
    box-sizing: border-box;

    .bar-action-box {
      height: 100%;

      .total-member-count {
        height: 28px;
        font-size: 20px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        line-height: 28px;
        position: absolute;
      }
    }
  }

  .distribute-box + .distribute-box {
    margin-left: 1.1%;
  }

  .distribute-box:first-child {
    margin-top: 20px;
  }
}

@media screen and (max-width: 1200px) {
  .overview-container {
    .bar-box {
      .action-float {
        position: relative;
      }
    }
  }
}

@media screen and (max-width: 1000px) {
  .overview-container {
    .distribute-box {
      display: block;
      width: 100%;
    }

    .distribute-box + .distribute-box {
      margin-left: 0;
    }
  }
}
</style>
