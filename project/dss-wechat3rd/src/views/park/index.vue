<template>
  <module-entry :business-scope-menu="wkbScopeMenu" :module-menu-key="parkMgrKey" :check-store="showStoreTip" />
</template>

<script>
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import ModuleEntry from '@/business-common/components/module-entry';

  export default {
    components: {
      ModuleEntry,
    },
    data() {
      return {
        parkMgrKey: scopeMenuEnum.dictionary.wkbChildMenu.park_mgr,
      };
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      showStoreTip() {
        return (
          this.$route.path.indexOf('park-config') > 0 ||
          this.$route.path.indexOf('fuse-record') > 0 ||
          this.$route.path.indexOf('invoice-setting') > 0
        );
      },
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
