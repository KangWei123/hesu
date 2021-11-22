import Vue from 'vue';
import Router from 'vue-router';
import env from '@/dss-common/utils/env';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      //默认路径区分 第三方合作厂商
      redirect: env.isThirdCorp() && !!env.getSearchValue('path') ? env.getSearchValue('path') : ''
    },
    {
      path: '/403',
      component: () => import('../views/forwardEntry/index.vue'),
      meta: {
        title: '403'
      }
    },
    {
      path: '/passflow/overview',
      component: () => import('../views/passflow/index.vue'),
      meta: {
        title: '客流统计'
      }
    },

    {
      path: '/passflow/camera-flow',
      component: () => import('../views/passflow/camera-flow/index.vue'),
      meta: {
        title: 'AP客流统计'
      }
    },
    {
      path: '/passflow/store-layout',
      component: () => import('../views/passflow/store-layout/index.vue'),
      meta: {
        title: '门店布局设置'
      }
    },
    {
      path: '/passflow/usermanage',
      component: () => import('../views/user-manage/index.vue'),
      meta: {
        title: '用户列表'
      }
    },
    {
      path: '/passflow/thermal-analysis',
      component: () => import('../views/passflow/thermal-analysis/index.vue'),
      meta: {
        title: '热力分析'
      }
    },
    {
      path: '/passflow/distribuion-flow',
      component: () => import('../views/passflow/distribuion-flow/index.vue'),
      meta: {
        title: '客流发布'
      }
    },
    {
      path: '/passflow/screen-list',
      component: () => import('../views/passflow/screen-list.vue'),
      meta: {
        title: 'AI人脸大屏'
      }
    },
    {
      path: '/passflow/review',
      component: () => import('../views/passflow/review.vue'),
      meta: {
        title: '回访分析'
      }
    },
    {
      path: '/passflow/enterrate',
      component: () => import('../views/passflow/enterRate.vue'),
      meta: {
        title: '进店分析'
      }
    },
    {
      path: '/passflow/vip',
      component: () => import('../views/passflow/vip.vue'),
      meta: {
        title: '会员统计'
      }
    },
    {
      path: '/track',
      component: () => import('../views/passflow/track/index'),
      meta: {
        title: '轨迹分析'
      }
    },
    {
      path: '/portrait/basis',
      component: () => import('../views/portrait/basis'),
      meta: {
        title: '基础画像'
      }
    },
    {
      path: '/portrait/consumption',
      component: () => import('../views/portrait/consumption'),
      meta: {
        title: '消费画像'
      }
    },
    {
      path: '/portrait/avocation',
      component: () => import('../views/portrait/avocation'),
      meta: {
        title: '兴趣画像'
      }
    },
    {
      path: '/portrait/vip',
      component: () => import('../views/portrait/vip.vue'),
      meta: {
        title: '会员画像'
      }
    },
    {
      path: '/diagnosis/passflow',
      component: () => import('../views/diagnosis/passflow.vue'),
      meta: {
        title: '客流诊断'
      }
    },
    {
      path: '/diagnosis/vip',
      component: () => import('../views/diagnosis/vip.vue'),
      meta: {
        title: '会员诊断'
      }
    },
    {
      path: '/diagnosis/sales',
      component: () => import('../views/diagnosis/sales.vue'),
      meta: {
        title: '销售诊断'
      }
    },
    {
      path: '/overview',
      component: () => import('../views/global'),
      meta: {
        title: '全局分析'
      }
    },
    {
      path: '/passflow/overview/report',
      component: () => import('../views/passflow/overview/report.vue'),
      meta: {
        title: '报表'
      }
    },
    {
      path: '/insight',
      component: () => import('../views/insight'),
      meta: {
        title: '用户洞察'
      }
    },
    {
      path: '/report/week',
      component: () => import('../views/report/week/index.vue'),
      meta: {
        title: '数字化门店周报'
      }
    },
    {
      name: 'activityList',
      path: '/activity/list',
      component: () => import('../views/activity/views/activities')
    },
    {
      name: 'createActivity',
      path: '/activity/create',
      component: () => import('../views/activity/views/create')
    },
    {
      name: 'effectAnalysis',
      path: '/activity/effect',
      component: () => import('../views/activity/views/effect')
    }
  ]
});

export default router;
