<template>
  <div class="picture-index">
    <breadcrumb />
    <router-view />
  </div>
</template>

<script>
  import breadcrumb from './components/breadcrumb/index.vue';

  export default {
    name: 'PictureIndex',
    components: {
      breadcrumb,
    },
  };
</script>

<style scoped>
  .picture-index {
    margin: 24px;
    background-color: #fff;
  }
</style>
