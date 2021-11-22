<template>
  <div class="arrow-rate">
    <span v-if="rateLabel" style="margin-right: 10px">{{rateLabel}}</span>
    <i class="key-icon" :class="computeArrow" style="height: 16px;" v-if="rate"></i>
    <span class="rate">{{computeRate}}</span>
  </div>
</template>

<script>
  import utils from '@/dss-common/utils';

  export default {
    name: 'ArrowRate',
    props: {
      rateLabel: {
        type: String,
        default: ''
      },
      rate: {
        type: Number,
        default: null
      }
    },

    computed: {
      computeArrow() {
        return this.rate && this.rate > 0 ? 'key-icon-thin-green-arrow-up' : 'key-icon-thin-green-arrow-down';
      },

      computeRate() {
        return this.rate === null ? 'N/A' : utils.decimalToPercent(Math.abs(this.rate)) + '%';
      }
    }
  };
</script>

<style lang="less" scoped>
  .arrow-rate {
    display: flex;
    align-items: center;
    height: 16px;
    line-height: 16px;
    .rate {
      margin-left: 5px;
    }
  }
</style>
