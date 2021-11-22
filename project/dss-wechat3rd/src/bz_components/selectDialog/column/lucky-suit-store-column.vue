<template>
  <div class="ellipsis">
    {{ row[col.prop] | storeNames }}
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],
  filters: {
    storeNames(val) {
      if (!val || !val.length) {
        return '全部门店';
      }
      return val
        .map(v => {
          return v;
        })
        .join(' ');
    }
  }
};
</script>
