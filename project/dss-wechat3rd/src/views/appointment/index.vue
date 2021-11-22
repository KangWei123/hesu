<template>
  <WkbPageNav :menuList="menu"></WkbPageNav>
</template>

<script>
import { mapState } from 'vuex';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
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
          this.assembleGoodsMgrMenu();
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
    assembleGoodsMgrMenu() {
      const scopeMenu =
        scopeMenuEnum.getMenuScopeByIdentifier(this.wkbScopeMenu, scopeMenuEnum.dictionary.wkbChildMenu.appoint_mgr) &&
        scopeMenuEnum.getMenuScopeByIdentifier(this.wkbScopeMenu, scopeMenuEnum.dictionary.wkbChildMenu.appoint_mgr)
          .childMenu;

      this.menu = scopeMenu.map(item => {
        if (item.identifier === 'appoint_mgr_setting') {
          item.showBorder = true;
        }
        return item;
      });
    }
  }
};
</script>
