<template>
  <div class="goods-info-column">
    <span v-if='row.validityType === cardEnum.validityType.permanent'>永久有效</span>
    <span v-else>{{ row[col.prop] }}天</span>
  </div>
</template>

<script>
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
export default {
  props: ['row', 'col'],
  data() {
    return {
      cardEnum: cardEnum
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
