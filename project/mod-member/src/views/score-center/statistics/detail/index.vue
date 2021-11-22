<template>
  <div class="score-stat-detail">
    <el-tabs type="card" v-model="active">
      <el-tab-pane v-for="item of TABS" :key="item.name" :label="item.name" :name="item.component" lazy>
        <component :is="item.component" :app-id="appId" :settlement="settlement"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  const TABS = [
    {
      name: '积分明细',
      component: 'detail',
    },
    {
      name: '时间报表',
      component: 'by-time',
    },
    {
      name: '类型报表',
      component: 'by-type',
    },
  ];

  export default {
    name: 'ScoreStat',
    components: {
      Detail: () => import('./detail'),
      ByTime: () => import('./by-time'),
      ByType: () => import('./by-type'),
    },
    data() {
      return {
        active: 'detail',
        TABS,
      };
    },
    computed: {
      appId() {
        return this.$route.query.appId != null ? parseInt(this.$route.query.appId) : undefined;
      },
      settlement() {
        return this.$route.query.settlement != null ? this.$route.query.settlement : undefined;
      },
    },
  };
</script>

<style lang="less">
  .score-stat-detail {
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
