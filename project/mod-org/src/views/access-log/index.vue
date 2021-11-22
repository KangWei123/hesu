<template>
  <module-entry :business-scope-menu="companyScopeMenu" page-name="访问日志" :module-menu-key="companyCenterKey">
  </module-entry>
</template>
<script>
  import ModuleEntry from '@/business-common/components/module-entry/index.vue';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  import { mapState } from 'vuex';

  export default {
    components: {
      ModuleEntry,
    },
    data() {
      return {
        companyCenterKey: scopeMenuEnum.dictionary.companyChildMenu.access_log,
      };
    },
    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
      }),
    },
  };
</script>
<style lang="less" scoped></style>
