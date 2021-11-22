<template>
  <switch-store-tip>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </switch-store-tip>
</template>

<script>
  import SwitchStoreTip from '@/business-common/components/switch-store-tip/index.vue';

  export default {
    name: 'ListGoods',
    components: {
      SwitchStoreTip,
    },
  };
</script>

<style lang="less" scoped></style>
