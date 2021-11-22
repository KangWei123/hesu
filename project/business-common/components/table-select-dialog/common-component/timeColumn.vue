<template>
  <div class="time-column">
    {{ row[col.prop] | time }}
  </div>
</template>

<script>
  export default {
    props: ['row', 'col'],
  };
</script>
