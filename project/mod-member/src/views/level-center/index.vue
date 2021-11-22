<template>
  <module-entry :business-scope-menu="dmpScopeMenu" page-name="等级中心"> </module-entry>
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
      memberCenterMenu: [],
      memberCenterKey: scopeMenuEnum.dictionary.dmpChildMenu.level_center,
    };
  },
  computed: {
    ...mapState({
      dmpScopeMenu: 'dmpScopeMenu',
    }),
  },
};
</script>

<style lang="less"></style>
