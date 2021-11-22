<template>
  <wkb-page-nav class="assets-box" hide-nav :show-page-name="!!pageName" :page-name="pageName">
    <router-view></router-view>
  </wkb-page-nav>
</template>

<script>
  import './layout.less';
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';

  export default {
    components: {
      WkbPageNav,
    },

    data() {
      return {};
    },

    computed: {
      pageName() {
        let pageName = null;

        switch (this.$route.path) {
          case '/assets':
            pageName = '资产管理';
            break;
          case '/assets/recharge':
            pageName = '';
            break;
        }
        return pageName;
      },
    },
  };
</script>
