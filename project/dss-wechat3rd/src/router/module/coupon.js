import Noop from '@/dss-common/components/noop';

export default {
  description: '发券宝管理',
  route: {
    path: '/business/coupon',
    redirect: '/business/coupon/account',
    component: () => import('../../view-business/coupon/index.vue'),
    meta: {
      title: '发券宝管理',
    },
    children: [
      {
        path: '/business/coupon/account',
        redirect: '/business/coupon/account/list',
        component: Noop,
        meta: {
          title: '账号管理',
        },
        children: [
          {
            path: '/business/coupon/account/list',
            component: () => import('../../view-business/coupon/account/index.vue'),
            meta: {
              title: '账号管理',
            },
          },
          {
            path: '/business/coupon/account/add-in',
            component: () => import('../../view-business/coupon/account/add-in.vue'),
            meta: {
              title: '添加内部人员账号',
              bread: true,
            },
          },
          {
            path: '/business/coupon/account/add-out',
            component: () => import('../../view-business/coupon/account/add-out.vue'),
            meta: {
              title: '添加外部人员账号',
              bread: true,
            },
          },
          {
            path: '/business/coupon/account/add-out/edit',
            component: () => import('../../view-business/coupon/account/add-out.vue'),
            meta: {
              title: '编辑账号',
              bread: true,
            },
          },
          {
            path: '/business/coupon/account/config',
            component: () => import('../../view-business/coupon/account/permission/index.vue'),
            meta: {
              title: '发券权限',
              bread: true,
            },
          },
        ],
      },
    ],
  },
};
