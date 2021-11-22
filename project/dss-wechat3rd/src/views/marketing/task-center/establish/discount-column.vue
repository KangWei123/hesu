<template>
  <div class="time-column">
    <span v-if="row.couponCategory === couponEnum.couponCategory.discount">{{row[col.prop] | discount}}折</span>
    <span v-else>{{ row[col.prop] | price }}</span>
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
