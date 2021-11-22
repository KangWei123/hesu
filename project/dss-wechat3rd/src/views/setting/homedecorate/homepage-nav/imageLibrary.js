const library = (() => {
  function a() {}

  a.iconLibrary = {
    catering: [
      { name: 'home', text: '首页' },
      // { name: 'universal', text: '附近门店' },
      // { name: 'classify', text: '分类/快速购买' },
      { name: 'shopping-cart', text: '购物车' },
      { name: 'coupon', text: '优惠券' },
      { name: 'group', text: '拼团' },
      { name: 'cut-price', text: '砍价' },
      { name: 'order', text: '订单' },
      // { name: 'integral', text: '积分商城' },
      // { name: 'internal-purchase', text: '内购专区' },
      { name: 'mine', text: '我的' },
    ],
  };

  a.IconMaps = null;

  function loadIndustryImages(industry) {
    const x = {};
    const icons = a.iconLibrary[industry];
    icons.forEach(icon => {
      // eslint-disable-next-line import/no-dynamic-require
      icon.onIcon = require(`@/dss-wechat3rd/src/images/decoration/tabbar/${icon.name}-on.png`);
      // eslint-disable-next-line import/no-dynamic-require
      icon.offIcon = require(`@/dss-wechat3rd/src/images/decoration/tabbar/${icon.name}-off.png`);
      x[icon.name] = icon;
    });
    if (!a.IconMaps) {
      a.IconMaps = {};
    }
    a.IconMaps[industry] = x;
  }

  a.iconMap = function (industry) {
    // 按需加载，去掉不必要的行业
    if (!(a.IconMaps && a.IconMaps[industry])) {
      loadIndustryImages(industry);
    }
    return a.IconMaps[industry];
  };

  a.icons = function (industry) {
    return a.iconLibrary[industry];
  };

  return a;
})();

export default library;
