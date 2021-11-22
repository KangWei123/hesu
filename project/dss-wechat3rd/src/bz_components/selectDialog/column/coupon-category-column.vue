<template>
  <div class="goods-info-column">
    {{ couponTypeMap[row[col.prop]] }}
  </div>
</template>

<script>
  import { couponTypeMap } from '@/dss-wechat3rd/src/constants/coupon';

  export default {
    props: ['row', 'col'],
    data() {
      return {
        couponTypeMap,
      };
    },
  };
</script>
