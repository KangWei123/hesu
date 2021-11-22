<template>
  <div class="goods-info-column">
    <span v-if="row.couponCategory === CouponType.DISCOUNT_COUPON">{{ row.discountFee | discount }}折</span>
    <span v-else-if="row.couponCategory === CouponType.LOGISTICS_COUPON">
      <template v-if="row.discountFee === 0">免运费</template>
      <template v-else>{{ row.discountFee | price }}</template>
    </span>
    <span v-else-if="row.couponCategory === CouponType.GIFT_COUPON">{{ row.referenceValue || '实物' }}</span>
    <span v-else-if="row.couponCategory === CouponType.PARKING_AMOUNT_COUPON">{{ row.discountFee || '免停车费' }}</span>
    <span v-else-if="row.couponCategory === CouponType.PARKING_DURATION_COUPON">
      <template v-if="row.discountFee === 0">免停车费</template>
      <template v-else>{{ (row.discountFee * 60) | time2String }}</template>
    </span>
    <span v-else>{{ row.discountFee | price }}</span>
  </div>
</template>

<script>
  import { CouponType } from '@/dss-wechat3rd/src/constants/coupon';

  export default {
    props: ['row', 'col'],
    data() {
      return {
        CouponType,
      };
    },
  };
</script>

<style lang="less" scoped>
  .goods-info-column {
    .goods-img {
      width: 80px;
      height: 45px;
      vertical-align: middle;
      margin-right: 12px;
      display: inline-block;
    }
  }

  .item-name {
    vertical-align: middle;
    display: inline-block;
  }
</style>
