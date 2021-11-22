<template>
  <WkbPageNav
              hide-nav
              page-name="数据字典"
              class="wkb-market"
              :show-page-name="false">
    <router-view />
  </WkbPageNav>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
export default {
  name: 'gift-index',
  components: {
    WkbPageNav
  }
};
</script>
