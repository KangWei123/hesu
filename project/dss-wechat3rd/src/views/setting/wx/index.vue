<template>
  <WkbPageNav :menuList="wxMenu" :title-style="{borderRadius: '4px', boxShadow: '0px 2px 6px 0px rgba(0,0,0,0.06)', border: 0}"></WkbPageNav>
</template>

<script>
import { mapState } from 'vuex';
import WkbPageNav from '@/dss-wechat3rd/src/components/wkb-page-nav/index.vue';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  components: {
    WkbPageNav
  },
  data() {
    return {
      wxMenu: []
    };
  },
  computed: {
    ...mapState({
      wkbScopeMenu: 'wkbScopeMenu'
    })
    // wxMenu() {
    //   return [
    //     {
    //       path: 'mp',
    //       name: '小程序设置',
    //       children: [
    //         {
    //           path: 'version',
    //           name: '客户小程序授权'
    //         },
    //         {
    //           path: 'user_deal',
    //           name: '员工小程序授权'
    //         }
    //       ],
    //       identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.ma_setting,
    //       disabled: false,
    //       disableTip: '该角色暂无权限访问'
    //     },
    //     {
    //       path: 'card',
    //       name: '微信卡券',
    //       showBorder: true,
    //       breadcrumbs: [
    //         {
    //           path: 'card/course',
    //           name: '开通教程'
    //         }
    //       ],
    //       identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.wx_card,
    //       disabled: false,
    //       disableTip: '该角色暂无权限访问'
    //     },
    //     {
    //       path: 'pay',
    //       name: '支付设置',
    //       showBorder: true,
    //       identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.wx_pay,
    //       disabled: false,
    //       disableTip: '该角色暂无权限访问'
    //     },
    //     {
    //       path: 'pc',
    //       name: '公众号设置',
    //       showBorder: true,
    //       identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.mp_setting,
    //       disabled: false,
    //       disableTip: '该角色暂无权限访问'
    //     },
    //     {
    //       path: 'qy',
    //       name: '企业微信设置',
    //       showBorder: true,
    //       identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.wx_qy,
    //       disabled: false,
    //       disableTip: '该角色暂无权限访问'
    //     }
    //   ];
    // }
  },
  watch: {
    wkbScopeMenu: {
      immediate: true,
      handler() {
        if (this.wkbScopeMenu) {
          this.assembleWxSettingMenu();
        }
      }
    }
  },
  methods: {
    assembleWxSettingMenu() {
      const scopeMenu = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wx_setting
      );

      this.wxMenu = scopeMenu && scopeMenu.childMenu;
    }
  }
};
</script>
