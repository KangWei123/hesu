import Noop from '@/dss-common/components/noop';

export const projectRoute = {
  description: '项目管理',
  route: {
    path: '/project',
    redirect: '/project/list',
    component: () => import('../views/project/index.vue'),
    meta: {
      title: '项目管理',
    },
    children: [
      {
        path: '/project/list',
        component: Noop,
        redirect: '/project/list/index',
        children: [
          {
            path: '/project/list/index',
            component: () => import('../views/project/list/index.vue'),
            meta: {
              title: '项目列表',
            },
          },
          {
            path: '/project/list/create',
            component: () => import('../views/project/create-or-edit/index.vue'),
            name: 'project.create',
            meta: {
              title: '新增项目',
              bread: true,
            },
          },
          {
            path: '/project/list/edit/:id',
            component: () => import('../views/project/create-or-edit/index.vue'),
            name: 'project.edit',
            meta: {
              title: '修改项目',
              bread: true,
            },
          },
          {
            path: '/project/list/types',
            component: () => import('../views/project/types/index.vue'),
            name: 'project.types',
            meta: {
              title: '项目类型',
              bread: true,
            },
          },
          {
            path: '/project/list/tags',
            component: Noop,
            name: 'project.tags',
            meta: {
              title: '管理标签',
            },
            redirect: '/project/list/tags/index',
            children: [
              {
                path: '/project/list/tags/index',
                component: () => import('../views/project/tags/index.vue'),
                name: 'project.tags.index',
                meta: {
                  title: '管理标签',
                  bread: true,
                },
              },
            ],
          },
          {
            path: '/project/list/house-types',
            component: Noop,
            name: 'project.houseTypes',
            meta: {
              title: '户型设置',
            },
            redirect: '/project/list/house-types/index',
            children: [
              {
                path: '/project/list/house-types/index',
                component: () => import('../views/project/house-types/index.vue'),
                name: 'project.houseTypes.index',
                meta: {
                  title: '户型设置',
                  bread: true,
                },
              },
              {
                path: '/project/list/house-types/create',
                component: () => import('../views/project/house-types/create-or-edit.vue'),
                name: 'project.houseTypes.create',
                meta: {
                  title: '新增户型',
                  bread: true,
                },
              },
              {
                path: '/project/list/house-types/edit/:id',
                component: () => import('../views/project/house-types/create-or-edit.vue'),
                name: 'project.houseTypes.edit',
                meta: {
                  title: '修改户型',
                  bread: true,
                },
              },
            ],
          },
        ],
      },
      {
        path: '/project/cost-assessment',
        component: () => import('../views/project/cost-assessment/index.vue'),
        meta: {
          title: '费用评估',
        },
      },
      {
        path: '/project/appointment',
        name: 'project.appointment',
        component: Noop,
        redirect: '/project/appointment/list',
        meta: {
          title: '预约列表',
        },
        children: [
          {
            path: '/project/appointment/list',
            name: 'project.appointment.list',
            component: () => import('../views/project/appointment/list.vue'),
            meta: {
              title: '预约列表',
            },
          },
          {
            path: '/project/appointment/setting',
            name: 'project.appointment.setting',
            redirect: '/project/appointment/setting/list',
            component: Noop,
            meta: {
              title: '预约设置',
            },
            children: [
              {
                path: 'list',
                name: 'project.appointment.setting.list',
                component: () => import('../views/project/appointment/setting-list.vue'),
                meta: {
                  title: '预约设置',
                  bread: true,
                },
              },
              {
                path: 'form',
                name: 'project.appointment.setting.form',
                component: () => import('../views/project/appointment/setting.vue'),
                meta: {
                  title: '预约设置',
                  bread: true,
                },
              },
              {
                path: 'eidt/:settingId',
                name: 'project.appointment.setting.edit',
                component: () => import('../views/project/appointment/setting.vue'),
                meta: {
                  title: '修改预约设置',
                  bread: true,
                },
              },
            ],
          },
        ],
      },
      {
        path: '/project/elder-appointment',
        name: 'project.elderAppointment',
        component: Noop,
        redirect: '/project/elder-appointment/list',
        meta: {
          title: '探访预约',
        },
        children: [
          {
            path: '/project/elder-appointment/list',
            name: 'project.elderAppointment.list',
            component: () => import('../views/project/elder-appointment/list.vue'),
            meta: {
              title: '预约列表',
            },
          },
          {
            path: '/project/elder-appointment/setting',
            name: 'project.elderAppointment.setting',
            redirect: '/project/elder-appointment/setting/list',
            component: Noop,
            meta: {
              title: '预约设置',
            },
            children: [
              {
                path: 'list',
                name: 'project.elderAppointment.setting.list',
                component: () => import('../views/project/elder-appointment/setting-list.vue'),
                meta: {
                  title: '预约设置',
                  bread: true,
                },
              },
              {
                path: 'form',
                name: 'project.elderAppointment.setting.form',
                component: () => import('../views/project/elder-appointment/setting.vue'),
                meta: {
                  title: '预约设置',
                  bread: true,
                },
              },
              {
                path: 'eidt/:settingId',
                name: 'project.elderAppointment.setting.edit',
                component: () => import('../views/project/elder-appointment/setting.vue'),
                meta: {
                  title: '修改设置',
                  bread: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
