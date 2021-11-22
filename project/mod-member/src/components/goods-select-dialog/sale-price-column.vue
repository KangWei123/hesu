<template>
  <div class="goods-info-column">
    <template v-if="!row.salesType">{{ row[col.prop] | price }}</template>
    <template v-else>{{ row.displayPrice || '到店咨询' }}</template>
  </div>
</template>

<script>
  export default {
    props: ['row', 'col'],
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
</style>
