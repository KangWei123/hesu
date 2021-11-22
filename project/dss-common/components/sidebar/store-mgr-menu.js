export default {
  getStoreMenus() {
    const consoleMenus = [
      {
        name: '门店管理',
        url: '/storemgr/storemgr',
        icon: '',
        business: '/console.html#'
      },
      {
        name: '员工管理',
        url: '/storemgr/staffmgr',
        icon: '',
        business: '/console.html#'
      },
      {
        // 首页
        name: '设备管理',
        icon: '',
        url: '/device',
        business: '/console.html#'
      }
    ];
    const menus = {
      groupMenus: []
    };
    menus.groupMenus.push(consoleMenus);
    return menus;
  }
};
