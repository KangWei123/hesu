import services from '@/dss-common/utils/services';
const WpSchema = '';
export default {
  /**
   * 获取所有自定义页
   * @param params
   */
  getCustomPages(params) {
    return services.get(WpSchema + '/wp/sellerTemplate/page/custom/list', {
      action: '获取所有自定义页',
      params
    });
  },

  /**
   * 获取所有页面
   * @param params
   */
  getUserPages(params) {
    return services.get(WpSchema + '/wp/sellerTemplate/page/list', {
      action: '获取所有页面',
      params
    });
  },

  /**
   * 更新模板配置（导航修改的时候）
   * @param params
   */
  updateUserTemplate(params) {
    return services.post(WpSchema + '/wp/sellerTemplate/config/update', params, {
      action: '更新模板配置'
    });
  },

  /**
   * 更新模板配置
   * @param params
   */
  updateTemplate(params) {
    return services.json(WpSchema + '/wp/sellerTemplate/template/update', params, {
      action: '更新模板配置'
    });
  },

  /**
   * 简历转盘引用关系
   * @param params
   * @returns {*}
   */
  buildCitedForLucky(params) {
    return services.get(WpSchema + '/wp/lucky_turning/cited', {
      action: '简历转盘引用关系',
      params
    });
  }
};
