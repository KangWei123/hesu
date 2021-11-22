/**
 * Created by love on 19/9/2.
 * 医药行业菜单
 * @author trumpli<zk>
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
      url: '/setting/homedecorate',
      name: '小程序装修',
      icon: 'icon-mp-decorate'
    },
    {
      url: '/warehouse',
      name: '仓储物流',
      icon: 'icon-warehouse'
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
