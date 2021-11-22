<template>
  <div class="goods-info-column">
    <!-- <div
      class="goods-img"
      :style="{'background': 'transparent url('+(row.backgroundUrl||row.thumbnail||row.bgImg||row.coverUrl||row.unluckyPhotoUrl)+') no-repeat center / cover'}"
    ></div> -->
    <span class="item-name">{{row.activityName || row.name || row.itemName||row.title||row.topicName}}{{row.attrValCombineName ? '（' + row.attrValCombineName + '）' : ''}}</span>
  </div>
</template>

<script>
export default {
  props: ['row', 'col']
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
