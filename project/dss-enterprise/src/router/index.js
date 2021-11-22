import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
      component: () => import('../views/index.vue'),
      meta: {
        title: '选择企业'
      }
    }
  ]
});

export default router;
