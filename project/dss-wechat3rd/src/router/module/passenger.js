export default {
  description: '客流管理',
  route: {
    path: '/store',
    component: () => import('../../views/store/index.vue'),
    meta: {
      title: '客流管理',
    },
    children: [
      {
        path: '/store/passflow/overview',
        component: () => import('../../views/store/views/passflow/index.vue'),
        meta: {
          title: '客流统计',
        },
      },

      {
        path: '/store/passflow/camera-flow',
        component: () => import('../../views/store/views/passflow/camera-flow/index.vue'),
        meta: {
          title: 'AP客流统计',
        },
      },
      {
        path: '/store/passflow/store-layout',
        component: () => import('../../views/store/views/passflow/store-layout/index.vue'),
        meta: {
          title: '门店布局设置',
        },
      },
      {
        path: '/store/passflow/usermanage',
        component: () => import('../../views/store/views/user-manage/index.vue'),
        meta: {
          title: '用户列表',
        },
      },
      {
        path: '/store/passflow/thermal-analysis',
        component: () => import('../../views/store/views/passflow/thermal-analysis/index.vue'),
        meta: {
          title: '热力分析',
        },
      },
      {
        path: '/store/passflow/distribuion-flow',
        component: () => import('../../views/store/views/passflow/distribuion-flow/index.vue'),
        meta: {
          title: '客流发布',
        },
      },
      {
        path: '/store/passflow/screen-list',
        component: () => import('../../views/store/views/passflow/screen-list.vue'),
        meta: {
          title: 'AI人脸大屏',
        },
      },
      {
        path: '/store/passflow/review',
        component: () => import('../../views/store/views/passflow/review.vue'),
        meta: {
          title: '回访分析',
        },
      },
      {
        path: '/store/passflow/enterrate',
        component: () => import('../../views/store/views/passflow/enterRate.vue'),
        meta: {
          title: '进店分析',
        },
      },
      {
        path: '/store/passflow/vip',
        component: () => import('../../views/store/views/passflow/vip.vue'),
        meta: {
          title: '会员统计',
        },
      },
      {
        path: '/store/track',
        component: () => import('../../views/store/views/passflow/track/index'),
        meta: {
          title: '轨迹分析',
        },
      },
      {
        path: '/store/portrait/basis',
        component: () => import('../../views/store/views/portrait/basis'),
        meta: {
          title: '基础画像',
        },
      },
      {
        path: '/store/portrait/consumption',
        component: () => import('../../views/store/views/portrait/consumption'),
        meta: {
          title: '消费画像',
        },
      },
      {
        path: '/store/portrait/avocation',
        component: () => import('../../views/store/views/portrait/avocation'),
        meta: {
          title: '兴趣画像',
        },
      },
      {
        path: '/store/portrait/vip',
        component: () => import('../../views/store/views/portrait/vip.vue'),
        meta: {
          title: '会员画像',
        },
      },
      {
        path: '/store/diagnosis/passflow',
        component: () => import('../../views/store/views/diagnosis/passflow.vue'),
        meta: {
          title: '客流诊断',
        },
      },
      {
        path: '/store/diagnosis/vip',
        component: () => import('../../views/store/views/diagnosis/vip.vue'),
        meta: {
          title: '会员诊断',
        },
      },
      {
        path: '/store/diagnosis/sales',
        component: () => import('../../views/store/views/diagnosis/sales.vue'),
        meta: {
          title: '销售诊断',
        },
      },
      {
        path: '/store/overview',
        component: () => import('../../views/store/views/global'),
        meta: {
          title: '全局分析',
        },
      },
      {
        path: '/store/passflow/overview/report',
        component: () => import('../../views/store/views/passflow/overview/report.vue'),
        meta: {
          title: '报表',
        },
      },
      {
        path: '/store/insight',
        component: () => import('../../views/store/views/insight'),
        meta: {
          title: '用户洞察',
        },
      },
      {
        path: '/store/report/week',
        component: () => import('../../views/store/views/report/week/index.vue'),
        meta: {
          title: '数字化门店周报',
        },
      },
      {
        name: 'activityList',
        path: '/store/activity/list',
        component: () => import('../../views/store/views/activity/views/activities'),
      },
      {
        name: 'createActivity',
        path: '/store/activity/create',
        component: () => import('../../views/store/views/activity/views/create'),
      },
      {
        name: 'effectAnalysis',
        path: '/store/activity/effect',
        component: () => import('../../views/store/views/activity/views/effect'),
      },
    ],
  },
};
