<template>
  <a class="table-href" href="javascript:;" @click="onSelectStore(row)">
    选择
  </a>
</template>

<script>
  export default {
    props: ['row', 'col'],
    methods: {
      onSelectStore(row) {
        this.$emit('single-choosed', row);
      }
    }
  };
</script>
