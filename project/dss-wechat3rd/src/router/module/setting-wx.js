import pages from '../page';

/**
 * Created by love on 19/3/21.
 * @author trumpli<潘伟金>
 */
export default {
  description: '微信设置相关（各个行业复用）',
  route: {
    path: '/setting/wx',
    redirect: '/setting/wx/mp',
    component: pages.setting.wx.index,
    meta: {
      title: '微信设置'
    },
    children: [
      {
        path: '/setting/wx/mp',
        component: pages.setting.wx.mp,
        redirect: '/setting/wx/mp/version',
        children: [
          {
            path: '/setting/wx/mp/version',
            component: pages.setting.wx.version,
            meta: {
              title: '版本设置'
            }
          },
          {
            path: '/setting/wx/mp/user_deal',
            component: pages.setting.wx.user_deal,
            meta: {
              title: '用户协议'
            }
          }
        ],
        meta: {
          title: '小程序设置'
        }
      },
      {
        path: '/setting/wx/pc',
        component: pages.setting.wx.pc,
        meta: {
          title: '公众号设置'
        }
      },
      {
        path: '/setting/wx/pay',
        component: pages.setting.wx.pay,
        meta: {
          title: '支付设置'
        }
      },
      {
        path: '/setting/wx/card',
        component: pages.setting.wx.card,
        meta: {
          title: '微信卡券'
        }
      },
      {
        path: '/setting/wx/card/course',
        component: pages.setting.wx.cardCourse,
        meta: {
          title: '卡券开通教程'
        }
      },
      {
        path: '/setting/wx/qy',
        component: pages.setting.wx.authList,
        meta: {
          title: '企业微信设置'
        }
      },
      {
        path: '/setting/wx/qy/clientAuth',
        component: pages.setting.wx.clientAuth,
        meta: {
          title: '客户联系授权'
        }
      },
      {
        path: '/setting/wx/qy/authList',
        component: pages.setting.wx.authList,
        meta: {
          title: '授权列表'
        }
      },
      {
        path: '/setting/wx/qy/auth/communicateAuth',
        component: pages.setting.wx.communicateAuth,
        meta: {
          title: '通讯录授权'
        }
      },
      {
        path: '/setting/wx/qy/auth/mpAuth',
        component: pages.setting.wx.mpAuth,
        meta: {
          title: '小程序授权'
        }
      },
      {
        path: '/setting/wx/qy/authReturn',
        component: pages.setting.wx.authReturn,
        meta: {
          title: '授权成功'
        }
      },
      {
        path: '/setting/wx/qy/auth/clientApplicationAuth',
        component: pages.setting.wx.clientApplicationAuth,
        meta: {
          title: '客户联系授权'
        }
      }
    ]
  }
};
