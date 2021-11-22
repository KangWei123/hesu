/*
* @Author: Neexz
* @Date: 2018-11-05 15:58:19
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-16 20:10:06
*/

<template>
  <!-- <wkb-page-nav :menuList="goodsMenu"
                parentsPath="/retail/goods-mgr/"> -->

  <div>
    <keep-alive>
      <wkb-page-nav :menuList="goodsMenu"
                    v-if="$route.meta.keepAlive" />
    </keep-alive>
    <wkb-page-nav :menuList="goodsMenu"
                  v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import { mapState } from 'vuex';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
// todo 先不要删，需要根据这个去匹配管理后台路由
// const goodsMenu = [
//   {
//     path: 'product',
//     name: '商品列表',
//     children: [
//       {
//         path: 'list',
//         name: '商品管理'
//       },
//       {
//         path: 'discard',
//         name: '废弃商品'
//       },
//       {
//         path: 'parameter',
//         name: '参数模板'
//       },
//       {
//         path: 'question-answer',
//         name: '问答模板'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.goods_list,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'goods-combined',
//     name: '组合商品',
//     children: [
//       {
//         path: 'goods-list',
//         name: '商品管理'
//       },
//       {
//         path: 'discard-list',
//         name: '废弃商品'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.combine_goods,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'gift-mgr',
//     name: '赠品管理',
//     children: [
//       {
//         path: 'list',
//         name: '赠品列表'
//       },
//       {
//         path: 'discard',
//         name: '废弃赠品'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.gift_mgr,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'classfiy',
//     name: '分类管理',
//     showBorder: true,
//     breadcrumbs: [
//       {
//         path: 'classfiy/detail',
//         name: '添加/编辑分类'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.classify_mgr,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'shelf',
//     name: '门店上架',
//     children: [
//       {
//         path: 'goods-shelf',
//         name: '普通商品'
//       },
//       {
//         path: 'combined-shelf',
//         name: '组合商品'
//       },
//       {
//         path: 'gift-shelf',
//         name: '赠品'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.store_shelf,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
//   },
//   {
//     path: 'comment-mgr',
//     name: '晒单管理',
//     children: [
//       {
//         path: 'list',
//         name: '晒单管理'
//       },
//       {
//         path: 'set-up',
//         name: '晒单设置'
//       }
//     ],
//     identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbGoodsMgrMenu.comment_mgr,
//     disabled: false,
//     disableTip: '该角色暂无权限访问'
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
