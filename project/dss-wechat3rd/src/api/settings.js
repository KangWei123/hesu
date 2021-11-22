/**
 * Created by love on 18/9/14.
 * @author trumpli<李志伟>
 */
import services from '@/dss-common/utils/services';
import { WpSchema } from '@/business-common/constants/apiEnum';

export default {
  /**
   * 添加微信直接支付模式
   * @param params
   */
  addWxDirectTrade(params) {
    return services.post(WpSchema + '/setting/pay/add_direct_trade', params, {
      action: '添加微信直接支付模式',
    });
  },

  /**
   * 获取小程序状态
   * @param params
   */
  getMaCodeStatus(params) {
    return services.get(WpSchema + '/maCode/status', {
      action: '获取小程序状态',
      params,
    });
  },

  /**
   * 上传小程序
   * @param params
   */
  uploadMinPro(params) {
    return services.post(WpSchema + '/maCode/code/upload', params, {
      action: '上传小程序',
    });
  },

  /**
   * 发布小程序
   * @param params
   */
  releaseMinPro(params) {
    return services.post(WpSchema + '/maCode/code/release', params, {
      action: '发布小程序',
    });
  },
  /**
   * 获取企业微信授权情况
   * @param params
   */
  getCompanyAuthCondition() {
    return services.get(WpSchema + '/wxwork/auth/app/list', {
      action: '获取企业微信授权情况',
      headers: { 'Content-Type': 'application/json' },
    });
  },
  /**
   * 新增企业应用的授权信息
   * @param params
   */
  addCompanyAuthInformation(params) {
    return services.post(WpSchema + '/wxwork/auth/app/add', params, {
      action: '新增企业应用的授权信息',
    });
  },
  /**
   * 更新企业应用的授权信息
   * @param params
   */
  updateCompanyAuthInformation(params) {
    return services.post(WpSchema + '/wxwork/auth/app/update', params, {
      action: '修改企业应用的授权信息',
    });
  },
  /**
   * 获取企业微信授权ID
   */
  getCompanyAuthId() {
    return services.get(WpSchema + '/wxwork/auth/corp/get', {
      action: '获取企业微信授权ID',
    });
  },
  /**
   * 获取小程序授权状态
   */
  getMpIsAuth(params) {
    return services.get(WpSchema + '/wxwork/auth/app/get', {
      params,
      action: '获取小程序授权状态',
    });
  },
  /**
   * 更新企业微信授权corpID
   */
  updateCompanyAuthId(params) {
    return services.post(WpSchema + '/wxwork/auth/corp/update', params, {
      action: '获取企业微信授权ID',
    });
  },
  /**
   * 获取打印机列表
   * @param params
   */
  getPrinterList(params) {
    return services.get(WpSchema + '/printer/query_list', {
      action: '获取打印机列表',
      params,
    });
  },

  /**
   * 添加打印机
   * @param params
   */
  printerAdd(params) {
    return services.post(WpSchema + '/printer/add', params, {
      action: '添加打印机',
    });
  },

  /**
   * 修改打印机状态
   * @param params
   */
  printerUpdataStatus(params) {
    return services.post(WpSchema + '/printer/update_printer_status', params, {
      action: '修改打印机状态',
    });
  },

  /**
   * 更新打印机
   * @param params
   */
  printerUpdate(params) {
    return services.post(WpSchema + '/printer/update', params, {
      action: '更新打印机',
    });
  },

  /**
   * 查询打印方式
   * @param params
   */
  queryPrinterWay(params) {
    return services.get(WpSchema + '/printer/query_printer_way', {
      action: '查询打印方式',
      params,
    });
  },

  /**
   * 修改打印方式
   * @param params
   */
  updatePrinterWay(params) {
    return services.get(WpSchema + '/printer/update_printer_way', {
      action: '修改打印方式',
      params,
    });
  },

  /**
   * 更新微信支付设置
   * @param params
   */
  updateWxPaySetting(params) {
    return services.post(WpSchema + '/setting/pay/update_direct_trade', params, {
      action: '更新微信支付设置',
    });
  },

  /**
   * 获取微信支付设置
   */
  getWxPaySetting() {
    return services.get(WpSchema + '/setting/pay/query_direct_trade_v2', {
      action: '获取微信支付设置',
    });
  },

  unBindApp(params) {
    return services.post(WpSchema + '/auth/authorizer/unbind', params, {
      action: '解除绑定',
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

  /**
   * 获取公众号配置的h5页面链接
   * @param params
   */
  getH5PageUrl(params) {
    return services.get(WpSchema + '/h5Template/get/homePageUrl', {
      action: '获取公众号配置的h5页面链接',
      hidden: true,
      params,
    });
  },

  /**
   * 获取协议信息
   */
  getDealInfo(params) {
    return services.get(WpSchema + '/app/recharge/agreement/query/agreement', {
      action: '获取协议信息',
      params,
    });
  },

  /**
   * 修改协议的内容
   * @param params
   */
  updateDealContent(params) {
    return services.post(WpSchema + '/app/recharge/agreement/update', params, {
      action: '修改协议内容',
    });
  },

  /**
   * 获取协议信息
   */
  getUserDealInfo(params) {
    return services.get(WpSchema + '/app/user/agreement/query_user_agreement', {
      action: '获取用户协议',
      params,
    });
  },

  /**
   * 修改协议的内容
   * @param params
   */
  updateUserDealContent(params) {
    return services.post(WpSchema + '/app/user/agreement/update_agreement', params, {
      action: '修改用户协议',
    });
  },

  /**
   * 开启协议
   * @param params
   */
  openDeal(params) {
    return services.post(WpSchema + '/app/recharge/agreement/update', params, {
      action: '开启协议',
    });
  },

  /**
   * 开启协议
   * @param params
   */
  deleteDeal() {
    return services.get(WpSchema + '/app/recharge/agreement/delete', {
      action: '关闭协议',
    });
  },
  getShopGuide(params) {
    return services.get(WpSchema + '/client/guide/list', {
      action: '查询导购列表',
      params,
    });
  },
};
