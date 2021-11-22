export default {
  description: '招商管理',
  route: {
    path: '/merchants',
    component: () => import('../../views/merchants/index.vue'),
    meta: {
      title: '招商管理',
    },
  },
};
