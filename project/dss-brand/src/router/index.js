import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/brand'
    },
    {
      path: '/brand',
      redirect: '/create/brand',
      component: () => import('../views/create/index.vue'),
      meta: {
        title: '品牌首页'
      },
      children: [
        {
          path: '/create/brand',
          component: () => import('../views/create/brand.vue'),
          meta: {
            title: '创建品牌'
          }
        },
        {
          path: '/create/function',
          component: () => import('../views/create/function.vue'),
          meta: {
            title: '选购功能'
          }
        },
        {
          path: '/create/brand-success',
          component: () => import('../views/create/brand-success.vue'),
          meta: {
            title: '选购功能'
          }
        },
        {
          path: '/create/store',
          component: () => import('../views/create/store.vue'),
          meta: {
            title: '创建门店'
          }
        },
        {
          path: '/create/store-success',
          component: () => import('../views/create/store-success.vue'),
          meta: {
            title: '创建门店成功'
          }
        }
      ]
    },
    {
      path: '/contact-us',
      component: () => import('../views/contact-us/index.vue'),
      meta: {
        title: '联系我们'
      }
    }
  ]
});

export default router;
