export default {
  getStoreMenus() {
    const consoleMenus = [
      {
        name: '会员管理',
        url: '/members',
        icon: 'icon-member-manage',
        business: '/member.html#'
      },
      {
        name: '会员设置',
        url: '/setting/member',
        icon: 'icon-member-setting',
        business: '/member.html#'
      }
    ];
    const menus = {
      groupMenus: []
    };
    menus.groupMenus.push(consoleMenus);
    return menus;
  }
};
