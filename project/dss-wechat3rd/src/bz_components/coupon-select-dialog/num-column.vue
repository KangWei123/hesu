<template>
  <div>
    <!-- <div>总量：{{ row.quantity === couponEnum.QUANTITY.UNLIMITED ? '无限制' : row.quantity }}</div> -->
    <div>已领：{{ row.issueAmount }}</div>
  </div>
</template>

<script>
  import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';

  export default {
    props: ['row', 'col'],

    data() {
      return {
        couponEnum,
      };
    },
  };
</script>
