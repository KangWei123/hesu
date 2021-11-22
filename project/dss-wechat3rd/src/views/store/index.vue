<template>
  <wkb-page-nav :menu-list="storeMenu" :show-page-name="false"></wkb-page-nav>
</template>

<script>
  import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    name: 'GoodsIndex',
    components: {
      WkbPageNav,
    },
    computed: {
      ...mapState({
        wkbScopeMenu: 'wkbScopeMenu',
      }),
    },
    watch: {
      wkbScopeMenu: {
        immediate: true,
        handler() {
          if (this.wkbScopeMenu) {
            this.assembleGoodsMgrMenu();
          }
        },
      },
    },
    data() {
      return {
        storeMenu: [],
      };
    },
    methods: {
      assembleGoodsMgrMenu() {
        const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.store
        );
        this.storeMenu = scopeMenu && scopeMenu.childMenu;
      },
    },
  };
</script>

<style scoped></style>
