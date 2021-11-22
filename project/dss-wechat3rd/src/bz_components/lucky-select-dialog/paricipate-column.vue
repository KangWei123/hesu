
<template>
  <div>
    <div v-if="row.participationType===0">无门槛</div>
    <div v-if="row.participationType===1">积分</div>
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],

  data() {
    return {
    };
  }
};
</script>
