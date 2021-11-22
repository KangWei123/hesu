<template>
  <WkbPageNav :menuList="menu"
              :isHideNav="true">
  </WkbPageNav>
</template>

<script>
import { mapState } from 'vuex';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';

export default {
  components: {
    WkbPageNav
  },

  computed: {
    ...mapState({
      env: 'env'
    }),

    menu() {
      return [
        {
          name: '票务设置',
          url: '/ticket',
          showBorder: true
        }
      ];
    }
  }
};
</script>
