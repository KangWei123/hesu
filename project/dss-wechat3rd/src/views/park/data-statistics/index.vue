<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <div class="DatacChoose">
        <date-range-picker
          v-model="workbenchTime"
          type="daterange"
          :select-range="{ week: true, month: true, year: true }"
          :picker-options="pickerOptions"
        />
      </div>
    </template>
    <div class="wrap">
      <div class="flexBox">
        <div class="box">
          <div class="count">{{ workbenchData.orderTotalNum }}</div>
          <div class="box-bottom">
            <img src="./images/gross.png" class="icon" />
            <div class="name">订单总量</div>
          </div>
        </div>
        <div class="box">
          <div class="count">{{ workbenchData.orderTotalAmount | price }}</div>
          <div class="box-bottom">
            <img src="./images/money.png" class="icon" />
            <div class="name">订单总金额</div>
          </div>
        </div>
        <div class="box">
          <div class="count">{{ workbenchData.orderTotalActualPayAmount | price }}</div>
          <div class="box-bottom">
            <img src="./images/pay.png" class="icon" />
            <div class="name">实付总金额</div>
          </div>
        </div>
        <div class="box">
          <div class="count">{{ workbenchData.orderTotalActualPayScore }}</div>
          <div class="box-bottom">
            <img src="./images/score.png" class="icon" />
            <div class="name">实付总积分</div>
          </div>
        </div>
      </div>

      <div class="couponBox">
        <div class="longBox">
          <div class="title">权益</div>
          <div class="content">
            <div class="value">
              <div class="value-top">{{ workbenchData.memberUseTotalNum }}</div>
              <div class="value-bottom">次数</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.memberUseProportion }}%</div>
              <div class="value-bottom">占比</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.memberDeductionAmount | price }}</div>
              <div class="value-bottom">金额</div>
            </div>
            <div class="value">
              <div class="value-top">{{ (workbenchData.memberDeductionDuration / 60).toFixed(2) }}</div>
              <div class="value-bottom">时长(小时)</div>
            </div>
          </div>
        </div>
        <div class="longBox">
          <div class="title">停车券</div>
          <div class="content">
            <div class="value">
              <div class="value-top">{{ workbenchData.parkingCouponTotalNum }}</div>
              <div class="value-bottom">次数</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.parkingCouponUseProportion }}%</div>
              <div class="value-bottom">占比</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.parkingCouponAmount | price }}</div>
              <div class="value-bottom">金额</div>
            </div>
            <div class="value">
              <div class="value-top">{{ (workbenchData.parkingCouponDuration / 60).toFixed(2) }}</div>
              <div class="value-bottom">时长(小时)</div>
            </div>
          </div>
        </div>
        <div class="longBox">
          <div class="title">积分</div>
          <div class="content">
            <div class="value">
              <div class="value-top">{{ workbenchData.scoreUseTotalNum }}</div>
              <div class="value-bottom">次数</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.scoreUseProportion }}%</div>
              <div class="value-bottom">占比</div>
            </div>
            <div class="value">
              <div class="value-top">{{ workbenchData.scoreDeductionAmount | price }}</div>
              <div class="value-bottom">金额</div>
            </div>
            <div class="value">
              <div class="value-top">{{ (workbenchData.scoreDeductionDuration / 60).toFixed(2) }}</div>
              <div class="value-bottom">时长(小时)</div>
            </div>
          </div>
        </div>
      </div>

      <div class="echart-box">
        <div class="title">停车收费统计 (日统计)</div>
        <div class="Echarts">
          <chart :options="option1" class="chart"> </chart>
        </div>
        <div class="legend-box">
          <div class="legend">
            <div class="icon"></div>
            <div class="text">订单金额</div>
          </div>
          <div class="legend">
            <div class="icon yellow"></div>
            <div class="text">实付金额</div>
          </div>
        </div>
      </div>
      <div class="echart-box">
        <div class="title">停车收费统计 (时段统计)</div>
        <div class="Echarts">
          <chart :options="option2" class="chart"> </chart>
        </div>
        <div class="legend-box padding0">
          <div class="legend">
            <div class="icon"></div>
            <div class="text">订单金额</div>
          </div>
          <div class="legend">
            <div class="icon yellow"></div>
            <div class="text">实付金额</div>
          </div>
        </div>
      </div>
    </div>
  </list-page-layout>
