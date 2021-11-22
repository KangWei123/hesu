import pages from '../page';

/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */
export default {
  description: '创建店铺相关（各个行业复用）',
  route: {
    path: '/startup',
    component: pages.startup.index,
    meta: {
      title: '创建店铺'
    },
    children: [
      {
        path: '/startup/create',
        component: pages.startup.create,
        meta: {
          title: '创建店铺'
        }
      },
      {
        path: '/startup/template-list',
        component: pages.startup.template,
        meta: {
          title: '行业模版'
        }
      },
      {
        path: '/startup/industry',
        component: pages.startup.industry,
        meta: {
          title: '行业选择'
        }
      },
      {
        path: '/startup/chose',
        component: pages.startup.chose,
        meta: {
          title: '选择店铺'
        }
      },
      {
        path: '/startup/order',
        component: pages.startup.order,
        meta: {
          title: '订购店铺'
        }
      },
      {
        path: '/startup/pay',
        component: pages.startup.pay,
        meta: {
          title: '店铺支付'
        }
      }
    ]
  }
};
