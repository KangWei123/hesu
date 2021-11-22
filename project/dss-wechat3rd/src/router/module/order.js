import pages from '../page';

/**
 * Created by love on 18/11/2.
 * @author trumpli<李志伟>
 */
export default {
  description: '订单相关（各个行业复用）',
  route: {
    path: '/order',
    // redirect: '/order/list',
    component: pages.order.list.index,
    meta: {
      title: '订单管理'
    },
    children: [
      {
        path: '/broker/list',
        component: pages.order.list.broker,
        meta: {
          title: '代客订单列表',
          keepAlive: true
        }
      },
      {
        path: '/broker/list/detail',
        component: pages.order.list.brokerDetail,
        meta: {
          title: '代客订单详情'
        }
      },
      {
        path: '/order/list',
        component: pages.order.list.orderList,
        meta: {
          title: '订单列表',
          keepAlive: true
        }
      },
      {
        path: '/refund/list',
        component: pages.order.list.refundList,
        meta: {
          title: '退款列表',
          keepAlive: true
        }
      },
      {
        path: '/storedVal/list',
        component: pages.order.list.storedValList,
        meta: {
          title: '储值列表',
          keepAlive: true
        }
      },
      {
        path: '/offline/list',
        component: pages.order.list.offlineList,
        meta: {
          title: '线下订单',
          keepAlive: true
        }
      },
      {
        path: '/giftCard/list',
        component: pages.order.list.giftCardList,
        meta: {
          title: '礼品卡列表',
          keepAlive: true
        }
      },
      {
        path: '/card-pack/list',
        component: pages.order.list.cardPackList,
        meta: {
          title: '代金卡包订单',
          keepAlive: true
        }
      },
      {
        path: '/order/list/detail',
        component: pages.order.detail.detail,
        meta: {
          title: '订单详情'
        }
      },
      {
        path: '/refund/list/detail',
        component: pages.order.detail.refundDetail,
        meta: {
          title: '退款详情'
        }
      },
      {
        path: '/storedVal/list/detail',
        component: pages.order.detail.detail,
        meta: {
          title: '储值详情'
        }
      },
      {
        path: '/giftCard/list/detail',
        component: pages.order.detail.detail,
        meta: {
          title: '礼品卡详情'
        }
      },
      {
        path: '/card-pack/list/detail',
        component: pages.order.detail.detail,
        meta: {
          title: '代金卡包详情'
        }
      },
      {
        path: '/offline/list/detail',
        component: pages.order.detail.detail,
        meta: {
          title: '线下订单详情'
        }
      },
      {
        path: '/analysis/overview',
        component: pages.order.analysis,
        meta: {
          title: '订单分析',
          keepAlive: true
        }
      },
      {
        path: '/hotel-order/list',
        component: pages.hotelOrder.list,
        meta: {
          title: '客房订单',
          keepAlive: true
        }
      },
      {
        path: '/hotel-order/list/detail',
        component: pages.hotelOrder.detail,
        meta: {
          title: '客房订单详情'
        }
      },
      {
        path: '/ticket-order/list',
        component: pages.ticketOrder.list,
        meta: {
          title: '票务订单',
          keepAlive: true
        }
      },
      {
        path: '/ticket-order/list/detail',
        component: pages.ticketOrder.detail,
        meta: {
          title: '票务订单详情'
        }
      },
      {
        path: '/micro-order/list',
        component: pages.microOrder.list,
        meta: {
          title: '订购订单',
          keepAlive: true
        }
      },
      {
        path: '/micro-order/list/detail',
        component: pages.microOrder.detail,
        meta: {
          title: '订购订单详情'
        }
      }
    ]
  }
};