</template>
<script>
  import parkApi from '@/dss-wechat3rd/src/api/park.js';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import Chart from '@/dss-common/components/Chart.vue';
  import DateRangePicker from '@/dss-common/components/date-range-picker-select/index.vue';
  import options from './options.js';
  import dayjs from 'dayjs';

  const end = new Date();
  const start = new Date(dayjs(end).subtract(30, 'day'));

  export default {
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      Chart,
      DateRangePicker,
    },
    data() {
      const that = this;
      return {
        workbenchData: {
          orderTotalNum: 0,
          orderTotalAmount: 0,
          orderTotalActualPayAmount: 0,
          orderTotalActualPayScore: 0,
          memberUseTotalNum: 0,
          memberUseProportion: 0,
          memberDeductionAmount: 0,
          memberDeductionDuration: 0,
          scoreUseTotalNum: 0,
          scoreUseProportion: 0,
          scoreDeductionAmount: 0,
          scoreDeductionDuration: 0,
        },
        workbenchTime: [start, end],
        reportTime: [],
        minDate: '',
        pickerOptions: {
          onPick: ({ maxDate, minDate }) => {
            this.minDate = minDate;
            console.log(this.minDate);
          },
          disabledDate: time => {
            const year = 365 * 24 * 3600 * 1000;
            const date = new Date();
            const now = date.setHours(23, 59, 59);
            if (this.minDate) {
              const before = time.getTime() > now || new Date(this.minDate).getTime() - time.getTime() >= year;
              const after = time.getTime() > now || time.getTime() - new Date(this.minDate).getTime() >= year;
              return before || after;
            }
            return time.getTime() > now;
          },
        },
        option1: options.getOption(),
        option2: options.getOption(),
      };
    },
    watch: {
      workbenchTime(value) {
        if (value) {
          this.getbrorshData(value);
          this.getDataByHour(value);
          this.getDataByDays(value);
        } else {
          this.$message.info('请选择区间');
          this.minDate = '';
        }
      },
    },
    methods: {
      // 查询数据统计
      getbrorshData(query) {
        const params = {
          queryDateStart: query[0],
          queryDateEnd: query[1],
        };
        return parkApi
          .parkingStatistics(params)
          .done(res => {
            this.workbenchData = res.data || {};
          })
          .always(() => {});
      },

      // 停车收费统计 (日统计)
      getDataByDays(query) {
        const params = {
          queryDateStart: query[0],
          queryDateEnd: query[1],
        };
        return parkApi
          .brokenLineGraphByDays(params)
          .done(res => {
            const data = res.data || [];
            this.option1 = options.getOption(data);
          })
          .always(() => {});
      },

      // 停车收费统计 (时段统计)
      getDataByHour(query) {
        const params = {
          queryDateStart: query[0],
          queryDateEnd: query[1],
        };
        return parkApi
          .brokenLineGraphHours(params)
          .done(res => {
            const data = res.data || [];
            this.option2 = options.getOption(data);
          })
          .always(() => {});
      },
    },
  };
</script>
<style lang="less" scoped>
  .DatacChoose {
    display: flex;
    align-items: center;
  }

  @font-face {
    font-family: 'DIN-Medium';
    src: url('../../../font/DINPro-Medium.otf');
  }

  .wrap {
    overflow: hidden;
    background: #f5f7fa;

    .flexBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 24px;
      background: #fff;

      .box {
        width: 20%;
        margin-right: 3%;
        height: 91px;

        .count {
          font-size: 26px;
          font-weight: 500;
          text-align: left;
          color: #000;
          line-height: 33px;
          font-family: 'DIN-Medium';
        }

        .box-bottom {
          display: flex;
          justify-content: flex-start;
          margin-top: 6px;
          align-items: center;

          .icon {
            width: 18px;
            height: 18px;
          }

          .name {
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #303133;
            line-height: 22px;
            margin-left: 3px;
          }
        }
      }
    }

    .couponBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;

      .longBox {
        width: 50%;
        height: 158px;
        margin-right: 16px;
        background: #fff;
        border-radius: 5px;
        box-sizing: border-box;

        .title {
          color: #303133;
          font-weight: 600;
          line-height: 22px;
          font-size: 16px;
          padding: 20px 0 12px 0;
          margin: 0 24px;
          border-bottom: 1px solid #ebeef5;
        }

        .content {
          margin-top: 25px;
          display: flex;

          .value {
            width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .value-top {
              font-size: 24px;
              font-family: 'DIN-Medium';
              font-weight: 500;
              text-align: center;
              color: #303133;
              line-height: 33px;
            }

            .value-bottom {
              font-size: 14px;
              font-weight: 400;
              text-align: center;
              color: #717378;
              line-height: 22px;
            }
          }
        }
      }

      .longBox:last-child {
        margin-right: 0;
      }
    }

    .echart-box {
      margin-top: 16px;
      background: #fff;

      .title {
        padding: 16px 0;
        margin: 0 24px;
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        line-height: 26px;
        border-bottom: 1px solid #ebeef5;
      }

      .Echarts {
        height: 300px;
      }

      .legend-box {
        padding: 20px 0;
        display: flex;
        justify-content: center;

        .legend {
          margin-left: 24px;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .icon {
            width: 12px;
            height: 12px;
            opacity: 1;
            background: #6ac0ff;
          }

          .yellow {
            background: #fba845;
          }

          .text {
            font-size: 12px;
            font-weight: 400;
            text-align: left;
            color: #404040;
            line-height: 17px;
            margin-left: 6px;
          }
        }
      }

      .padding0 {
        padding-bottom: 0;
      }
    }
  }
</style>
