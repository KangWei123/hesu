<template>
  <div class="goods-info-column">
    {{(row.createTime || row.updateTime) | time}}
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
