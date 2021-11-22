<template>
  <div class="time-column">
    <span v-if="row.couponCategory === couponEnum.couponCategory.discount">{{row[col.prop] | discount}}折</span>
    <span v-else>{{ row[col.prop] | price }}</span>
  </div>
</template>

<script>
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
export default {
  props: ['row', 'col'],
  data() {
    return {
      couponEnum
    };
  }
};
</script>
