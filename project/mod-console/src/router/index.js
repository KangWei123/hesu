import Vue from 'vue';
import Router from 'vue-router';
import settingWx from './setting-wx';
import Noop from '@/dss-common/components/noop';
import brandSetting from './brand-setting';
import metadata from './metadata';
import { router as modOrg } from '@/register/org';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/',
    },
    {
      path: '/companyManage',
      redirect: '/companyManage/dealer-center',
      component: Noop,
      meta: {
        title: '企业管理',
      },
      children: [
        ...modOrg.options.routes,
        {
          path: '/companyManage/log-center',
          redirect: '/companyManage/log-center/list',
          component: () => import('../views/log-center/index.vue'),
          meta: {
            title: '日志中心',
          },
          children: [
            {
              path: '/companyManage/log-center/list',
              component: () => import('../views/log-center/log-list/index.vue'),
              meta: {
                title: '日志中心',
              },
            },
          ],
        },
        settingWx.route,
        brandSetting.route,
        metadata.route,
      ],
    },

    /* {
      path: '/guide-center',
      component: () => import('../views/guide-center/index.vue'),
      meta: {
        title: '导购中心'
      },
      children: [
        {
          path: '/guide-center/message',
          component: () =>
            import(
              '../views/guide-center/message/index.vue'
              ),
          meta: {
            title: '企微通讯录'
          }
        },
        {
          path: '/guide-center/guide-list',
          component: () =>
            import(
              '../views/guide-center/guide-list/index.vue'
              ),
          meta: {
            title: '导购列表'
          }
        },
        {
          path: '/guide-center/member-left',
          component: () =>
            import(
              '../views/guide-center/member-left/index.vue'
              ),
          meta: {
            title: '离职成员客户分配'
          }
        },
      ]
    }, */
  ],
});
/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
export default router;
