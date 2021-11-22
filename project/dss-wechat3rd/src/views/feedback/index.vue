<template>
  <module-entry :business-scope-menu="wkbScopeMenu" :module-menu-key="feedKey" page-name="意见反馈" check-store />
</template>

<script>
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import ModuleEntry from '@/business-common/components/module-entry/index.vue';

  export default {
    components: {
      ModuleEntry,
    },
    data() {
      return {
        feedKey: scopeMenuEnum.dictionary.wkbChildMenu.feedback,
      };
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .wkt-breadcrumb-container {
    height: auto !important;
    line-height: normal !important;
    background: none !important;
  }
</style>
