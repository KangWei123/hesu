/**
 * 箭牌零售行业菜单
 */
//获取默认菜单
function getNormal() {
  let normal = [];
  const normalList = [
    {
      url: '/console',
      name: '工作台',
      icon: 'icon-console'
    },
    {
      url: '/retail/goods-mgr',
      name: '商品管理',
      icon: 'icon-goods-manage'
    },
    {
      url: '/order',
      name: '订单管理',
      icon: 'icon-order'
    },
    {
      url: '/marketing',
      name: '微商城营销',
      icon: 'icon-markting'
    },
    {
      url: '/setting/wx',
      name: '微信设置',
      icon: 'icon-wx-setting'
    },
    {
      url: '/warehouse',
      name: '仓储物流',
      icon: 'icon-warehouse'
    }
  ];

  normalList.forEach(item => {
    normal.push(item);
  });

  return normal;
}

module.exports = {
  normal: getNormal
};
