<template>
  <div class="goods-info-column">
    <span>{{ row.quantity || '无限制' }}</span>
  </div>
</template>

<script>
  export default {
    props: ['row', 'col'],
    data() {
      return {};
    },
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
