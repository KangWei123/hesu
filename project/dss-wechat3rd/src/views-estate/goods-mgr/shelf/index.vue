<template>
  <switch-store-tip store-label="区域">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </switch-store-tip>
</template>

<script>
  import SwitchStoreTip from '@/business-common/components/switch-store-tip/index.vue';

  export default {
    components: {
      SwitchStoreTip,
    },
  };
</script>
