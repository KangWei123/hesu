/**
 * Created by love on 19/3/21.
 * @author trumpli<潘伟金>
 */
export default {
  description: '微信设置相关（各个行业复用）',
  route: {
    path: '/setting/wx',
    redirect: '/setting/wx/mp',
    component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/index.vue'),
    meta: {
      title: '微信设置',
    },
    children: [
      {
        path: '/setting/wx/mp',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/mp/index.vue'),
        redirect: '/setting/wx/mp/version',
        children: [
          {
            path: '/setting/wx/mp/version',
            component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/mp/version.vue'),
            meta: {
              title: '版本设置',
            },
          },
          {
            path: '/setting/wx/mp/user_deal',
            component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/mp/version-staff.vue'),
            meta: {
              title: '用户协议',
            },
          },
        ],
        meta: {
          title: '小程序设置',
        },
      },
      {
        path: '/setting/wx/pc',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/pc/index.vue'),
        meta: {
          title: '公众号设置',
        },
      },
      {
        path: '/setting/wx/h5',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/h5/index.vue'),
        meta: {
          title: 'H5设置',
        },
      },
      {
        path: '/setting/wx/pay',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/pay/index.vue'),
        meta: {
          title: '支付设置',
        },
      },
      {
        path: '/setting/wx/payTransfers',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/payTransfers/index.vue'),
        meta: {
          title: '付款方式',
        },
      },
      {
        path: '/setting/wx/card',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/card/index.vue'),
        meta: {
          title: '微信卡券',
        },
      },
      {
        path: '/setting/wx/card/course',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/card/course.vue'),
        meta: {
          title: '卡券开通教程',
        },
      },
      {
        path: '/setting/wx/qy',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/auth-list.vue'),
        meta: {
          title: '企业微信设置',
        },
      },
      {
        path: '/setting/wx/qy/clientAuth',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/client-auth.vue'),
        meta: {
          title: '客户联系授权',
        },
      },
      {
        path: '/setting/wx/qy/authList',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/auth-list.vue'),
        meta: {
          title: '授权列表',
        },
      },
      {
        path: '/setting/wx/qy/auth/communicateAuth',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/auth/communicateAuth.vue'),
        meta: {
          title: '通讯录授权',
        },
      },
      {
        path: '/setting/wx/qy/auth/mpAuth',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/auth/mpAuth.vue'),
        meta: {
          title: '小程序授权',
        },
      },
      {
        path: '/setting/wx/qy/authReturn',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/authReturn.vue'),
        meta: {
          title: '授权成功',
        },
      },
      {
        path: '/setting/wx/qy/auth/clientApplicationAuth',
        component: () => import(/* webpackChunkName: "wx-setting" */ '../views/wx-setting/qy/auth/clientAuth.vue'),
        meta: {
          title: '客户联系授权',
        },
      },
    ],
  },
};
