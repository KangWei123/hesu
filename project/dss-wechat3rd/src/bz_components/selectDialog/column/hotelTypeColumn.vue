<template>
  <div class="card-icon-column">
    <span> {{row.hotelType?mgrTypeEnum.hotel.combo.label:mgrTypeEnum.hotel.oddDay.label}}</span>
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
.card-icon-column {
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
