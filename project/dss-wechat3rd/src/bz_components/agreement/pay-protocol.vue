<template>
    <div class="agreement">
      <div v-html="payContent"></div>
    </div>
</template>

<script>
  export default {
    name: 'pay-protocol',
    props: {
      payContent: {
        type: String
      }
    }
  };
</script>

<style scoped>
  .agreement {
    max-width: 1000px;
    margin: 0 auto;
    padding: 50px;
    background: white;
  }
</style>
