<template>
  <div class="article-type-column">
    <span v-if="row.status===0">已下架</span>
    <span v-if="row.status===1">已上架</span>
    <span v-if="row.status===2">已删除</span>
  </div>
</template>

<script>
import mgrTypeEnum from '@/dss-wechat3rd/src/constants/mgrTypeEnum.js';
export default {
  props: ['row', 'col'],
  data() {
    return {
      mgrTypeEnum: mgrTypeEnum
    };
  }
};
</script>

<style lang="less" scoped>
.article-type-column {
  .card-img {
    width: 80px;
    height: 45px;
    vertical-align: middle;
    margin-right: 12px;
    display: inline-block;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .recharge-card {
    background-image: url(../../../images/card/recharge-card.png);
  }

  .times-card {
    background-image: url(../../../images/card/times-card.png);
  }
}

.item-name {
  vertical-align: middle;
  display: inline-block;
}
</style>
