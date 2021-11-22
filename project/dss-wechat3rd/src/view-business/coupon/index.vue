<template>
  <module-entry class="business-coupon" :business-scope-menu="wkbScopeMenu" page-name="账号管理"> </module-entry>
</template>

<script>
  import { mapState } from 'vuex';
  import ModuleEntry from '@/business-common/components/module-entry/index.vue';

  export default {
    components: {
      ModuleEntry,
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
    },
  };
</script>

<style lang="less" scoped>
  .business-coupon /deep/ .wkt-breadcrumb-container {
    height: auto !important;
    line-height: normal !important;
    background: none !important;
  }
</style>
