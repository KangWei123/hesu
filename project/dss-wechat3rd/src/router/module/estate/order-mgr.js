import estatePage from '../../pages/estate/index.js';

export default {
  description: '地产行业的订单管理',

  route: {
    path: '/estate/order-mgr',
    redirect: '/estate/order-mgr/list',
    component: estatePage.orderMgr.index,
    meta: {
      title: '订单管理'
    },
    children: [
      {
        path: '/estate/order-mgr/list',
        component: estatePage.orderMgr.list,
        meta: {
          title: '订单列表'
        }
      },
      {
        path: '/estate/order-mgr/detail',
        component: estatePage.orderMgr.detail,
        meta: {
          title: '订单详情'
        }
      }
    ]
  }
};
