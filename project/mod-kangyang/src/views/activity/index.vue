<template>
  <div class="ky-page-wrapper">
    <module-entry :business-scope-menu="wkbScopeMenu" :module-menu-key="squareKey"></module-entry>
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
        squareKey: scopeMenuEnum.dictionary.wkbChildMenu.ky_activity_mgr,
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
  .el-form-item .el-date-editor .el-range__icon,
  .el-form-item .el-date-editor .el-range-separator {
    line-height: 24px;
  }

  .ky-page-wrapper /deep/ .wkt-breadcrumb-container {
    padding-left: 20px;
    padding-right: 20px;
  }
</style>
