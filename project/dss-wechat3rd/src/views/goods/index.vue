<template>
  <wkb-page-nav :menuList="goodsMenu"></wkb-page-nav>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  name: 'goods-index',
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
      goodsMenu: []
    };
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.goods_mgr
      );
      this.goodsMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>

<style scoped>
</style>
