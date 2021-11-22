<template>
  <div>{{row.batchNo&&row.batchNo!=='-1000'?row.batchNo:'N/A'}}</div>
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
