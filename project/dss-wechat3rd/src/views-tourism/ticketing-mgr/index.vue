/* * @Author: yzd * @Date: 2019-06-22 17:23:00 * @Last Modified by: yzd * @Last Modified time: 2019-06-22 17:27:00 */

<template>
  <div>
    <keep-alive>
      <wkb-page-nav :menuList="ticketingMenu" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <wkb-page-nav :menuList="ticketingMenu" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

// const ticketingMenu = [
// {
//   path: 'ticket',
//   name: '票务列表',
//   showBorder: true,
//   children: [
//     {
//       path: 'list',
//       name: '票务管理'
//     },
//     {
//       path: 'discard',
//       name: '废弃列表'
//     }
//   ],
//   breadcrumbs: [
//     {
//       path: 'ticket/create',
//       name: '添加票务'
//     },
//     {
//       path: 'ticket/detail',
//       name: '票务详情'
//     },
//     {
//       path: 'ticket/operation-shelves',
//       name: '门店上下架'
//     }
//   ]
// },
// {
//   path: 'shelf',
//   name: '门店上架',
//   showBorder: true,
//   breadcrumbs: [
//     {
//       path: 'shelf/detail',
//       name: '票务详情'
//     }
//   ]
// },
// {
//   path: 'comment-mgr',
//   name: '评论管理',
//   breadcrumbs: [
//     {
//       path: 'comment-mgr/edit',
//       name: '添加虚拟评论'
//     }
//   ]
// }
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
      ticketingMenu: []
    };
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.ticketing_mgr
      );

      this.ticketingMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
