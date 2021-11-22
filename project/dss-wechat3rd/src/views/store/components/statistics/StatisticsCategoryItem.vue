<template>
  <div class="item-container"
       :class="{'item-divider':hasDivider}">
    <div class="label">{{label}}</div>
    <div class="data-container"
         :class="{'data-divider':hasDivider}">
      <div class="period-container">
        <span class="this-period-data">{{computeTotalCount}}</span>
        <span class="last-period-label">{{lastPeriodLabel}}</span>
        <span class="last-period-data">{{computeLastPeriodCount}}</span>
      </div>
      <div class="target-container">
        <div class="target-progress-container"
             :class="computeIsOverTarget ? 'target-border-over' : 'target-border'">
          <div class="inner-target-progress-container">
            <div class="period-progress"></div>
            <div :class="computeIsOverTarget ? 'target-progress-over' : 'target-progress'"
                 :style="{width: computeTargetProgress + '%'}"></div>
          </div>

        </div>
        <div class="target-data-container">
          <div class="target-data-label">{{targetLabel}}</div>
          <div class="target-data-rate">
            <span class="target-data">{{computeTargetCount}}</span>
            <span class="target-rate"
                  v-if="computeIsOverTarget">+{{computeTargetRate}}%</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import utils from '@/dss-common/utils';

export default {
  name: 'statistics-item',
  props: {
    label: String,
    lastPeriodLabel: String,
    targetLabel: String,
    hasDivider: Boolean,
    totalCount: Number,
    lastPeriodCount: Number,
    targetCount: Number
  },
  computed: {
    /*根据totalCount计算，如果totalCount为0，则显示"-"*/
    computeTotalCount() {
      return this.totalCount >= 0 ? utils.addSeparator(this.totalCount) : '-';
    },

    /*计算上一个同期*/
    computeLastPeriodCount() {
      return this.lastPeriodCount >= 0 ? utils.addSeparator(this.lastPeriodCount) : 'N/A';
    },

    /*计算这个周期的目标值*/
    computeTargetCount() {
      return this.targetCount && this.targetCount >= 0 ? utils.addSeparator(this.targetCount) : 'N/A';
    },

    /*计算是否超出目标*/
    computeIsOverTarget() {
      return this.targetCount && this.totalCount >= this.targetCount;
    },

    /*计算这个周期和目标值的比例*/
    computeTargetRate() {
      if (this.targetCount) {
        if (this.totalCount >= this.targetCount) {
          return utils.decimalToPercent((this.totalCount - this.targetCount) / this.targetCount);
        }
      }
      return 0;
    },

    /*计算这个周期跟目标值的比率，也就是目标进度条的宽度*/
    computeTargetProgress() {
      if (this.targetCount) {
        if (this.totalCount >= this.targetCount) {
          return 100;
        } else {
          return (this.totalCount / this.targetCount) * 100;
        }
      } else {
        return 0;
      }
    }
  }
};
</script>

<style scoped lang="less">
.item-container {
  padding-left: 2%;
  /*padding-right: 2%;*/
  min-width: 200px;
  @media screen and (max-width: 949px) {
    margin-left: 15%;
    margin-right: 15%;
    padding: 20px 0px;
  }

  @media screen and (max-width: 590px) {
    min-width: 210px;
  }

  @media screen and (min-width: 1450px) {
    padding-left: 5%;
  }
}

.label {
  font-family: PingFangSC-Semibold;
  font-size: 18px;
  color: #3b4757;
  letter-spacing: 0;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    font-size: 14px;
  }
}

.data-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /*height: 90px;*/
  margin-top: 10px;
  padding-right: 2%;
  @media screen and (max-width: 949px) {
    padding-right: 0px;
  }
  @media screen and (min-width: 1450px) {
    padding-right: 5%;
  }
  .period-container {
    .this-period-data {
      font-family: DINPro-Medium;
      font-size: 25px;
      color: #3b4757;
      letter-spacing: 0;
      @media screen and (min-width: 1450px) {
        font-size: 42px;
      }

      @media screen and (max-width: 949px) {
        font-size: 42px;
      }
    }

    .last-period-label {
      opacity: 0.5;
      font-family: PingFangSC-Medium;
      font-size: 10px;
      color: #012334;
      letter-spacing: 0;
      margin-left: 10px;
      @media screen and (min-width: 1450px) {
        font-size: 14px;
      }

      @media screen and (max-width: 949px) {
        font-size: 14px;
      }
    }

    .last-period-data {
      font-family: DINPro-Medium;
      font-size: 16px;
      color: #3b4757;
      letter-spacing: 0;
      margin-left: 6px;
      @media screen and (min-width: 1450px) {
        font-size: 22px;
      }
      @media screen and (max-width: 949px) {
        font-size: 22px;
      }
    }
  }

  .target-container {
    display: flex;
    flex-direction: row;

    .target-progress-container {
      width: 71%;
      height: 40px;
      display: flex;
      align-items: center;
      .inner-target-progress-container {
        width: 100%;
        height: 9px;
        position: relative;
        .period-progress {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(142, 170, 199, 0.2);
          border-radius: 4.5px;
          z-index: 1 !important;
        }
        .target-progress {
          position: absolute;
          height: 100%;
          background-image: linear-gradient(90deg, #3cbaf8 4%, #3499fe 100%);
          border-radius: 4.5px;
          z-index: 1 !important;
        }

        .target-progress-over {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(90deg, #ffaf59 4%, #fb6042 100%);
          border-radius: 4.5px;
          z-index: 1 !important;
        }
      }
    }

    .target-border {
      border-right: 1px dashed #3499fe;
    }

    .target-border-over {
      border-right: 2px dashed #fa674a;
    }

    .target-data-container {
      margin-left: 10px;

      .target-data-label {
        opacity: 0.5;
        font-family: PingFangSC-Medium;
        font-size: 10px;
        color: #012334;
        letter-spacing: 0;
        @media screen and (min-width: 1450px) {
          font-size: 14px;
        }
        @media screen and (max-width: 949px) {
          font-size: 14px;
        }
      }

      .target-data-rate {
        display: flex;
        flex-direction: row;
        align-items: center;
        .target-data {
          opacity: 0.5;
          font-family: DINPro-Medium;
          font-size: 16px;
          color: #3b4757;
          letter-spacing: 0;
          @media screen and (min-width: 1450px) {
            font-size: 22px;
          }
          @media screen and (max-width: 949px) {
            font-size: 22px;
          }
        }
        .target-rate {
          margin-left: 10px;
          ont-family: DIN-Medium;
          font-size: 12px;
          color: #fb6042;
          letter-spacing: 0;
          text-align: center;

          @media screen and (min-width: 1450px) {
            font-size: 18px;
          }
          @media screen and (max-width: 949px) {
            font-size: 18px;
          }
        }
      }
    }
  }
}

.data-divider {
  @media screen and (min-width: 950px) {
    border-right: 1px solid rgba(1, 35, 52, 0.15);
  }
}

.item-divider {
  @media screen and (max-width: 949px) {
    border-bottom: 1px solid rgba(1, 35, 52, 0.15);
  }
}
</style>
