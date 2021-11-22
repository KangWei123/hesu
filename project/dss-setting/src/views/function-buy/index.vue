<template>
  <WkbPageNav :page-name="pageName"
              class="function-buy-content"
              :showPageName="!!pageName?true:false">
    <router-view></router-view>
  </WkbPageNav>
</template>
<script>
import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';
export default {
  components: { WkbPageNav },
  data() {
    return {
      isView: true
    };
  },
  computed: {
    pageName() {
      let pageName = null;
      switch (this.$route.path) {
        case '/function-buy/homepage':
          pageName = '功能订购';
          break;
      }
      return pageName;
    }
  }
};
</script>

<style lang="less">
  .function-buy-content {
    &.wkt-sub-nav-container .sub-nav-content-container .sub-nav-content .content-title {
      border-bottom: 1px solid @border-color;
    }
  }
</style>
