<template>
  <WkbPageNav class="ticket-manage" :menu-list="menu" :is-hide-nav="true"> </WkbPageNav>
</template>

<script>
  import { mapState } from 'vuex';
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';

  export default {
    components: {
      WkbPageNav,
    },

    computed: {
      ...mapState({
        env: 'env',
      }),

      menu() {
        return [
          {
            name: '票务设置',
            url: '/brand-setting/ticket',
            showBorder: true,
          },
        ];
      },
    },
  };
</script>
<style lang="less">
  .ticket-manage {
    .sub-nav-content {
      background-color: #ffffff;
    }
  }
</style>
