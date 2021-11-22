<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.gift-card-tab {
  .el-pagination {
    text-align: center;
  }
}
</style>
