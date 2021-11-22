<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  name: 'lucky'
};
</script>

<style lang="less">
.group-list {
  .el-pagination {
    text-align: center;
  }
}
</style>
