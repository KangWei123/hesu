<template>
  <div class="ky-page-wrapper">
    <module-entry :business-scope-menu="dmpScopeMenu" :module-menu-key="memberCenterKey"></module-entry>
  </div>
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
        memberCenterKey: scopeMenuEnum.dictionary.dmpChildMenu.elders,
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
  .el-form-item .el-date-editor .el-range__icon,
  .el-form-item .el-date-editor .el-range-separator {
    line-height: 24px;
  }

  .ky-page-wrapper /deep/ .wkt-breadcrumb-container {
    padding: 15px 24px;
    background-color: #fff !important;
    border-bottom: 1px solid #f2f6fc;
  }
</style>
