<template>
  <div class="goods-info-column">
    <span v-if="row.couponType===couponEnum.couponType.default">领取后{{row.fixedTerm}}天过期</span>
    <span v-else>{{row.beginTime||row.startTime |time('YYYY-MM-DD')}} 至 {{row.endTime |time('YYYY-MM-DD')}}</span>
  </div>
</template>

<script>
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum';
export default {
  props: ['row', 'col'],
  data() {
    return {
      couponEnum: couponEnum
    };
  }
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
