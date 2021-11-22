<template>
  <div class="trend-analysis-container">
    <div class="da-title">趋势分析</div>
    <member-real-today title=""/>
    <date-range @pick="onSelectDateRange" visible-short-cut style="margin-left: 20px"/>
    <div class="da-block bar-box" v-loading="trendLoading.trend">
      <div class="bar-action-box action-float">
        <span class="da-block-title bar-title">指标趋势图</span>
        <span class="bar-action" :class="trendType.value === trendTypeEnum.NEW.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.NEW">
          新增会员
        </span>
        <span class="bar-action" :class="trendType.value === trendTypeEnum.ACTIVE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.ACTIVE">
          活跃会员数
        </span>
        <span class="bar-action" :class="trendType.value === trendTypeEnum.NEW_RATE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.NEW_RATE">
          新增会员占比
        </span>
        <span class="bar-action" :class="trendType.value === trendTypeEnum.CUST_PRICE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.CUST_PRICE">
          会员客单价
        </span>
        <span class="bar-action" :class="trendType.value === trendTypeEnum.CON_RATE.value ? 'bar-action-active' : ''"
              @click="trendType = trendTypeEnum.CON_RATE">
          会员贡献率
        </span>
      </div>
      <chart :options="trendOptions" height="300px" v-if="trendData && trendData.length" :key="trendType.value"></chart>
      <place-holder :height="300" v-else/>
    </div>

    <div class="da-block">
      <div class="da-block-title">
        数据详情
        <span class="da-download-btn" @click="downloadData" v-if="trendData && trendData.length">导出报表</span>
      </div>
      <el-table :data="trendData" stripe class="da-table" style="width: 100%">
        <el-table-column prop="orderTime" label="日期" align="center">
        </el-table-column>
        <el-table-column prop="newUser" label="新增会员" align="center">
        </el-table-column>
        <el-table-column prop="activeUser" align="center" label="活跃会员">
        </el-table-column>
        <el-table-column prop="newUserPro" align="center" label="新增会员占比">
          <span slot-scope="scope">{{parseFloat(scope.row.newUserPro * 100).toFixed(2)}}%</span>
        </el-table-column>
        <el-table-column prop="custPrice" align="center" label="会员客单价">
        </el-table-column>
        <el-table-column prop="userConRate" align="center" label="会员贡献率">
          <span slot-scope="scope">{{parseFloat(scope.row.userConRate * 100).toFixed(2)}}%</span>
        </el-table-column>
        <el-table-column prop="saleFee" align="center" label="会员销售额">
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
  import excel from '@/dss-common/utils/excel.js';
  import memberApi from '@/dss-da/src/api/member.js';
  import Chart from '@/dss-common/components/ChartEmpty';
  import DateRange from '../../components/date-range.vue';
  import MemberRealToday from './member-real-today.vue';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import { line } from '../../assembler/index.js';

  const trendTypeEnum = {
    NEW: { value: 0, label: '新增会员' },
    ACTIVE: { value: 1, label: '活跃会员数' },
    NEW_RATE: { value: 2, label: '新增会员占比' },
    CUST_PRICE: { value: 3, label: '会员客单价' },
    CON_RATE: { value: 4, label: '会员贡献率' }
  };
  export default {
    name: 'contribution-analysis',

    components: {
      Chart,
      DateRange,
      MemberRealToday,
      PlaceHolder
    },

    data() {
      return {
        trendTypeEnum,
        trendLoading: {
          trend: false
        },
        dateRange: null,
        trendType: trendTypeEnum.NEW,
        trendOptions: null,
        trendData: null
      };
    },

    computed: {},

    watch: {
      trendType(newVal, oldVal) {
        this.setTrendData();
      }
    },

    methods: {
      onSelectDateRange(dateRange) {
        this.dateRange = dateRange;
        this.listTrendData();
      },
      /**
       * 设置贡献分析报表options
       */
      setTrendLineOptions() {
        const lineData = [];
        this.trendData.forEach(item => {
          switch (this.trendType.value) {
            case trendTypeEnum.NEW.value:
              lineData.push({
                orderTime: item.orderTime,
                value: item.newUser,
                type: this.trendType.label
              });
              break;
            case trendTypeEnum.ACTIVE.value:
              lineData.push({
                orderTime: item.orderTime,
                value: item.activeUser,
                type: this.trendType.label
              });
              break;
            case trendTypeEnum.NEW_RATE.value:
              lineData.push({
                orderTime: item.orderTime,
                value: parseFloat(item.newUserPro * 100).toFixed(2),
                type: this.trendType.label
              });
              break;
            case trendTypeEnum.CUST_PRICE.value:
              lineData.push({
                orderTime: item.orderTime,
                value: item.custPrice,
                type: this.trendType.label
              });
              break;
            case trendTypeEnum.CON_RATE.value:
              lineData.push({
                orderTime: item.orderTime,
                value: parseFloat(item.userConRate * 100).toFixed(2),
                type: this.trendType.label
              });
              break;
          }
        });
        const sortLegendData = [{ label: this.trendType.label, value: this.trendType.label }];
        this.trendOptions = line.assembleLineOptions(
          lineData,
          'orderTime',
          'value',
          'type',
          utils.getTimeList(new Date(this.dateRange[0]), new Date(this.dateRange[1])),
          sortLegendData
        );
        if (this.trendOptions && this.trendOptions.yAxis && this.trendOptions.yAxis.length) {
          if (this.trendType === trendTypeEnum.NEW_RATE || this.trendType === trendTypeEnum.CON_RATE) {
            this.trendOptions.yAxis[0].axisLabel.formatter = '{value} %';
            this.trendOptions.yAxis[0].max = 100;
          } else {
            this.trendOptions.yAxis[0].axisLabel.formatter = '{value}';
            this.trendOptions.yAxis[0].max = null;
          }
        }
      },
      setTrendData() {
        if (!this.trendData) {
          this.listTrendData();
        } else {
          this.setTrendLineOptions();
        }
      },
      listTrendData() {
        this.trendLoading.trend = true;
        const params = {
          startTime: this.dateRange[0],
          endTime: this.dateRange[1]
        };
        memberApi
          .listTrendData(params)
          .then(res => {
            this.trendData = res.data;
            this.setTrendLineOptions();
          })
          .always(() => {
            this.trendLoading.trend = false;
          });
      },
      downloadData() {
        const downloadTrendData = this.parseDownloadTrendData();
        excel.export2Excel(
          [
            { key: 'orderTime', label: '日期' },
            { key: 'newUser', label: '新增会员' },
            { key: 'activeUser', label: '活跃会员' },
            { key: 'newUserPro', label: '新增会员占比' },
            { key: 'custPrice', label: '会员客单价' },
            { key: 'userConRate', label: '会员贡献率' },
            { key: 'saleFee', label: '会员销售额' }
          ],
          downloadTrendData,
          '趋势分析报表'
        );
      },
      parseDownloadTrendData() {
        const downloadTrendData = this.$plain(this.trendData);
        downloadTrendData.forEach(item => {
          item.newUserPro = parseFloat(item.newUserPro * 100).toFixed(2) + '%';
          item.userConRate = parseFloat(item.userConRate * 100).toFixed(2) + '%';
        });
        return downloadTrendData;
      },
      fakeTrendData() {
        return [
          {
            orderTime: '2018-10-01',
            newUser: '420',
            activeUser: '420',
            newUserPro: '10',
            custPrice: '1000',
            userConRate: '20',
            saleFee: '1000'
          },
          {
            orderTime: '2018-10-02',
            newUser: '320',
            activeUser: '320',
            newUserPro: '50',
            custPrice: '2000',
            userConRate: '50',
            saleFee: '1900'
          },
          {
            orderTime: '2018-10-03',
            newUser: '360',
            activeUser: '360',
            newUserPro: '30',
            custPrice: '500',
            userConRate: '30',
            saleFee: '500'
          },
          {
            orderTime: '2018-10-04',
            newUser: '220',
            activeUser: '220',
            newUserPro: '60',
            custPrice: '1500',
            userConRate: '60',
            saleFee: '1500'
          },
          {
            orderTime: '2018-10-05',
            newUser: '460',
            activeUser: '460',
            newUserPro: '70',
            custPrice: '800',
            userConRate: '70',
            saleFee: '800'
          },
          {
            orderTime: '2018-10-06',
            newUser: '360',
            activeUser: '360',
            newUserPro: '90',
            custPrice: '1200',
            userConRate: '90',
            saleFee: '1200'
          },
          {
            orderTime: '2018-10-07',
            newUser: '520',
            activeUser: '520',
            newUserPro: '60',
            custPrice: '1800',
            userConRate: '60',
            saleFee: '1800'
          }
        ];
      }
    }
  };
</script>

<style lang="less">
  .trend-analysis-container {
    .bar-box {
      position: relative;

      .action-float {
        position: absolute;
      }
    }
  }
</style>
