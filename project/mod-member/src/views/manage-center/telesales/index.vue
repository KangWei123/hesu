<template>
  <main>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <slot />
  </main>
</template>

<style scoped lang="less">
  .breadcrumb-container {
    background: #ffffff;
    color: #333333;
    padding: 17px 20px 10px 20px;
    box-sizing: border-box;
    font-weight: 400;
    border-bottom: 1px solid #dcdde0;
    display: flex;
    justify-content: space-between;
    span {
      display: flex;
      align-items: center;
      cursor: pointer;
      i {
        width: 16px;
        height: 16px;
        margin-right: 5px;
        border: 1px solid #666;
        border-radius: 50%;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        color: #666;
        display: inline-block;
        vertical-align: middle;
        font-style: normal;
        font-family: PingFangSC-Regular;
      }
      .left-help {
        color: #3879fb;
      }
    }
  }
  .breadcrumb-item {
    cursor: pointer;
    display: inline-block;
    padding: 5px 9px;
    box-sizing: border-box;
    border-radius: 2px;
    margin-right: 10px;
    background: #f5f7fa;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    font-size: 12px;
    color: #999;
    border: 1px solid transparent;
    list-style: none;
    cursor: pointer;
  }
  .router-link-active {
    border: 1px solid #256eff;
    color: #256eff;
  }
</style>

<script>
  export default {
    data() {
      return {};
    },
  };
</script>
