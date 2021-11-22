//房产行业左侧主菜单
function getNormal() {
  let normal = [];
  const normalList = [
    {
      url: '/console',
      name: '工作台',
      icon: 'icon-console'
    },
    {
      url: '/estate/goods-mgr',
      name: '楼盘管理',
      icon: 'icon-goods-manage'
    },
    {
      url: '/estate/order-mgr',
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
      url: '/setting/homedecorate',
      name: '小程序装修',
      icon: 'icon-mp-decorate'
    }
  ];

  //专题活动管理
  // const activity = {
  //   url: '/activity/index',
  //   name: '专题活动管理',
  //   icon: 'icon-shelves'
  // };

  normalList.forEach(item => {
    normal.push(item);
  });

  //判断当前应用程序特征是否为百佳，如果是则添加专题活动管理
  // if (this.$store.state.appFeatures.indexOf('baijia') === 0) {
  // normal.splice(3, 0, activity);
  // }

  return normal;
}

module.exports = {
  normal: getNormal

  // const: []
};
