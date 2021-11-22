export const elderSpaceRoute = {
  description: '活动中心',
  route: {
    path: '/elderspace',
    component: () => import('../views/elderspace/index.vue'),
    meta: {
      title: '活动中心',
    },
  },
};
