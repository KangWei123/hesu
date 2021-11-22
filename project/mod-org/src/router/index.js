import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
const router = new Router({
  routes: [
    {
      path: '/companyManage/dealer-center',
      redirect: '/companyManage/dealer-center/list',
      component: () => import('../views/dealer-center/index.vue'),
      meta: {
        title: '经销商管理',
      },
      children: [
        {
          path: '/companyManage/dealer-center/list',
          component: () => import('../views/dealer-center/list/index.vue'),
          meta: {
            title: '经销商列表',
          },
        },
        {
          path: '/companyManage/dealer-center/list/detail',
          component: () => import('../views/dealer-center/detail/index.vue'),
          meta: {
            title: '编辑经销商',
            bread: true,
          },
        },
      ],
    },
    {
      path: '/companyManage/store-center',
      component: () => import('../views/store-center/index.vue'),
      redirect: '/companyManage/store-center/store-mgr',
      children: [
        {
          path: '/companyManage/store-center/store-mgr',
          component: () => import('../views/store-center/entry/index.vue'),
          meta: {
            hideTitle: true,
          },
        },
        {
          path: '/companyManage/store-center/store-mgr/add',
          component: () => import('../views/store-center/store-mgr/add/index.vue'),
          meta: {
            title: '编辑门店',
            bread: true,
          },
        },
        {
          path: '/companyManage/store-center/store-mgr/detail',
          component: () => import('../views/store-center/store-mgr/detail/index.vue'),
          meta: {
            title: '门店详情',
            bread: true,
          },
        },
        {
          path: '/companyManage/store-center/store-setting',
          component: () => import('../views/store-center/store-setting/index.vue'),
        },
        {
          path: '/companyManage/store-center/store-org-attr',
          component: () => import('../views/store-center/store-org-attr/index.vue'),
        },
      ],
    },
    {
      path: '/companyManage/org-center',
      component: () => import('../views/org-center/index.vue'),
      redirect: '/companyManage/org-center/org-mgr',
      children: [
        {
          path: '/companyManage/org-center/org-mgr',
          component: () => import('../views/org-center/entry/index.vue'),
          meta: {
            hideTitle: true,
          },
        },
        {
          path: '/companyManage/org-center/org-mgr/add',
          component: () => import('../views/org-center/org-mgr/add/index.vue'),
          meta: {
            title: '编辑项目',
            bread: true,
          },
        },
        {
          path: '/companyManage/org-center/org-org-attr',
          component: () => import('../views/org-center/org-org-attr/index.vue'),
        },
      ],
    },
    {
      path: '/companyManage/staff-center',
      redirect: '/companyManage/staff-center/list',
      component: () => import('../views/staff-center/index.vue'),
      meta: '组织人员',
      children: [
        {
          path: '/companyManage/staff-center/list',
          component: () => import('../views/staff-center/list/index.vue'),
          meta: {
            title: '员工管理',
          },
        },
        {
          path: '/companyManage/staff-center/list/add',
          component: () => import('../views/staff-center/add/index.vue'),
          meta: {
            title: '编辑员工',
            bread: true,
          },
        },
        {
          path: '/companyManage/staff-center/list/detail',
          component: () => import('../views/staff-center/detail/index.vue'),
          meta: {
            title: '员工详情',
            bread: true,
          },
        },
        {
          path: '/companyManage/staff-center/list/del-list',
          component: () => import('../views/staff-center/del-list/index.vue'),
          meta: {
            title: '删除记录',
            bread: true,
          },
        },
        {
          path: '/companyManage/staff-center/list/work-order',
          component: () => import('../views/staff-center/work-order/index.vue'),
          meta: {
            title: '员工排班',
            bread: true,
          },
        },
      ],
    },
    {
      path: '/companyManage/role-center',
      redirect: '/companyManage/role-center/list',
      component: () => import('../views/role-center/index.vue'),
      meta: {
        title: '角色中心',
      },
      children: [
        {
          path: '/companyManage/role-center/list',
          component: () => import('../views/role-center/role-manage/index.vue'),
          meta: {
            title: '角色中心',
          },
        },
        {
          path: '/companyManage/role-center/edit',
          component: () => import('../views/role-center/role-manage/edit.vue'),
          meta: {
            title: '角色中心',
          },
        },
      ],
    },
    {
      path: '/companyManage/app-center',
      redirect: '/companyManage/app-center/list',
      component: () => import('../views/app-center/index.vue'),
      meta: {
        title: '应用中心',
      },
      children: [
        {
          path: '/companyManage/app-center/list',
          component: () => import('../views/app-center/app-list/index.vue'),
          meta: {
            title: '应用中心',
          },
        },
      ],
    },
    {
      path: '/companyManage/setting-center',
      redirect: '/companyManage/setting-center/list',
      component: () => import('../views/setting-center/index.vue'),
      meta: {
        title: '设置中心',
      },
      children: [
        {
          path: '/companyManage/setting-center/list',
          component: () => import('../views/setting-center/setting-detail/index.vue'),
          meta: {
            title: '设置中心',
          },
        },
      ],
    },
    {
      path: '/companyManage/access-log',
      redirect: '/companyManage/access-log/list',
      component: () => import('../views/access-log/index.vue'),
      meta: {
        title: '访问日志',
      },
      children: [
        {
          path: '/companyManage/access-log/list',
          component: () => import('../views/access-log/list/index.vue'),
          meta: {
            title: '访问日志',
          },
        },
      ],
    },
    {
      path: '/companyManage/white-setting',
      redirect: '/companyManage/white-setting/list',
      component: () => import('../views/white-setting/index.vue'),
      meta: {
        title: 'IP白名单设置',
      },
      children: [
        {
          path: '/companyManage/white-setting/list',
          component: () => import('../views/white-setting/list/index.vue'),
          meta: {
            title: '访问日志',
          },
        },
      ],
    },
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
