/* * @Author: yzd * @Date: 2019-06-14 15:57:00 * @Last Modified by: yzd * @Last Modified time: 2019-06-14 16:16:00 */

<template>
  <div>
    <keep-alive>
      <wkb-page-nav :menuList="hotelMenu" v-if="$route.meta.keepAlive" />
    </keep-alive>
    <wkb-page-nav :menuList="hotelMenu" v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

// const hotelMenu = [
// {
//   path: 'rooms-mgr',
//   name: '房型列表',
//   children: [
//     {
//       path: 'list',
//       name: '房型管理'
//     },
//     {
//       path: 'discard',
//       name: '废弃列表'
//     }
//   ],
//   breadcrumbs: [
//     {
//       path: 'rooms-mgr/create',
//       name: '添加房型'
//     },
//     {
//       path: 'rooms-mgr/detail',
//       name: '房型详情'
//     },
//     {
//       path: 'rooms-mgr/operation-shelves',
//       name: '门店上下架'
//     }
//   ]
// },
// {
//   path: 'shelf',
//   name: '门店上架',
//   breadcrumbs: [
//     {
//       path: 'shelf/detail',
//       name: '房型详情'
//     }
//   ]
// },
// {
//   path: 'comment',
//   name: '评论管理',
//   breadcrumbs: [
//     {
//       path: 'comment/edit',
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
      hotelMenu: []
    };
  },
  methods: {
    assembleGoodsMgrMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.hotel_mgr
      );

      this.hotelMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
