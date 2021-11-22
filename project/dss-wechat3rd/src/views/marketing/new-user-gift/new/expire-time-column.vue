<template>
  <div>
    <span v-if="row.couponType === couponEnum.couponType.default">领取后{{ row.fixedTerm }}天过期</span>
    <span v-else>{{ row.beginTime | time('YYYY-MM-DD')}} 至 {{ row.endTime | time('YYYY-MM-DD')}}</span>
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
