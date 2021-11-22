import Vue from 'vue';
import Router from 'vue-router';
import Coming from '@/business-common/components/coming-soon';
import Noop from '@/dss-common/components/noop';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/inventory',
    },
    {
      path: '/inventory',
      redirect: '/inventory/commodity_pool',
      component: () => import('../views/inventory/index.vue'),
      meta: {
        title: '权益库存资源',
      },
      children: [
        {
          path: '/inventory/commodity_pool',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '自有权益商品入库',
          },
        },
        {
          path: '/inventory/stock_mall',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '采购商城',
          },
        },
        {
          path: '/inventory/inventory_allocation',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '分配权益商品',
          },
        },
        {
          path: '/inventory/inventory_record',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '出库记录明细',
          },
        },
        {
          path: '/inventory/inventory_tag',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '库存标签',
          },
        },
        {
          path: '/inventory/inventory_section',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '库存分类',
          },
        },
      ],
    },
    {
      path: '/mall',
      redirect: '/mall/mall_conf',
      component: () => import('../views/inventory/index.vue'),
      meta: {
        title: '权益商城配置',
      },
      children: [
        {
          path: '/mall/mall_conf',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '权益商品上下架',
          },
        },
        {
          path: '/mall/mall_record',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '兑换记录明细',
          },
        },
      ],
    },
    {
      path: '/act',
      redirect: '/mall/act_manager',
      component: () => import('../views/inventory/index.vue'),
      meta: {
        title: '权益积分活动',
      },
      children: [
        {
          path: '/mall/act_manager',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '活动管理',
          },
        },
        {
          path: '/mall/act_create',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '创建活动',
          },
        },
        {
          path: '/mall/act_lottery_record',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '活动中奖记录',
          },
        },
      ],
    },
    {
      path: '/task',
      redirect: '/task/task_activity',
      component: () => import('../views/inventory/index.vue'),
      meta: {
        title: '权益积分任务',
      },
      children: [
        {
          path: '/task/task_activity',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '任务配置',
          },
        },
        {
          path: '/task/task_style',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '任务样式',
          },
        },
        {
          path: '/task/task_introduction',
          component: () => import('../views/inventory/index.vue'),
          meta: {
            title: '操作指引',
          },
        },
      ],
    },
  ],
});

export default router;
