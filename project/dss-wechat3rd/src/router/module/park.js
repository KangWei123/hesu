export default {
  description: '停车场管理',
  route: {
    path: '/park',
    redirect: '/park/park-config',
    component: () => import('../../views/park/index.vue'),
    meta: {
      title: '停车场管理',
    },
    children: [
      {
        path: '/park/park-config',
        redirect: '/park/park-config/list',
        component: () => import('../../views/park/park-config/index.vue'),
        meta: {
          title: '停车场列表',
        },
        children: [
          {
            path: '/park/park-config/list',
            component: () => import('../../views/park/park-config/list/index.vue'),
            meta: {
              title: '停车场列表',
            },
          },
          {
            path: '/park/park-config/edit',
            component: () => import('../../views/park/park-config/park-form/index.vue'),
            meta: {
              title: '车场配置',
              bread: true,
              backUrl: '/park/park-config/list',
            },
          },
          {
            path: '/park/park-config/setting',
            component: () => import('../../views/park/park-config/setting/index.vue'),
            meta: {
              title: '缴费配置',
              bread: true,
              backUrl: '/park/park-config/list',
            },
          },
        ],
      },
      {
        path: '/park/park-order',
        component: () => import('../../views/park/park-order/index.vue'),
        meta: {
          title: '车场订单',
        },
      },

      {
        path: '/park/fuse-record',
        component: () => import('../../views/park/fuse-record/index.vue'),
        meta: {
          title: '熔断记录',
        },
      },
      {
        path: '/park/invoice-record',
        component: () => import('../../views/park/invoice-record/index.vue'),
        meta: {
          title: '发票记录',
        },
      },
      {
        path: '/park/invoice-setting',
        redirect: '/park/invoice-setting/list',
        component: () => import('../../views/park/park-config/index.vue'),
        meta: {
          title: '开票配置',
        },
        children: [
          {
            path: '/park/invoice-setting/list',
            component: () => import('../../views/park/invoice-record/invoice-setting.vue'),
            meta: {
              title: '开票配置',
            },
          },
          {
            path: '/park/invoice-setting/add-invoice',
            component: () => import('../../views/park/invoice-record/add-invoice.vue'),
            meta: {
              title: '开票配置',
              bread: true,
              backUrl: '/park/invoice-setting/list',
            },
          },
        ],
      },
      {
        path: '/park/data-statistics',
        component: () => import('../../views/park/data-statistics/index.vue'),
        meta: {
          title: '数据统计',
        },
      },
      {
        path: '/park/license-plate',
        component: () => import('../../views/park/license-plate/index.vue'),
        meta: {
          title: '车牌管理',
        },
      },
    ],
  },
};
