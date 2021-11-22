export const elderRoute = {
  description: '活动中心',
  route: {
    path: '/elders',
    redirect: '/elders/list',
    component: () => import('../views/elders/index.vue'),
    meta: {
      title: '长者列表',
    },
    children: [
      {
        path: '/elders/list',
        component: () => import('../views/elders/list.vue'),
        meta: {
          title: '长者列表',
          bread: true,
        },
      },
      {
        path: '/elders/create',
        name: 'elder.create',
        component: () => import('../views/elders/form-page.vue'),
        meta: {
          title: '新增长者',
          bread: true,
        },
      },
      {
        path: '/elders/edit/:elderId',
        name: 'elder.edit',
        component: () => import('../views/elders/form-page.vue'),
        meta: {
          title: '修改长者',
          bread: true,
        },
      },
      {
        path: '/elders/:elderId/member/create',
        name: 'elder.member.create',
        component: () => import('../views/elders/member-form-page.vue'),
        meta: {
          title: '新增亲友',
          bread: true,
        },
      },
      {
        path: '/elders/:elderId/member/edit/:id',
        name: 'elder.member.edit',
        component: () => import('../views/elders/member-form-page.vue'),
        meta: {
          title: '修改亲友',
          bread: true,
        },
      },
      {
        path: '/elders/:id',
        name: 'elder.detail',
        component: () => import('../views/elders/detail.vue'),
        meta: {
          title: '长者详情',
          bread: true,
        },
      },
    ],
  },
};

export const familyMemberRoute = {
  description: '亲友',
  route: {
    path: '/family-members',
    redirect: '/family-members/list',
    component: () => import('../views/family-members/index.vue'),
    meta: {
      title: '亲友',
    },
    children: [
      {
        path: '/family-members/list',
        component: () => import('../views/family-members/list'),
        meta: {
          title: '亲友',
          bread: true,
        },
      },
      {
        path: '/family-members/:id',
        component: () => import('../views/family-members/detail.vue'),
        meta: {
          title: '亲友详情',
        },
      },
    ],
  },
};

export const normalCustomersRoute = {
  description: '普通客户',
  route: {
    path: '/normal-customers',
    redirect: '/normal-customers/list',
    component: () => import('../views/normal-customers/index.vue'),
    meta: {
      title: '普通客户',
    },
    children: [
      {
        path: '/normal-customers/list',
        component: () => import('../views/normal-customers/list'),
        meta: {
          title: '普通客户',
          bread: true,
        },
      },
    ],
  },
};
