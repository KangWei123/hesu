<template>
  <WkbPageNav hide-nav page-name="数据字典" class="wkb-market dictionaries" :show-page-name="false">
    <router-view />
  </WkbPageNav>
</template>

<script>
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';

  export default {
    name: 'GiftIndex',
    components: {
      WkbPageNav,
    },
  };
</script>

<style lang="less">
  .dictionaries {
    .sub-nav-content {
      background-color: #ffffff;
    }
  }
</style>
