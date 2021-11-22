<template>
  <wkb-page-nav :menuList="estateMenu" />
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

// const estateMenu = [
//   {
//     path: 'building',
//     name: '楼盘列表'
//   },
//   {
//     path: 'shelf',
//     name: '区域上架'
//   },
//   {
//     path: 'comment',
//     name: '评论管理',
//     breadcrumbs: [
//       {
//         path: 'comment/edit',
//         name: '新增虚拟评论'
//       }
//     ]
//   }
// ];

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
      estateMenu: []
    };
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.estate_goods_mgr
      );

      this.estateMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
