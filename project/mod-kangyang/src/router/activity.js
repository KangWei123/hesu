import Noop from '@/dss-common/components/noop';

export const activityRoute = {
  description: '活动中心',
  route: {
    path: '/ky-activity',
    redirect: '/ky-activity/list',
    component: () => import('../views/activity/index.vue'),
    meta: {
      title: '活动中心',
    },
    children: [
      {
        path: '/ky-activity/list',
        component: Noop,
        redirect: '/ky-activity/list/index',
        children: [
          {
            path: '/ky-activity/list/index',
            component: Noop,
            redirect: '/ky-activity/list/index',
            children: [
              {
                path: '/ky-activity/list/index',
                component: () => import('../views/activity/list/index.vue'),
                meta: {
                  title: '活动列表',
                },
              },
              {
                path: '/ky-activity/list/draft',
                name: 'ky-activity.draft',
                component: () => import('../views/activity/list/draft.vue'),
                meta: {
                  title: '草稿箱',
                  bread: true,
                },
              },
              {
                path: '/ky-activity/list/trash',
                name: 'ky-activity.trash',
                component: () => import('../views/activity/list/trash.vue'),
                meta: {
                  title: '回收站',
                  bread: true,
                },
              },
              {
                path: '/ky-activity/list/create',
                component: () => import('../views/activity/create-or-edit/index.vue'),
                name: 'ky-activity.create',
                meta: {
                  title: '发布活动',
                  bread: true,
                },
              },
              {
                path: '/ky-activity/list/edit/:code',
                component: () => import('../views/activity/create-or-edit/index.vue'),
                name: 'ky-activity.edit',
                meta: {
                  title: '编辑活动',
                  bread: true,
                },
              },
              {
                path: '/ky-activity/list/type',
                component: () => import('../views/activity/types/index.vue'),
                name: 'ky-activity.types',
                meta: {
                  title: '活动类型',
                  bread: true,
                },
              },
              {
                path: '/ky-activity/list/:code',
                name: 'ky-activity.detail',
                component: () => import('../views/activity/detail/index.vue'),
                meta: {
                  title: '活动详情',
                  bread: true,
                },
              },
            ],
          },
        ],
      },
      {
        path: '/ky-activity/reservation',
        component: () => import('../views/activity/users/index.vue'),
        meta: {
          title: '名单管理',
        },
      },
    ],
  },
};
