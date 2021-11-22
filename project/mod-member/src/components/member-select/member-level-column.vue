<template>
  <span>{{ row.levelName || '' }}</span>
</template>

<script>
  export default {
    props: ['row'],
  };
</script>
