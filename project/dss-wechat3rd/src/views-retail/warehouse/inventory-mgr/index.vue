/*
* @Author: Neexz
* @Date: 2018-11-05 16:00:25
* @Last Modified by: Neexz
* @Last Modified time: 2018-11-07 11:55:36
*/

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
    components: {}
  };
</script>

<style lang="less">
  @import "./inventory.less";

  .inventory-container {
    &.wkb-page-category > div:last-child {
      background-color: #f8f9fe;
    }

    &.wkb-page-category .aside-decorate {
      padding-top: 10px;
    }
  }

</style>

