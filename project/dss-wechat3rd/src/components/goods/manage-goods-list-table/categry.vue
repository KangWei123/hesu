<template>
  <span class="category ellipsis" :title="row.categoryDTO.category">{{ row.categoryDTO.category }}</span>
</template>

<script>
export default {
  props: ['row', 'col']
};
</script>
