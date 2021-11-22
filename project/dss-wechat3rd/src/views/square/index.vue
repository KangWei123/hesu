<template>
  <module-entry :business-scope-menu="wkbScopeMenu" :module-menu-key="squareKey" :check-store="!showStoreTip" />
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
        squareKey: scopeMenuEnum.dictionary.wkbChildMenu.merchant,
      };
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      showStoreTip() {
        return this.$route.path.indexOf('category') > 0;
      },
    },
  };
</script>

<style lang="less">
  .wkt-breadcrumb-container {
    height: auto !important;
    line-height: normal !important;
    background: none !important;
  }
</style>
