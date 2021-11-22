import cdnResConfig from '@/business-common/utils/cdnResConfig';
// 零售行业的组件配置
function getComponents() {
  const components = [];
  const componentsList = [
    {
      type: '基础组件',
      components: [
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
            marginUp: 8,
            marginDown: 0,
            marginLeftRight: 8,
            radius: 4,
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
          id: 'mineWalletModule',
          name: '钱包',
          config: {
            name: '钱包',
            marginUp: 8,
            marginDown: 0,
            marginLeftRight: 8,
            radius: 4,
            defaultTextColor: '#27292f',
            textColor: '#FFFFFF',
            textMode: 'default', // 背景颜色的选择方式
            backgroundColor: '#FFFFFF',
            defaultBgColor: '#ffffff',
            bgMode: 'default', // 背景颜色的选择方式
            checkedItems: ['charge', 'integral', 'giftCard', 'coupon'],
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
            marginUp: 8,
            marginDown: 0,
            marginLeftRight: 8,
            radius: 4,
            list: [],
            displayStyle: 'custom',
          },
        },
        {
          id: 'imageModule',
          name: '轮播',
          config: {
            isMineCenter: true,
            margin: 0,
            radius: 3,
            marginUp: 10,
            marginDown: 0,
            marginLeftRight: 15,
            height: 300,
            data: [],
            exampleData: [],
          },
        },
        {
          id: 'magicModule',
          name: '魔方',
          config: {
            isMineCenter: true,
            componentsPadding: 10,
            name: '1row3',
            margin: 10,
            radius: 3,
            marginUp: 10,
            marginDown: 0,
            marginLeftRight: 15,
            data: [
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '0%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '33.33%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '66.66%',
                src: '',
                linkPage: '',
                linkName: '',
              },
            ],
            exampleData: [
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '0%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '33.33%',
                src: '',
                linkPage: '',
                linkName: '',
              },
              {
                width: '33.33%',
                height: '100%',
                top: '0%',
                left: '66.66%',
                src: '',
                linkPage: '',
                linkName: '',
              },
            ],
          },
        },
        {
          id: 'assistBlankModule',
          name: '辅助空白',
          config: {
            height: 30,
            backgroundColor: '#F1F4F9',
            bgMode: 'default',
            defaultColor: '#F1F4F9',
          },
        },
        {
          id: 'assistLineModule',
          name: '辅助线',
          config: {
            style: 'dashed',
            lineColor: '#878181',
            showMargin: 'false',
            lineMode: 'default',
          },
        },
      ],
    },
  ];

  componentsList.forEach(item => {
    components.push(item);
  });

  return components;
}

export default {
  components: getComponents,
};
