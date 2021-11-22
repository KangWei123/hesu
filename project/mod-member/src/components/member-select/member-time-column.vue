<template>
  <span>{{ row.registerTime || row.createTime }}</span>
</template>

<script>
  export default {
    props: ['row'],
  };
</script>
