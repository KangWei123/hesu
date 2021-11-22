import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('../views/index.vue'),
      redirect: '/startup/chose',
      meta: {
        title: '创建店铺'
      },
      children: [
        {
          path: '/startup/create',
          component: () => import('../views/Create.vue'),
          meta: {
            title: '创建店铺'
          }
        },
        {
          path: '/startup/template-list',
          component: () => import('../views/template-list.vue'),
          meta: {
            title: '行业模版'
          }
        },
        {
          path: '/startup/industry',
          component: () => import('../views/Industry.vue'),
          meta: {
            title: '行业选择'
          }
        },
        {
          path: '/startup/chose',
          component: () => import('../views/Chose.vue'),
          meta: {
            title: '选择店铺'
          }
        }
      ]
    }
  ]
});

export default router;
