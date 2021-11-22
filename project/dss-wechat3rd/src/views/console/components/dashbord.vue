<template>
  <div class="dashbord">
    <div class="dashbord__header">
      <div v-if="$slots['title']" class="dashbord__title"><slot name="title"></slot></div>
      <div v-if="$slots['filters']" class="dashbord__filters"><slot name="filters"></slot></div>
    </div>
    <el-row>
      <div class="dashbord__center" v-if="isBusiness">
        <div v-for="(item, index) in fields" :key="index" class="item" :style="item.itemStyle">
          <div class="item-name">{{ item.name }}</div>
          <div v-html="formatNum(item.value, item.unit)" class="item-num"></div>
          <div class="item-icon" :class="item.icon"></div>
          <div v-if="item.tip" class="item-tip">
            {{ item.prefix }}{{ item.tip }} {{ item.suffix }}
            <i
              v-if="item.tip != 0"
              :class="{ [item.tipIcon]: true, [item.tipStatus]: item.tip != 0, 'dashbord__content-tipicon': true }"
            ></i>
          </div>
        </div>
      </div>
      <el-col :span="6" v-for="(item, index) in fields" v-else :key="index">
        <div class="dashbord__item">
          <div v-html="formatNum(item.value, item.unit)" class="dashbord__num"></div>
          <div class="dashbord__content">
            <span class="dashbord__content-icon" :class="item.icon"></span>
            <div class="dashbord__content-desc">{{ item.name }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      fields: {
        type: Array,
        default: () => [],
      },
      isBusiness: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      formatNum() {
        return (value, unit = '') => {
          const splitValue = value.toString().split('.');
          const integer = splitValue[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
          const decimal = splitValue[1];

          if (decimal) {
            return `${integer}.<span style="font-size:20px;">${decimal}</span> <span class="num-unit">${unit}</span>`;
          }
          return `${integer} <span class="num-unit">${unit}</span>`;
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .dashbord {
    background: #fff;
    border-radius: 4px;
    padding: 24px;
    margin-bottom: 24px;
    box-sizing: border-box;

    &__title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      border-bottom: 1px solid #ebeef5;
      color: #303133;
      padding-bottom: 12px;
      box-sizing: border-box;
      line-height: 20px;
      margin-bottom: 20px;
    }

    &__center {
      display: grid;
    }

    .item {
      border-radius: 4px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #fff;
      position: relative;

      &-name {
        font-family: PingFangSC, PingFangSC-Medium;
      }

      &-num {
        font-weight: 500;
        flex: 1;
        font-family: 'DIN';
        white-space: nowrap;
        margin: 14px 0;
      }

      &-tip {
        & .dashbord__content-tipicon {
          font-size: 12px;

          &.active {
            color: #fa7517;
          }
        }
      }

      &-icon {
        position: absolute;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }
    }

    @media (max-width: 1659px) {
      &__center {
        grid-template-columns: repeat(5, 18.4%);
        grid-gap: 2%;
      }

      .item {
        padding: 10px;
      }

      .item-name {
        font-size: 13px;
      }

      .item-num {
        font-size: 20px;
      }

      /deep/ .num-unit {
        font-size: 13px;
      }

      .item-tip {
        font-size: 13px;
      }

      .item-icon {
        right: 4px;
        top: 30px;
        width: 52px;
        height: 52px;
      }
    }
    @media (min-width: 1660px) {
      &__center {
        grid-template-columns: repeat(5, 18.4%);
        grid-gap: 2%;
      }

      .item {
        padding: 16px;
      }

      .item-name {
        font-size: 16px;
      }

      .item-num {
        font-size: 36px;
      }

      /deep/ .num-unit {
        font-size: 20px;
      }

      .item-tip {
        font-size: 18px;
      }

      .item-icon {
        right: 6px;
        top: 38px;
        width: 80px;
        height: 80px;
      }
    }

    &__num {
      font-size: 26px;
      color: #303133;
      font-weight: 500;
      margin-bottom: 9px;
      font-family: 'DIN';
      line-height: 33px;
    }

    &__content {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      &-icon {
        width: 18px;
        height: 18px;
        margin-right: 3px;
        background-repeat: no-repeat;
        background-size: cover;
      }

      &-desc {
        font-size: 14px;
      }
    }
  }
</style>
