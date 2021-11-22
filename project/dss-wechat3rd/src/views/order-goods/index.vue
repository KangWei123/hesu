<template>
  <wkb-page-nav :show-page-name="false" :menuList="menu"></wkb-page-nav>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  components: {
    WkbPageNav
  },
  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu'
    })
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleMenu();
        }
      }
    }
  },
  data() {
    return {
      menu: []
    };
  },
  methods: {
    assembleMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.order_goods
      );
      this.menu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>

<style scoped>
</style>
