<template>
  <!-- <module-entry :business-scope-menu="companyScopeMenu" page-name="品牌设置" :module-menu-key="companyCenterKey">
  </module-entry> -->
  <router-view></router-view>
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
        companyCenterKey: scopeMenuEnum.dictionary.companyChildMenu.brand_setting,
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
