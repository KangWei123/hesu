import cdnResConfig from '@/business-common/utils/cdnResConfig';

export default [
  // {
  //   id: 'mineInfoModule',
  //   name: '个人信息',
  //   config: {
  //     defaultTextColor: '#ffffff',
  //     textColor: '#FFFFFF',
  //     textMode: 'default', // 背景颜色的选择方式
  //     bgMode: 'default',
  //     defaultBgUrl: cdnResConfig.mine.mine_black_bg,
  //     bgUrl: '',
  //     name: '我的',
  //     avatarDisplay: 'left',
  //     showLevel: true,
  //     checkedItems: ['charge', 'integral', 'giftCard', 'coupon'],
  //   },
  // },
  {
    id: 'mineVipCardModule',
    name: '会员卡',
    config: {
      name: '会员卡',
      defaultTextColor: '#ffffff',
      textColor: '#FFFFFF',
      textMode: 'default', // 背景颜色的选择方式
      bgMode: 'default',
      defaultBgUrl: cdnResConfig.mine.vipCardBg,
      cardMode: '1',
      bgUrl: '',
      noLoginBgUrl: cdnResConfig.mine.unsignVipCardBg,
      marginUp: 8,
      marginDown: 0,
      marginLeftRight: 8,
      radius: 4,
      checkedItems: ['charge', 'integral', 'giftCard', 'coupon'],
    },
  },
  {
    id: 'mineOrderModule',
    name: '我的订单',
    config: {
      name: '我的订单',
      checkedItems: ['wait_pay', 'wait_shipping', 'wait_receive', 'after_sale', 'all'],
      orderItemName: {
        wait_pay: '待支付',
        wait_shipping: '待发货',
        wait_receive: '待收货',
        after_sale: '售后',
        all: '全部订单',
      },
      logo: {
        wait_pay: cdnResConfig.mine.waitPay,
        wait_shipping: cdnResConfig.mine.waitShipping,
        wait_receive: cdnResConfig.mine.waitReceive,
        after_sale: cdnResConfig.mine.afterSale,
        all: cdnResConfig.mine.allOrder,
      },
    },
  },
  {
    id: 'mineNavigationModule',
    name: '工具栏',
    config: {
      title: '工具栏',
      showTitle: true,
      rowNum: 4,
      circularCorner: 0,
      marginUp: 10,
      marginDown: 0,
      marginLeftRight: 0,
      radius: 0,
      list: [],
      displayStyle: 'custom',
      backgroundColor: 'rgba(255,255,255,1)',
      bgMode: 'default', // 背景颜色的选择方式
    },
  },
];
