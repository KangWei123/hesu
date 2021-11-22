import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/'
    },
    {
      path: '/403',
      component: () => import('../views/forwardEntry/index.vue'),
      meta: {
        title: '403'
      }
    },
    {
      path: '/basic-data',
      component: () => import('../views/basic-data/index.vue'),
      meta: {
        title: '基础资料'
      }
    },
    {
      path: '/function-buy',
      // redirect: '/function-buy/homepage',
      component: () => import('../views/function-buy/index.vue'),
      children: [
        {
          path: '/function-buy',
          component: () => import('../views/function-buy/homepage.vue'),
          meta: {
            title: '功能订购'
          }
        },
        {
          path: '/function-buy/order',
          component: () => import('@/dss-wechat3rd/src/views/StartUp/Order.vue'),
          meta: {
            title: '升级续费'
          }
        },
        {
          path: '/function-buy/contact-us',
          component: () => import('../views/function-buy/contact-us.vue'),
          meta: {
            title: '联系我们'
          }
        }
      ]
    },
    {
      path: '/invoice-setting',
      component: () => import('../views/invoice-setting/index.vue'),
      // redirect: '/invoice-setting/view',
      meta: {
        title: '发票设置'
      },
      children: [
        {
          path: '/invoice-setting',
          component: () => import('../views/invoice-setting/view.vue'),
          meta: {
            title: '发票模板'
          }
        },
        {
          path: '/invoice-setting/edit',
          component: () => import('../views/invoice-setting/edit.vue'),
          meta: {
            title: '编辑发票模板'
          }
        },
        {
          path: '/invoice-setting/edit-company',
          component: () => import('../views/invoice-setting/edit-company.vue'),
          meta: {
            title: '编辑企业信息'
          }
        }
      ]
    },
    {
      path: '/general-setting',
      component: () => import('../views/general-setting/index.vue'),
      meta: {
        title: '通用设置'
      }
    },
    {
      path: '/ticket',
      component: () => import('../views/ticket/index.vue'),
      meta: {
        title: '票务设置'
      },
      children: [
        {
          path: '/ticket',
          component: () => import('../views/ticket/edit'),
          meta: {
            title: '编辑票务功能'
          }
        }
      ]
    },
    {
      path: '/dictionaries',
      component: () => import('../views/dictionaries/index.vue'),
      redirect: '/dictionaries/list',
      meta: {
        title: '数据字典'
      },
      children: [
        {
          path: '/dictionaries/list',
          component: () => import('../views/dictionaries/list.vue'),
          meta: {
            title: '数据字典列表'
          }
        }
      ]
    },
    {
      path: '/sorting',
      component: () => import('../views/sorting/index.vue'),
      // redirect: '/sorting/list',
      meta: {
        title: '清分管理'
      },
      children: [
        {
          path: '/sorting',
          component: () => import('../views/sorting/list.vue'),
          meta: {
            title: '清分管理'
          }
        }
      ]
    },
    {
      path: '/estate-deal',
      component: () => import('../views/estate-deal/index.vue'),
      meta: {
        title: '电子协议'
      }
    }
  ]
});

export default router;
