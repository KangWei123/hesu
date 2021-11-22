<template>
  <div>
    <span v-if="row.couponType === couponEnum.couponType.default">领取后{{ row.fixedTerm }}天过期</span>
    <span v-else>{{ row.beginTime | time}} 至 {{ row.endTime | time}}</span>
  </div>
</template>

<script>
import couponEnum from './CouponStatusEnum';

export default {
  props: ['row', 'col'],

  data() {
    return {
      couponEnum
    };
  }
};
</script>
