import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  routes: [
    // 销售分析
    {
      path: '/',
      redirect: '/sales/overview'
    },
    {
      path: '/sales/overview',
      component: () => import('../views/sales/overview/index.vue'),
      meta: {
        title: '销售分析-概览'
      }
    },
    {
      path: '/sales/sales-analysis',
      component: () => import('../views/sales/sales-analysis/index.vue'),
      meta: {
        title: '销售分析-销售额分析'
      }
    },
    {
      path: '/sales/order-analysis',
      component: () => import('../views/sales/order-analysis/index.vue'),
      meta: {
        title: '销售分析-订单分析'
      }
    },
    {
      path: '/sales/atv-analysis',
      component: () => import('../views/sales/atv-analysis/index.vue'),
      meta: {
        title: '销售分析-客单价分析'
      }
    },
    {
      path: '/sales/data-indicator',
      component: () => import('../views/sales/data-indicator/index.vue'),
      meta: {
        title: '销售分析-指标数据列表'
      }
    },

    // 会员分析
    {
      path: '/da-member/overview',
      component: () => import('../views/member/overview.vue'),
      meta: {
        title: '会员分析-概览'
      }
    },
    {
      path: '/da-member/trend-analysis',
      component: () => import('../views/member/trend-analysis.vue'),
      meta: {
        title: '会员分析-趋势分析'
      }
    },
    {
      path: '/da-member/contribution-analysis',
      component: () => import('../views/member/contribution-analysis.vue'),
      meta: {
        title: '会员分析-贡献分析'
      }
    },
    // 小程序
    {
      path: '/ma/overview',
      component: () => import('../views/ma/overview.vue'),
      meta: {
        title: '小程序-概览'
      }
    },
    {
      path: '/ma/Apply', // 应用概览
      component: () => import('../views/ma/Apply.vue'),
      meta: {
        title: '小程序-应用概览'
      }
    },
    {
      path: '/ma/Active', // 活跃分析
      component: () => import('../views/ma/Active.vue'),
      meta: {
        title: '小程序-活跃分析'
      }
    },
    {
      path: '/ma/Acquire', // 获取分析
      component: () => import('../views/ma/Acquire.vue'),
      meta: {
        title: '小程序-应用概览'
      }
    },
    {
      path: '/ma/Retent', // 留存分析
      component: () => import('../views/ma/Retent.vue'),
      meta: {
        title: '小程序-留存分析'
      }
    },
    {
      path: '/ma/Share', // 分享分析
      component: () => import('../views/ma/Share.vue'),
      meta: {
        title: '小程序-分享分析'
      }
    },
    {
      path: '/ma/Portrait', // 人群画像
      component: () => import('../views/ma/Portrait.vue'),
      meta: {
        title: '小程序-人群画像'
      }
    }
  ]
});

export default router;
