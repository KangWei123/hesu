<template>
  <div class="flow-panel">
    <div class="title">
      {{ data.description }}
    </div>
    <div class="number flow-num">
      <span v-for="(item, index) in moveY" :key="moveY.length - index" class="num-box">
        <span class="num-item" :style="{ transform: 'translateY(-' + item + '%)' }" v-if="item != 100">
          <span class="num">0</span>
          <span class="num">1</span>
          <span class="num">2</span>
          <span class="num">3</span>
          <span class="num">4</span>
          <span class="num">5</span>
          <span class="num">6</span>
          <span class="num">7</span>
          <span class="num">8</span>
          <span class="num">9</span>
        </span>
        <span class="split-item" v-else>,</span>
      </span>
    </div>
    <div class="vip-count">
      <span class="label">会员次数：</span>
      <span class="number vip-num">{{ data.vipCount || 0 }}</span>
    </div>

    <div class="border" :class="{ 'border-left': borderLeft, 'border-right': borderRight }"></div>
  </div>
</template>

<script>
  import { setTimeout, clearInterval } from 'timers';
  export default {
    props: {
      data: {
        type: Object,
        default() {
          return {};
        },
      },
      borderLeft: {
        type: Boolean,
        default: false,
      },
      borderRight: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        moveY: [0],
      };
    },
    watch: {
      'data.passengerFlowCount'(val, oVal) {
        if (!val) {
          val = 0;
        }
        if (!oVal) {
          oVal = 0;
        }
        const arr = this.formatNum(val).split('');
        this.moveY = [];
        arr.forEach((item, index) => {
          if (isNaN(item)) {
            this.moveY.push(100);
          } else {
            this.moveY.push(item * 10);
          }
        });
      },
    },
    methods: {
      formatNum(val) {
        const str = val.toString();
        let result = '';
        let toFormatStr = str;
        for (let i = 0; i < str.length; i = i + 3) {
          result = toFormatStr.slice(-3) + (result.length ? ',' : '') + result;
          toFormatStr = toFormatStr.slice(0, toFormatStr.length - 3);
        }
        return result;
      },
    },
  };
</script>

<style scoped lang="less">
  @import '../css/base.less';

  .flow-panel {
    text-align: center;
    position: relative;

    .title {
      color: @font-blue;
      font-size: 16px;
      line-height: 16px;
    }

    .vip-count {
      color: @font-blue;
      font-size: 14px;
      line-height: 29px;
    }

    .flow-num {
      color: #19c1ff;
      font-size: 0;
      line-height: 31px;
      width: 250px;
      height: 37px;
      overflow: hidden;

      .num-box {
        display: inline-block;
        vertical-align: top;
      }

      .num-item {
        display: inline-block;
        width: 20px;
        font-size: 36px;
        transition: all 1s;
      }

      .num {
        display: inline-block;
        width: 100%;
        padding: 5px 0;
      }

      .split-item {
        display: inline-block;
        width: 15px;
        font-size: 36px;
        line-height: 36px;
      }
    }

    .border {
      position: absolute;
      top: 20px;
      width: 257px;
      height: 32px;
    }

    .border-left {
      border-left: 3px dashed @border-blue;
    }

    .border-right {
      border-right: 3px dashed @border-blue;
    }
  }
</style>
