<template>
  <module-entry :business-scope-menu="wkbScopeMenu" :module-menu-key="scoreKey" class="module__entry" check-store />
</template>

<script>
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import ModuleEntry from '@/business-common/components/module-entry';

  import VueViewer from 'v-viewer';
  import Vue from 'vue';

  Vue.use(VueViewer);

  export default {
    components: {
      ModuleEntry,
    },
    data() {
      return {
        scoreKey: scopeMenuEnum.dictionary.wkbChildMenu.score_mgr,
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
