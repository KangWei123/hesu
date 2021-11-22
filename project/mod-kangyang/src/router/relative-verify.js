export const verifyElderMembersRoute = {
  description: '亲友审核',
  route: {
    path: '/relative-verify',
    redirect: '/relative-verify/list',
    component: () => import('../views/relative-verify/index.vue'),
    meta: {
      title: '亲友审核',
    },
    children: [
      {
        path: '/relative-verify/list',
        component: () => import('../views/relative-verify/list.vue'),
        meta: {
          title: '亲友审核',
        },
      },
    ],
  },
};
