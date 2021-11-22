<template>
  <div>
    <span v-if="row.receiveMethod === couponEnum.receiveMethod.free">免费领取</span>
    <span v-else>支付{{row.integral}}积分</span>
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
