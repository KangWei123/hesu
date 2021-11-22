<template>
  <List :select-head-tab="1" />
</template>

<script>
  import List from './list';
  export default {
    name: 'Headquarters',
    components: {
      List,
    },
  };
</script>
