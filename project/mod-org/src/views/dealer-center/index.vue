<template>
  <module-entry :business-scope-menu="companyScopeMenu" page-name="经销商中心" :module-menu-key="companyCenterKey">
  </module-entry>
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
        companyCenterKey: scopeMenuEnum.dictionary.companyChildMenu.dealer_center,
      };
    },
    computed: {
      ...mapState({
        companyScopeMenu: 'companyScopeMenu',
      }),
    },
  };
</script>

<style lang="less"></style>
