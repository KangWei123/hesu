// 用于处理 小程序中 tabbar 的路径

export default {
  tabbarList: [
    'wxat-common/pages/home/index',
    'wxat-common/pages/classify/index',
    'wxat-common/pages/quick-buy/index',
    'wxat-common/pages/tabbar-shopping-cart/index',
    'wxat-common/pages/mine/index',
    'wxat-common/pages/nearby-store/index',
    'wxat-common/pages/tabbar-custom/index',
    'wxat-common/pages/tabbar-custom1/index',
    'wxat-common/pages/tabbar-custom2/index',
    'wxat-common/pages/tabbar-coupon-center/index',
    'wxat-common/pages/tabbar-group-list/index',
    'wxat-common/pages/tabbar-cut-price-list/index',
    'wxat-common/pages/tabbar-order-list/index',
    'wxat-common/pages/goods-list/index',
    'pages/card-list/index',
    'pages/serve-list/index',
    'wxat-common/pages/tabbar-rooms/index',
    'wxat-common/pages/tabbar-tickets/index',
    'wxat-common/pages/rooms/tabbar-rooms-order/index',
    'wxat-common/pages/tickets/tabbar-tickets-order/index',
    'wxat-common/pages/tabbar-integral/index',
    'wxat-common/pages/tabbar-medicine-server/index'
  ],
  // 默认页 带 tabbar 和 不带 tabbar 之间的转换
  tabbarMap: {
    'wxat-common/pages/tabbar-shopping-cart/index': 'wxat-common/pages/shopping-cart/index',
    'wxat-common/pages/tabbar-custom/index': 'wxat-common/pages/custom/index',
    'wxat-common/pages/tabbar-custom1/index': 'wxat-common/pages/custom/index',
    'wxat-common/pages/tabbar-custom2/index': 'wxat-common/pages/custom/index',
    'wxat-common/pages/tabbar-coupon-center/index': 'wxat-common/pages/mine/coupon/index',
    'wxat-common/pages/tabbar-group-list/index': 'wxat-common/pages/group/list/index',
    'wxat-common/pages/tabbar-cut-price-list/index': 'wxat-common/pages/cut-price/list/index',
    'wxat-common/pages/tabbar-order-list/index': 'wxat-common/pages/order-list/index',
    'wxat-common/pages/tabbar-rooms/index': 'wxat-common/pages/rooms/index',
    'wxat-common/pages/tabbar-tickets/index': 'wxat-common/pages/tickets/index',
    'wxat-common/pages/tabbar-integral/index': 'wxat-common/pages/mine/integral/index'
    // 'wxat-common/pages/tabbar-medicine-server/index': 'wxat-common/pages/medicine-server/index'  // 没有对应的 无tabber版本的页面
  }
};
