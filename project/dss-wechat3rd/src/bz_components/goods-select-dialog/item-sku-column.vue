<template>
  <div>{{ row.itemName||row.name}} {{(row.itemAttrAsStr||row.attrValCombineName) ? '(' + (row.itemAttrAsStr||row.attrValCombineName)+')':''}}</div>
</template>

<script>
export default {
  props: ['row', 'col']
};
</script>

<style lang="less" scoped>
</style>
