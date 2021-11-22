
<template>
  <div class="ellipsis">
    {{ row | suitGoods}}
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],

  data() {
    return {};
  },
  filters: {
    suitGoods(row) {
      if (row.suitItemType === 0) {
        return '全部商品';
      } else if (row.suitItemType === 1) {
        return row.itemBriefs
          .map(v => {
            return v.name;
          })
          .join(' ');
      } else {
        return row.categoryBriefs
          .map(v => {
            return v.name;
          })
          .join(' ');
      }
    }
  }
};
</script>
