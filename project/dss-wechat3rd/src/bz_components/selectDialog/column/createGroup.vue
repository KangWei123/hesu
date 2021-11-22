<template>
  <div>
    {{row.storeId? '区域 (' + row.storeName + ')':'总部'}}
  </div>
</template>

<script>
export default {
  props: ['row', 'col']
};
</script>
