/**
 * Created by love on 18/11/3.
 * @author trumpli<李志伟>
 *
 * 功能特征判断
 */
let config = {};

export default {
  /**
   * 初始化配置
   * @param feature
   */
  config(app) {
    // 重新配置，要清空之前的属性，再赋值
    config = {};
    if (app.features) {
      for (const key in app.features) {
        config[key] = app.features[key];
      }
    }
  },
  keys: {
    CONSOLE_DISABLE_TARGET: 'console.target.disable',
    CONSOLE_DISABLE_AGENCY: 'console.agency.disable',
    CONSOLE_GOODS_ORDER_SUMMARY: 'console.goodsordersummary.show',
    MEMBER_DETAIL_HIDE_APPOINT: 'member.detail.appoint.hide',
    MEMBER_DETAIL_HIDE_SERVER: 'member.detail.server.hide',
    // 商品详情中的 库存 是否 禁止编辑
    GOODS_DETAIL_DISABLE_EDIT_STOCK: 'goods.detail.disable.edit.stock',
  },
  /**
   * 获取功能对应的值
   * @param key
   * @returns {String}
   */
  get(key) {
    if (!config.hasOwnProperty(key)) {
      return null;
    }
    return config[key];
  },
  /**
   * 当前功能是否支持
   * @param key
   * @returns {boolean}
   */
  can(key) {
    if (!config.hasOwnProperty(key)) {
      return false;
    }
    return config[key] === '1';
  },
};
