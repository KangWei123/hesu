<template>
  <module-entry :business-scope-menu="dmpScopeMenu" :module-menu-key="memberCenterKey"> </module-entry>
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
        memberCenterKey: scopeMenuEnum.dictionary.dmpChildMenu.member_center,
      };
    },
    computed: {
      ...mapState({
        dmpScopeMenu: 'dmpScopeMenu',
      }),
    },
  };
</script>

<style lang="less" scoped>
  .el-form-item__content,
  .el-form-item__label {
    line-height: 36px;
  }

  .el-table::before {
    display: none;
  }
</style>
