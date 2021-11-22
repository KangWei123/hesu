export default {
  description: '活动管理',
  route: {
    path: '/activity',
    component: () => import('../../views/activity/index.vue'),
    meta: {
      title: '活动管理',
    },
  },
};
