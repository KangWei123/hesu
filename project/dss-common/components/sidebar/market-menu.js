export default {
  getMarketCenterMenus(wkbStatus = 0, showWxOaMenu = false) {
    const marketUtilMenus = [
      {
        name: '营销工具',
        url: '/marketing',
        business: '/dsp.html#'
      }
    ];
    const wxOaUtilMenus = [
      {
        name: '微信公众号运营',
        url: '/wechatoa',
        business: '/dsp.html#'
      }
    ];
    const dspMenus = [
      {
        // 首页
        name: '广告投放',
        url: '/push',
        icon: 'dsp-icon-home',
        business: '/dsp.html#'
      }
    ];
    const menus = {
      groupMenus: []
    };
    menus.groupMenus.push(dspMenus);
    if (showWxOaMenu) {
      menus.groupMenus.push(wxOaUtilMenus);
    }
    menus.groupMenus.push(marketUtilMenus);
    return menus;
  }
};
