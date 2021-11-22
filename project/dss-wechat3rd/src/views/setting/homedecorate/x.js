const HOST = 'https://dss2.meizu.com/c';
const WX_BASE_URL = 'http://wx.wakedata.com:8089/wp';
export default {
  /** 登录 */
  login: `${HOST}/login/queryByCode`,
  /** 体验下 */
  experienceLogin: `${HOST}/login/login`,
  /** 延长业务session */
  setSession: `${HOST}/dss/rest/timeout`,
  /** 用户信息 */
  userInfo: `${HOST}/login/query`,
  /** 绑定 */
  binding: {
    //check: `${HOST}/dss/rest/isbinding`,
    sendCode: `${HOST}/login/sendVCode`,
    /** 绑定 */
    submit: `${HOST}/login/binding`
  },
  /** 权限 */
  auth: {
    check: `${HOST}/dss/rest/checkUrls`,
    /** 获取有权限的页面 */
    menu: `${HOST}/menu/queryUserMenu`
  },
  /** 业务概览 */
  overview: {
    /** 概览数据 */
    statisticData: `${HOST}/mini/report/today/statisticData`,
    /** 客户趋势 */
    customerTrend: `${HOST}/mini/report/all/arrived/distribution`,
    /** 客流画像 */
    portrait: `${HOST}/stat/portrait/all`
  },
  /** 发现 */
  discover: {
    /** 行业视角的天、周、月 */
    analy: `${HOST}/statistic/report/store/auth/enter/trade/analy`,
    /** 行业视角累计客流量 */
    analyAll: `${HOST}/statistic/report/store/auth/enter/trade/analyAll`,
    /** 我的店铺-客流量 */
    storeReportCustomer: `${HOST}/statistic/report/customer/analyse`,
    /** 我的店铺-新老客户 */
    storeReportNewold: `${HOST}/statistic/report/store/newold/custom/detail`,
    /** 我的店铺-入店率 */
    storeReportEnterRate: `${HOST}/statistic/report/store/enter/rate`,
    /** 我的店铺-到店时长 */
    storeReportIntimes: `${HOST}/statistic/report/store/customer/in/times`,
    /** 我的店铺-回访频次 */
    storeReportVisitTime: `${HOST}/statistic/report/store/visit/times`,
    /** 会员注册 */
    memberRegister: `${HOST}/member/register/register`,
    /** 会员注册-获取当前店铺人脸列表 */
    getFaceList: `${HOST}/member/register/getFaceList`
  },
  store: {
    list: `${HOST}/login/query`,
    choose: `${HOST}/pot/user/choosestore`
  },
  vip: {
    statistics: `${HOST}/member/overview`,
    list: `${HOST}/member/search`
  },
  personal: {
    tradeList: `${HOST}/prom/trade/query`,
    tradeAdd: `${HOST}/prom/trade/add`
  },
  guide: {
    realTime: `${HOST}/prom/guide_report/get_rt_customer`,
    collection: `${HOST}/prom/guide/get_favorite_customers`,
    quality: `${HOST}/prom/guide/get_quality_customers`,
    addCollection: `${HOST}/prom/guide/add_favorite`,
    cancelCollection: `${HOST}/prom/guide/rmv_favorite`
  },
  sysmsg: {
    list: `${HOST}/pot/sysmsg/list`
  },

  getPageConfig: `${WX_BASE_URL}/industryTemplate/template/get`,
  getUserPageConfig: `${WX_BASE_URL}/sellerTemplate/page/config/get`
};
