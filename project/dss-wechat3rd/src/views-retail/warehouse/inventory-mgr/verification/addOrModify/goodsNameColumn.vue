<template>
  <div class="goods-info">
    <div class="goods-img">
      <i v-if="row.thumbnail===''"
         class="el-icon-question avatar-size" />
      <img v-else
           :src="row.thumbnail" />
    </div>

    <div class="item-name"> {{ row.itemName }} {{itemAttrAsStr?'('+itemAttrAsStr+')':''}}</div>
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],

  watch: {
    row(newVal, oldVal) {
      this.itemAttrAsStr = newVal.itemAttrAsStr ? '(' + newVal.itemAttrAsStr + ')' : '';
    }
  },

  data() {
    return {
      itemAttrAsStr: this.row.itemAttrAsStr ? '(' + this.row.itemAttrAsStr + ')' : ''
    };
  }
};
</script>

<style lang="less" scoped>
.goods-info {
  min-width: auto;
  align-items: center;
  display: table;

  .goods-img {
    overflow: visible;
    display: table-cell;
  }

  .item-name {
    line-height: normal;
    display: table-cell;
    vertical-align: middle;
  }
}
</style>
