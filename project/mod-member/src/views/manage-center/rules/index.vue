<template>
  <main>
    <span class="help-page">
      <i>?</i>
      <router-link to="/manage/help" tag="span" class="left-help">帮助说明</router-link>
    </span>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <slot />
  </main>
</template>

<style scoped lang="less">
  .help-page {
    position: absolute;
    right: 20px;
    top: 20px;
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
</style>

<script>
  export default {
    data() {
      return {};
    },
    methods: {},
  };
</script>
