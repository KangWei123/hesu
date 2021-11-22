<template>
  <div class="store-center-entry">
    <el-tabs type="card" v-model="active">
      <el-tab-pane v-for="item of TABS" :key="item.name" :label="item.name" :name="item.component" lazy>
        <component :is="item.component"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  const TABS = [
    {
      name: '组织管理',
      component: 'org-mgr',
    },
    {
      name: '组织属性',
      component: 'org-org-attr',
    },
  ];

  export default {
    name: 'OrgCenterEntry',
    components: {
      OrgMgr: () => import('../org-mgr/org-list'),
      OrgOrgAttr: () => import('../org-org-attr'),
    },
    data() {
      return {
        active: 'org-mgr',
        TABS,
      };
    },
  };
</script>

<style lang="less">
  .store-center-entry {
    .el-tabs__nav-scroll {
      background-color: white;
      padding-left: 24px;
      padding-top: 14px;
    }

    .el-tabs__header {
      margin-bottom: 2px;
    }
  }
</style>
