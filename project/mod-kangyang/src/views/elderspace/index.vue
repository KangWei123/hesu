<template>
  <div class="elderspace">
    <div class="elderspace__body">
      <div class="elderspace__header">长者空间</div>
      <picture-list />
    </div>
  </div>
</template>

<script>
  import PictureList from '../new-picture/picture-list/index.vue';

  /**
   * 长者空间
   */
  export default {
    name: 'ElderSpace',
    components: {
      PictureList,
    },
    provide: {
      moduleType: 2,
      isElderSpace: true,
    },
  };
</script>

<style scoped>
  .elderspace {
    padding: 25px 25px 0;
  }

  .elderspace__header {
    display: flex;
    line-height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-bottom: 1px solid #dcdee0;
  }

  .elderspace__body {
    background: #fff;
  }
</style>
