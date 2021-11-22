<template>
  <div class="time-column">
    {{ row[col.prop] | price }}
  </div>
</template>

<script>
export default {
  props: ['row', 'col']
};
</script>
