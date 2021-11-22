import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;
const MallPrefix = '/mall/b';
const OrgSchema = wpBaseApi.OrgSchema;
const BaseSchema = wpBaseApi.BaseSchema;

export default {
  /**
   * 查询行业类目
   * @param industryCategoryId
   */
  queryIndustry(industryCategoryId) {
    return services.get(OrgSchema + 'industry/pageQuery', {
      action: '查询行业类目',
      params: {
        industryCategoryId,
      },
    });
  },

  /**
   * 添加店铺
   * @param params
   */
  addApp(params) {
    return services.post(WpSchema + '/app/add', params, {
      action: '添加店铺',
    });
  },

  /**
   * 获取支付二维码
   * @param params
   */
  getOrderQRCode(params) {
    return services.get(WpSchema + '/order/item_qrcode', {
      action: '获取支付二维码',
      params,
    });
  },

  /**
   * 统一下单
   * @param params
   */
  unifiedOrder(params) {
    return services.get(WpSchema + '/order/unifiedOrder', {
      action: '统一下单',
      params,
    });
  },

  /**
   * 生成二维码支付链接
   * @param params
   */
  userUnifiedOrder(params) {
    return services.get(WpSchema + '/qrCode/wkb_qrcode', {
      action: '生成支付订单二维码链接',
      params,
    });
  },

  /**
   * 查询订单状态
   * @param params
   */
  queryOrderStatus(params) {
    return services.get(WpSchema + '/order/query_order_status', {
      action: '查询订单状态',
      params,
    });
  },

  /**
   * 获取用户创建的店铺列表
   * @param params
   */
  getUserAppList(params) {
    return services.get(WpSchema + '/seller_app/list', {
      action: '获取已创建的店铺列表',
      params,
    });
  },

  /**
   * 加载工作台数据
   * @param params
   */
  queryDashBoard(params) {
    return services.get(WpSchema + '/seller_dashboard/query', {
      action: '加载工作台数据',
      params,
    });
  },

  /**
   * 加载工作台数据-商业中心
   * @param {*} params
   * @returns
   */
  queryDashBoardBusiness(params) {
    return services.json(MallPrefix + '/worktable/data/statistics', params, {
      action: '加载工作台数据',
    });
  },

  /**
   * 工作台-待办事项
   * @param {*} params
   * @returns
   */
  queryTodoList(params) {
    return services.json(MallPrefix + '/worktable/todolist', params, {
      action: '加载工作台待办事项',
    });
  },
  /**
   * 加载工作台数据
   * @param params
   */
  queryServiceMessage() {
    return services.get('/wp/data/info/index', {
      action: '获取待处理客户消息',
    });
  },

  /**
   * 查询所有店铺套餐
   * @param params
   */
  getPackageList(params) {
    return services.get(WpSchema + '/wk_package/query_list', {
      action: '查询所有店铺套餐',
      params,
    });
  },

  /**
   * 获取用户创建店铺列表
   * @param params
   */
  getUserStoreList(params) {
    return services.get(OrgSchema + '/app/list', {
      action: '获取用户创建店铺列表',
      params,
    });
  },

  /**
   * 营业开关
   * @param params
   */
  switch(params) {
    return services.get(WpSchema + '/store/close', {
      action: '营业开关',
      params,
    });
  },
  /**
   * 切换门店
   * @param params
   */
  changeStore(params) {
    return services.get(WpSchema + '/store/choose', {
      action: '切换门店',
      params,
    });
  },

  /**
   * 切换店铺
   * @param params
   */
  changeApp(params) {
    return services.get(OrgSchema + '/app/choose', {
      action: '切换店铺',
      params,
    });
  },

  /**
   * 更新店铺
   * @param params
   */
  updateApp(params) {
    return services.post(WpSchema + '/app/update', params, {
      action: '更新店铺',
    });
  },

  /**
   * 添加门店
   * @param params
   */
  addStore(params) {
    return services.post(WpSchema + '/store/add', params, {
      action: '添加门店',
    });
  },

  /**
   * 删除门店
   * @param params
   */
  deleteStore(params) {
    return services.get(WpSchema + '/store/delete', {
      action: '删除门店',
      params,
    });
  },

  /**
   * 修改门店
   * @param params
   */
  updateStore(params) {
    return services.post(WpSchema + '/store/update', params, {
      action: '修改门店',
    });
  },

  /**
   * 查询门店
   * @param params
   */
  viewStore(params) {
    return services.get(WpSchema + '/store/query', {
      action: '查询门店',
      params,
    });
  },

  /**
   * 查询门店列表
   * @param params
   */
  queryStoreList(params) {
    return services.get(WpSchema + '/store/query/dept', {
      action: '查询门店列表',
      params,
    });
  },

  queryStoreListByItemNo(params) {
    return services.json(WpSchema + '/wx_store_item/query_store', params, {
      action: '查询门店列表',
    });
  },

  getBy_region(params) {
    return services.get(WpSchema + '/store/query_by_region', {
      action: '查询城市列表',
      params,
    });
  },

  /**
   * 保存用户配置
   * @param params
   */
  saveConfig(params) {
    return services.post(WpSchema + '/sellerTemplate/add', params, {
      action: '保存用户配置',
    });
  },

  /**
   * 获取微信授权信息
   * @param params
   */
  getAuthorizationInfo(params) {
    return services.get(WpSchema + '/auth/authorizer/info/get', {
      action: '获取微信授权信息',
      hidden: true,
      params,
    });
  },

  /** ************* 店铺装修 ****************/
  /**
   * 获取所有首页
   * @param params
   */
  getHomePages(params) {
    return services.get(WpSchema + '/sellerTemplate/page/home/list/v2', {
      action: '获取所有首页',
      params,
    });
  },

  /**
   * 删除自定义首页
   * @param params
   * {
   * type: 1
   * }
   */
  deleteCustomHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/delete/v2', params, {
      action: '删除自定义首页',
    });
  },

  /**
   * 设置自定义页为首页
   * @param params
   * {
   * type: 1
   * }
   */
  setCustomToHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/set/v2', params, {
      action: '设置自定义页为首页',
    });
  },

  /**
   * 设置默认首页为首页
   * @param params
   * {
   * type: 1
   * }
   */
  setDefaultToHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/default/home/set/v2', params, {
      action: '设置默认首页为首页',
    });
  },

  /**
   * 替换自定义首页
   * @param params
   * {
   * type: 1
   * }
   */
  replaceCustomHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/replace/v2', params, {
      action: '替换自定义页为首页',
    });
  },

  /**
   * 获取所有自定义页
   * @param params
   */
  getCustomPagesV2(params) {
    // return services.get(WpSchema + '/sellerTemplate/page/custom/list', {
    //   action: '获取所有自定义页',
    //   params
    // });
    return services.get(WpSchema + '/sellerTemplate/page/custom/list/v2', {
      action: '获取所有自定义页',
      params,
    });
  },

  /**
   * 获取所有自定义页
   * @param params
   */
  getCustomPages(params) {
    return services.get(WpSchema + '/sellerTemplate/page/custom/list', {
      action: '获取所有自定义页',
      params,
    });
  },

  /**
   * 新增自定义页
   * @param params
   */
  addCustomPage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/add', params, {
      action: '新增自定义页',
    });
  },

  /**
   * 删除自定义页
   * @param params
   */
  deleteCustomPage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/delete/v2', params, {
      action: '删除自定义页',
    });
  },

  /**
   * 更新页面
   * @param params
   */
  updatePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/update', params, {
      action: '更新页面',
    });
  },

  /**
   * 获取模板列表
   * @param params
   */
  getTemplateList(params) {
    return services.get(WpSchema + '/industryTemplate/template/list', {
      action: '获取模板列表',
      params,
    });
  },

  /**
   * 获取页面配置信息
   * @param params
   */
  getPageConfig(params) {
    return services.get(WpSchema + '/sellerTemplate/page/get', {
      action: '获取页面配置信息',
      params,
    });
  },

  /**
   * 获取用户单个店铺模板配置
   * @param params
   */
  getUserTemplate(params) {
    return services.get(BaseSchema + '/sellerTemplate/get', {
      action: '获取用户单个店铺模板配置',
      params,
    });
  },

  /**
   * 获取所有页面
   * @param params
   */
  getUserPages(params) {
    return services.get(WpSchema + '/sellerTemplate/page/list', {
      action: '获取所有页面',
      params,
    });
  },

  /**
   * 更新模板配置（导航修改的时候）
   * @param params
   */
  updateUserTemplate(params) {
    return services.post(WpSchema + '/sellerTemplate/config/update', params, {
      action: '更新模板配置',
    });
  },

  /**
   * 更新模板配置（导航修改的时候）
   * @param params
   */
  updateTemplate(params) {
    return services.json(WpSchema + '/sellerTemplate/template/update', params, {
      action: '更新模板配置',
    });
  },

  /**
   * 更新模板config配置信息
   * @param params
   */
  updateTemplateConfig(params) {
    return services.post(WpSchema + '/sellerTemplate/config/update', params, {
      action: '更新模板配置',
    });
  },

  /**
   * 创建最新dev版本（导航修改的时候）
   * @param params
   */
  createNewDev(params) {
    return services.post(WpSchema + '/sellerTemplate/template/new_dev', params, {
      action: '获取最新dev版本',
    });
  },

  /**
   * 通过itemNo查询对应卡项列表
   * @param params
   */
  itemNosForCardList(params) {
    return services.get(WpSchema + '/wx_item_card/query/cards', {
      action: '通过itemNo查询对应卡项列表',
      params,
    });
  },

  /**
   * 通过itemNo查询对应服务和产品列表
   * @param params
   */
  itemNosForGoodsList(params) {
    return services.get(WpSchema + '/wx_store_item/query/items', {
      action: '通过itemNo查询对应服务和产品列表',
      params,
    });
  },

  /**
   * 通过itemNo查询对应砍价
   * @param params
   */
  itemNosForHaggleList(params) {
    return services.json(WpSchema + '/bargain/activity/query/items', params, {
      action: '通过itemNo查询对应服务和产品列表',
    });
  },

  /**
   * 通过活动 ids
   * @param {*} params
   */
  idsForHaggleList(params) {
    return services.get(WpSchema + '/bargain/activity/query/ids', {
      action: '通过活动 ids 查询对应服务和产品列表',
      params,
    });
  },

  /**
   * 通过itemNo查询对应优惠券
   * @param params
   */
  itemNosForCouponsList(params) {
    return services.get(WpSchema + '/coupon/list_sub', {
      action: '通过itemNo查询对应优惠券',
      params,
    });
  },
  /**
   * 通过id查询对应营销图文
   * @param params
   */
  idForArticleList(params) {
    return services.get(WpSchema + '/market_article/query_available', {
      action: '通过id查询营销图文列表',
      params,
    });
  },
  /**
   * 通过itemNo查询对应拼团
   * @param params
   */
  itemNosForCollageList(params) {
    return services.get(WpSchema + '/pt/list', {
      action: '通过itemNo查询对应服务和产品列表',
      params,
    });
  },

  /**
   * 通过活动id列表及status查询对应秒杀
   * @param params
   */
  activityIdsForseckillList(params) {
    return services.get(WpSchema + '/seckill/list', {
      action: '通过activityId查询对应秒杀列表',
      params,
    });
  },

  /**
   * 根据条形码查询商品
   * @param params
   */
  itemDetailByBarCode(params) {
    return services.get(WpSchema + '/wx_store_item/query/one', {
      action: '根据条形码查询商品',
      params,
    });
  },

  /**
   * 保存辅助功能开关
   * @param {*} params
   */
  saveAuxiliaryFunctionSwitch(params) {
    return services.post(WpSchema + '/app/update/tag', params, {
      action: '保存辅助功能开关',
    });
  },

  /**
   * 获取公众号未处理客户消息
   * @param {*} params
   */
  getClientMessage(params) {
    return services.get(WpSchema + '/data/info/index', {
      params,
      action: '获取公众号未处理客户消息',
      hidden: true,
    });
  },

  getLiveRoomId(params) {
    return services.post(WpSchema + '/ma/live/list', params, {
      action: '获取直播房间ID',
    });
  },

  /**
   * 查询个人中心当前门店私有配置信息
   * @param {*} params
   */
  getPersonalCenterConfig(params) {
    return services.get(WpSchema + '/sellerTemplate/store/config/get', {
      params,
      action: '获取门店私有配置信息',
    });
  },

  /**
   * 更新个人中心门店模板配置信息
   * @param {*} params
   */
  updateStorePersonalCenter(params) {
    return services.post(WpSchema + '/sellerTemplate/store/config/update', params, {
      action: '更新个人中心模板配置信息',
    });
  },

  /**
   * 获取角色对应门店
   * @param {*} params
   */
  fetchStoreList(params) {
    return services.get(WpSchema + '/employee/query_store', {
      params,
      action: '获取当前角色所有门店',
    });
  },

  /**
   * 批量设置门店主页
   * @param {*} params
   */
  batchSetCustomHomePage(params) {
    return services.json(WpSchema + '/sellerTemplate/page/custom/home/batch/set', params, {
      action: '同步门店主页',
    });
  },

  /**
   * 获取装修模板列表
   * @param {*} params
   */
  fetchDecorationTemplateList(params) {
    return services.get(WpSchema + '/sellerTemplate/page/query_template', {
      params,
      action: '获取装修模版列表',
    });
  },

  /**
   * 设置自定义为模板页
   * @param {*} params
   */
  setCustomPageToTemplate(params) {
    return services.post(WpSchema + '/sellerTemplate/page/set_template', params, {
      action: '设置模板',
    });
  },

  /**
   * 删除模板列表的模板页
   * @param {*} params
   */
  delTemplatePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/delete_template', params, {
      action: '删除模板',
    });
  },

  /**
   * 复制模板列表的模板页
   * @param {*} params
   */
  copyTemplatePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/copy_template', params, {
      action: '复制模板',
    });
  },

  /**
   * 恢复默认首页为真正主页
   * @param {*} params
   */
  setDefaultTemplatePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/default/home/set/v3', params, {
      action: '设置默认模板',
    });
  },

  /**
   * 设置为备用页为真正主页
   * @param {*} params
   */
  setCustomToDefaultTemplatePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/set/v3', params, {
      action: '设置默认模板',
    });
  },

  /**
   * 查询当前门店主页和备用页接口
   * @param {*} params
   */
  fetchStoreIndexList(params) {
    return services.get(WpSchema + '/sellerTemplate/page/home/list/v3', {
      params,
      action: '查询当前门店主页和备用页接口',
    });
  },

  /**
   * 替换自定义页为主页
   */
  replaceCustomHomePageV3(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/replace/v3', params, {
      action: '替换自定义页为首页',
    });
  },

  /**
   * 设置自定义页为首页
   * @param params
   */
  setCustomToHomePageV3(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/set/v3', params, {
      action: '设置备用页为首页',
    });
  },

  /**
   * 删除备用页
   */
  deleteHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/custom/home/delete/v3', params, {
      action: '删除备用页',
    });
  },

  /**
   * 同步品牌门店模板
   */
  syncHomePage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/syn_brand_template', params, {
      action: '同步品牌门店模板',
    });
  },

  /**
   * 查询自定义页(品牌、门店)
   * @param params
   */
  getCustomPagesV3(params) {
    return services.get(WpSchema + '/sellerTemplate/page/custom/list/v3', {
      action: '获取自定义页',
      params,
    });
  },

  /**
   * 同步品牌门店模板
   */
  copyBrandPage(params) {
    return services.post(WpSchema + '/sellerTemplate/page/copy_brand_page', params, {
      action: '复制品牌当前模板页',
    });
  },

  /**
   * 复制品牌模板至门店苦
   */
  copyBrandPageToStore(params) {
    return services.post(WpSchema + '/sellerTemplate/page/copy_brand_page_v2', params, {
      action: '复制装修模板页',
    });
  },

  /**
   * 查询经销商列表
   * @param params
   */
  queryDealerStoreTree(params) {
    return services.get(WpSchema + '/dealer/queryDealerStoreStatistic', {
      action: '查询经销商列表',
      params,
    });
  },

  /**
   * 查询获取组织树信息列表
   */
  getOrganizationTree(params) {
    return services.get(WpSchema + '/organization/tree/get', {
      params,
      action: '获取组织树',
    });
  },

  /**
   * 查询获取组织树信息列表(区分直营 经销商)
   */
  getDealerList(params) {
    return services.get(WpSchema + '/dealer/list/query/by/role', {
      params,
      action: '获取组织树',
    });
  },

  /**
   * 查询上架门店
   */
  queryItemStore(params) {
    return services.get(WpSchema + '/store/queryByItemDept', {
      action: '查询上架门店',
      params,
    });
  },
};
