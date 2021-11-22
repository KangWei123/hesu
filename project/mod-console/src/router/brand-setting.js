export default {
  description: '品牌设置相关路由',
  route: {
    path: '/brand-setting',
    redirect: '/brand-setting/basic-data',
    component: () => import('../views/brand-setting/index.vue'),
    meta: {
      title: '品牌设置',
    },
    children: [
      {
        path: '/brand-setting/basic-data',
        component: () => import('../views/brand-setting/basic-data/index.vue'),
        meta: {
          title: '基础资料',
        },
      },
      {
        path: '/brand-setting/function-buy',
        redirect: '/brand-setting/function-buy/homepage',
        component: () => import('../views/brand-setting/function-buy/index.vue'),
        children: [
          {
            path: '/brand-setting/function-buy/homepage',
            component: () => import('../views/brand-setting/function-buy/homepage.vue'),
            meta: {
              title: '功能订购',
            },
          },
          {
            path: '/brand-setting/function-buy/contact-us',
            component: () => import('../views/brand-setting/function-buy/contact-us.vue'),
            meta: {
              title: '联系我们',
            },
          },
        ],
      },
      {
        path: '/brand-setting/invoice-setting',
        redirect: '/brand-setting/invoice-setting/view',
        component: () => import('../views/brand-setting/invoice-setting/index.vue'),
        meta: {
          title: '发票设置',
        },
        children: [
          {
            path: '/brand-setting/invoice-setting/view',
            component: () => import('../views/brand-setting/invoice-setting/view.vue'),
            meta: {
              title: '发票模板',
            },
          },
          {
            path: '/brand-setting/invoice-setting/edit',
            component: () => import('../views/brand-setting/invoice-setting/edit.vue'),
            meta: {
              title: '编辑发票模板',
            },
          },
          {
            path: '/brand-setting/invoice-setting/edit-company',
            component: () => import('../views/brand-setting/invoice-setting/edit-company.vue'),
            meta: {
              title: '编辑企业信息',
            },
          },
        ],
      },
      {
        path: '/brand-setting/general-setting',
        component: () => import('../views/brand-setting/general-setting/index.vue'),
        meta: {
          title: '通用设置',
        },
      },
      {
        path: '/brand-setting/ticket',
        component: () => import('../views/brand-setting/ticket/index.vue'),
        meta: {
          title: '票务设置',
        },
        children: [
          {
            path: '/brand-setting/ticket',
            component: () => import('../views/brand-setting/ticket/edit'),
            meta: {
              title: '编辑票务功能',
            },
          },
        ],
      },
      {
        path: '/brand-setting/dictionaries',
        redirect: '/brand-setting/dictionaries/list',
        component: () => import('../views/brand-setting/dictionaries/index.vue'),
        meta: {
          title: '数据字典',
        },
        children: [
          {
            path: '/brand-setting/dictionaries/list',
            component: () => import('../views/brand-setting/dictionaries/list.vue'),
            meta: {
              title: '数据字典列表',
            },
          },
        ],
      },
      {
        path: '/brand-setting/sorting',
        redirect: '/brand-setting/sorting/list',
        component: () => import('../views/brand-setting/sorting/index.vue'),
        meta: {
          title: '清分管理',
        },
        children: [
          {
            path: '/brand-setting/sorting/list',
            component: () => import('../views/brand-setting/sorting/list.vue'),
            meta: {
              title: '清分管理',
            },
          },
        ],
      },
      {
        path: '/brand-setting/estate-deal',
        component: () => import('../views/brand-setting/estate-deal/index.vue'),
        meta: {
          title: '电子协议',
        },
      },
    ],
  },
};
