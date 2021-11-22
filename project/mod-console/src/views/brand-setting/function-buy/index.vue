<template>
  <WkbPageNav :page-name="pageName" class="function-buy-content" :show-page-name="false">
    <router-view></router-view>
  </WkbPageNav>
</template>
<script>
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';

  export default {
    components: { WkbPageNav },
    data() {
      return {
        isView: true,
      };
    },
    computed: {
      pageName() {
        let pageName = null;
        switch (this.$route.path) {
          case '/brand-setting/function-buy/homepage':
            pageName = '功能订购';
            break;
        }
        return pageName;
      },
    },
  };
</script>
<style lang="less">
  .function-buy-content {
    .sub-nav-content {
      background-color: #ffffff;
    }
  }
</style>
