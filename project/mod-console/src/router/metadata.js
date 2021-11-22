export default {
  description: '元数据相关路由',
  route: {
    path: '/metadata',
    redirect: '/metadata/management',
    component: () => import('../views/brand-setting/index.vue'),
    // component: () => import('../views/metadata/management/index.vue'),
    meta: {
      title: '元数据',
    },
    children: [
      {
        path: '/metadata/management',
        component: () => import('../views/metadata/management/index.vue'),
        meta: {
          title: '元数据链接',
        },
      },
      {
        path: '/metadata/list',
        component: () => import('../views/metadata/management/list'),
        meta: {
          title: '元数据账号',
        },
      },
      {
        path: '/metadata/management/authorization',
        component: () => import('../views/metadata/management/authorization.vue'),
        meta: {
          title: '授权状态',
        },
      },
    ],
  },
};
