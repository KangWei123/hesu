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
      name: '门店管理',
      component: 'store-mgr',
    },
    {
      name: '门店设置',
      component: 'store-setting',
    },
  ];

  export default {
    name: 'StoreCenterEntry',
    components: {
      StoreMgr: () => import('../store-mgr/store-list'),
      StoreSetting: () => import('../store-setting'),
    },
    data() {
      return {
        active: 'store-mgr',
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
