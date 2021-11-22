<template>
  <div class="goods-info-column">
    <span v-if="!!row.createStoreId">门店活动</span>
    <span v-else>品牌活动</span>
  </div>
</template>

<script>
export default {
  name: 'haggleColumn',
  props: ['row', 'col']
};
</script>
