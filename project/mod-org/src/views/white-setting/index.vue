<template>
  <module-entry :business-scope-menu="companyScopeMenu" page-name="IP白名单设置" :module-menu-key="companyCenterKey">
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
        companyCenterKey: scopeMenuEnum.dictionary.companyChildMenu.white_setting,
      };
    },
    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
      }),
    },
  };
</script>

<style scoped lang="less"></style>
