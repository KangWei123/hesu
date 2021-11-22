/**
 * Created by love on 18/9/5.
 * 零售行业菜单
 * @author trumpli<李志伟>
 */
import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
//获取默认菜单
function getNormal() {
  let normal = [];
  const normalList = [
    {
      url: '/console',
      name: '工作台',
      icon: 'icon-console',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.console,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/retail/goods-mgr',
      name: '商品管理',
      icon: 'icon-goods-manage',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.goods_mgr,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/order',
      name: '订单管理',
      icon: 'icon-order',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.order_mgr,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/marketing',
      name: '微商城营销',
      icon: 'icon-markting',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.ma_marketing,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/setting/wx',
      name: '微信设置',
      icon: 'icon-wx-setting',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.wx_setting,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/setting/homedecorate',
      name: '小程序装修',
      icon: 'icon-mp-decorate',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.ma_decorate,
      disabled: false,
      disableTip: '该角色暂无权限访问'
    },
    {
      url: '/warehouse',
      name: '仓储物流',
      icon: 'icon-warehouse',
      identifier: scopeMenuEnum.dictionary.wkbChildMenu.warehouse,
      disabled: false,
      disableTip: '该角色暂无权限访问'
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

export default {
  normal: getNormal

  // const: []
};
