<template>
  <div class="goods-info-column">
    <span v-if='!row.albumStatus'>未上架</span>
    <span v-else>已上架</span>
  </div>
</template>

<script>
export default {
  name: 'timeStampColumn',
  props: ['row', 'col'],
  filters: {}
};
</script>

<style lang="less" scoped>
</style>
