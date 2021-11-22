import scopeMenuEnum from '@/business-common/scopeMenuEnum';

export default {
  decorateMenu: [
    {
      path: 'mini-index',
      name: '小程序主页',
      showBorder: true,
      breadcrumbs: [
        {
          path: 'mini-index/preview',
          name: '模板预览'
        }
      ],
      id: 0,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_home,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'mine-decorate',
      name: '个人中心',
      showBorder: true,
      id: 1,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_mine_center,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'custom-page',
      name: '自定义页',
      showBorder: true,
      id: 2,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_custom_page,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'homepage-nav',
      name: '主页导航',
      showBorder: true,
      id: 3,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_nav,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'shopping-cart-style',
      name: '购物车样式',
      showBorder: true,
      id: 4,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_cart_style,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'category-nav',
      name: '分类导航',
      showBorder: true,
      id: 5,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_classify_nav,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      path: 'auxiliary-function-switch',
      name: '功能开关',
      showBorder: true,
      id: 6,
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wkbHomedecorateMenu.ma_func_switch,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    }
  ]
};
