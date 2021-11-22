<template>
  <div class="card-icon-column">
    <div class="card-img"
         :class="{'recharge-card': row.type == 4 && !row.styleUrl, 'times-card': row.type == 3 && !row.styleUrl}"
         :style="row.styleUrl | bgImage">
    </div>
    <span class="item-name"> {{row.name || row.itemName}}</span>
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],
  filters: {
    bgImage(val) {
      if (val) {
        return {
          backgroundImage: 'url(' + val + ')'
        };
      }
    }
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
