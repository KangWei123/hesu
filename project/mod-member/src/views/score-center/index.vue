<template>
  <module-entry :business-scope-menu="dmpScopeMenu" :module-menu-key="memberCenterKey"> </module-entry>
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
        memberCenterKey: scopeMenuEnum.dictionary.dmpChildMenu.score_center,
      };
    },
    computed: {
      ...mapState({
        dmpScopeMenu: 'dmpScopeMenu',
      }),
    },
  };
</script>
