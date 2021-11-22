import pages from '../page';

/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */
export default {
  description: '设置相关（各个行业复用）',
  route: {
    path: '/setting',
    redirect: '/setting/app',
    component: pages.setting.index,
    meta: {
      title: '商城设置'
    },
    children: [
      {
        path: '/setting/app',
        component: pages.setting.app,
        meta: {
          title: '基础资料'
        }
      },
      {
        path: '/setting/appointment',
        component: pages.setting.appointment,
        meta: {
          title: '预约设置'
        }
      }
    ]
  }
};
