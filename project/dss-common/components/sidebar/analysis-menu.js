export default {
  getAnalysisMenus(wkbStatus) {
    const daMenus = [
      {
        url: '/sales',
        name: '销售分析',
        business: '/da.html#',
        childMenu: [
          {
            url: '/sales/overview',
            name: '概览',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/sales/sales-analysis',
            name: '销售额分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/sales/order-analysis',
            name: '订单分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/sales/atv-analysis',
            name: '客单价分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/sales/data-indicator',
            name: '指标数据列表',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          }
        ]
      },

      {
        url: '/da-member',
        name: '会员分析',
        business: '/da.html#',
        childMenu: [
          {
            url: '/da-member/overview',
            name: '概览',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/da-member/trend-analysis',
            name: '趋势分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/da-member/contribution-analysis',
            name: '贡献分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          }
        ]
      },

      {
        url: '/ma',
        name: '小程序分析',
        business: '/da.html#',
        childMenu: [
          // {
          //   url: '/ma/overview',
          //   name: '概览'
          // },
          {
            url: '/ma/Apply',
            name: '概览',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/ma/Active',
            name: '活跃分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/ma/Acquire',
            name: '获取分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/ma/Retent',
            name: '留存分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/ma/Share',
            name: '分享分析',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          },
          {
            url: '/ma/Portrait',
            name: '用户画像',
            disabled: !wkbStatus,
            popTitle: '需购买惟客宝套餐'
          }
        ]
      }
    ];
    const menus = [];
    menus.push(daMenus);
    return { groupMenus: menus };
  }
};
