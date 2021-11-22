import pages from '../page';

/**
 * Created by love on 19/3/21.
 * @author trumpli<潘伟金>
 */
export default {
  description: '小程序装修相关（各个行业复用）',
  route: {
    path: '/setting/homedecorate',
    redirect: '/setting/homedecorate/mini-index',
    component: pages.setting.homedecorate.index,
    meta: {
      title: '小程序装修',
    },
    children: [
      {
        path: '/setting/homedecorate/mini-index',
        name: 'mini-index',
        component: pages.setting.homedecorate.miniIndex,
        redirect: '/setting/homedecorate/mini-index/template',
        meta: {
          title: '小程序主页',
        },
        children: [
          {
            path: '/setting/homedecorate/mini-index/template',
            name: 'mini-index-template',
            component: pages.setting.homedecorate.miniIndexTemplate,
            meta: {
              title: '装修模板',
            },
          },
          {
            path: '/setting/homedecorate/mini-index/store-index',
            component: pages.setting.homedecorate.storeIndex,
            meta: {
              title: '门店首页',
            },
          },
        ],
      },
      {
        path: '/setting/homedecorate/mine-decorate',
        name: 'mini-index',
        component: pages.setting.homedecorate.mineDecorate,
        meta: {
          title: '个人中心',
        },
      },
      {
        path: '/setting/homedecorate/park-decorate',
        name: 'park',
        component: pages.setting.homedecorate.parkDecorate,
        meta: {
          title: '停车缴费',
        },
      },
      {
        path: '/setting/homedecorate/mine-decorate/detail',
        name: 'mine-detail',
        component: pages.setting.homedecorate.mineDecorateDetail,
        meta: {
          title: '个人中心配置',
        },
      },
      {
        path: '/setting/homedecorate/custom-page',
        component: pages.setting.homedecorate.customPage,
        meta: {
          title: '自定义页',
        },
      },

      /** 新增小程序设置，糅合主页导航、购物车设置、功能开关页面 */
      {
        path: '/setting/homedecorate/setup',
        redirect: '/setting/homedecorate/setup/homepage-nav',
        component: pages.setting.homedecorate.setup,
        meta: {
          title: '小程序设置',
        },
        children: [
          {
            path: '/setting/homedecorate/setup/homepage-nav',
            component: pages.setting.homedecorate.homepageNav,
            meta: {
              title: '主页导航',
            },
          },
          {
            path: '/setting/homedecorate/setup/shopping-cart-style',
            component: pages.setting.homedecorate.shoppingCartStyle,
            meta: {
              title: '购物车样式',
            },
          },
          {
            path: '/setting/homedecorate/setup/auxiliary-function-switch',
            component: pages.setting.homedecorate.auxiliaryFunctionSwitch,
            meta: {
              title: '辅助功能开关',
            },
          },
        ],
      },

      {
        path: '/setting/homedecorate/floor-guide',
        component: pages.setting.homedecorate.floorGuide,
        meta: {
          title: '楼层导览',
        },
      },
      {
        path: '/setting/homedecorate/category-nav',
        component: pages.setting.homedecorate.categoryNav,
        meta: {
          title: '分类导航',
        },
      },
      {
        path: '/setting/homedecorate/store-link',
        component: pages.setting.homedecorate.storeLink,
        meta: {
          title: '网店链接',
        },
      },
      // {
      //   path: '/setting/homedecorate/custom-page/decorate',
      //   component: pages.setting.homedecorate.decorate,
      //   meta: {
      //     title: '新增自定义页'
      //   }
      // },

      {
        path: '/setting/homedecorate/mini-index/preview',
        component: pages.setting.homedecorate.preview,
        meta: {
          title: '模板预览',
        },
      },
    ],
  },
};
