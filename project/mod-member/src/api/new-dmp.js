import services from '@/dss-common/utils/services';
const PREFIX = '/dmp2/rest';
const PREFIX_WP = '/wp/user';
const PREFIX_WP_ITEM = '/wp/item';
// 画像前缀
const PREFIX_WP_PORTRAIT = '/wp/portrait/dmp_insight/analysis';
// 人群包前缀
const PREFIX_NEW_CROWD = '/wp/portrait/dmp_crowd/package';
// 标签管理前缀
const PREFIX_NEW_LABEL = '/wp/portrait/dmp_tag';

const PREFIX_WP_NEW = '/wp';
export default {
  getTagTree() {
    // return services.get(`${PREFIX}/analysis/tag/tree`, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/tree`, {
      action: '获取标签',
    });
  },
  getTags(params) {
    // return services.post(`${PREFIX}/analysis/tag/dim`, params, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/dim`, {
      params,
      action: '获取标签可选值',
    });
  },
  getAnalysisCount(params) {
    // return services.post(`${PREFIX}/analysis/count`, params, {
    return services.post(`${PREFIX_WP_PORTRAIT}/count`, params, {
      action: '获取条件分析结果',
    });
  },
  getAnalysis(params) {
    // return services.post(`${PREFIX}/analysis/metric`, params, {
    return services.post(`${PREFIX_WP_PORTRAIT}/metric`, params, {
      action: '获取指标分析结果',
    });
  },
  getCustomTags(params) {
    return services.post(`${PREFIX}/tag/listTag`, params, {
      action: '获取自定义标签列表',
    });
  },
  getCrowd(params) {
    // return services.post(`${PREFIX}/crowd/query`, params, {
    return services.post(`${PREFIX_NEW_CROWD}/query/list`, params, {
      action: '获取我的人群',
    });
  },
  saveCrowd(params) {
    // return services.post(`${PREFIX}/crowd/add`, params, {
    return services.post(`${PREFIX_NEW_CROWD}/add`, params, {
      action: '保存我的人群',
    });
  },
  updateCrowd(params) {
    return services.post(`${PREFIX_NEW_CROWD}/update`, params, {
      action: '更新我的人群',
    });
  },
  delCrowd(id) {
    // return services.get(`${PREFIX}/crowd/delete?id=${id}`, {
    return services.get(`${PREFIX_NEW_CROWD}/delete?id=${id}`, {
      action: '删除我的人群',
    });
  },
  getCrowdById(id) {
    return services.get(`${PREFIX_NEW_CROWD}/query?id=${id}`, {
      action: '查询人群',
    });
  },
  login(params) {
    return services.get(`${PREFIX}/login/in`, {
      action: '登录',
      params,
    });
  },
  checkLogin() {
    return services.get(`${PREFIX}/login/check`, {
      action: '获取用户信息',
    });
  },
  logout() {
    return services.get(`${PREFIX}/login/out`, {
      action: '注销登录',
    });
  },
  getAreaTree() {
    return services.get(`${PREFIX}/analysis/tag/store`, {
      ation: '获取区域',
    });
  },
  crowdImport(params) {
    return services.post(`${PREFIX}/crowd/import`, params, {
      action: '人群导入',
    });
  },
  /**
   * 我的标签
   */
  // 标签分类
  // 获取所有标签的分类
  getCategories() {
    // return services.get(`${PREFIX_WP}/business/impression/tag/categories`, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/business_impression/categories`, {
      action: '标签分类',
    });
  },
  getCategoriesPigination(params) {
    return services.get(
      // `${PREFIX_WP}/business/impression/tag/categories?queryType=page`, {
      `${PREFIX_NEW_LABEL}/tag/business_impression/categories?queryType=page`,
      {
        action: '标签分类',
        params,
      }
    );
  },
  // 删除标签分类
  deleteCategoryById(params) {
    return services.post(
      // `${PREFIX_WP}/business/impression/tag/category/delete?id=${params.id}`,
      `${PREFIX_NEW_LABEL}/tag/business_impression/category/delete`,
      params,
      {
        action: '删除标签分类',
      }
    );
  },
  // 添加标签分类
  addCategory(params) {
    return services.json(
      // `${PREFIX_WP}/business/impression/tag/category/add`,
      `${PREFIX_NEW_LABEL}/tag/business_impression/category/add_upd`,
      params,
      {
        action: '添加标签分类',
      }
    );
  },
  // // 增加标签分类
  // addCategory(params) {
  //   return services.json(
  //     `${PREFIX_WP}/business/impression/tag/category`,
  //     params,
  //     {
  //       action: '增加标签分类'
  //     }
  //   )
  // },
  // 检测商家印象标签是否重名
  testImpressionTagExist(params) {
    // return services.get(`${PREFIX_WP}/business/impression/tag/exists`, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/business_impression/exists`, {
      action: '检测标签是否重名',
      params,
    });
  },
  // 新增商家印象标签
  addImpressionTag(params) {
    // return services.json(`${PREFIX_WP}/business/impression/tag/add`, params, {
    return services.json(`${PREFIX_NEW_LABEL}/tag/business_impression/add`, params, {
      action: '新增商家印象标签',
    });
  },
  // 获取或查询商家印象标签
  getImpressionTags(params) {
    // return services.get(`${PREFIX_WP}/business/impression/tags`, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/business_impression/list`, {
      action: '查询商家印象标签',
      params,
    });
  },
  // 获取商家印象标签详情
  getImpressionTagById(params) {
    // return services.get(`${PREFIX_WP}/business/impression/tag/detail?id=${params.id}`, {
    return services.get(`${PREFIX_NEW_LABEL}/tag/business_impression/detail?id=${params.id}`, {
      action: '获取商家印象标签详情',
    });
  },
  // 删除商家印象标签
  deleteImpressionTagById(params) {
    return services.post(
      // `${PREFIX_WP}/business/impression/tag/delete?id=${params.id}`, {
      `${PREFIX_NEW_LABEL}/tag/business_impression/delete`,
      params,
      {
        action: '删除商家印象标签',
      }
    );
  },

  // 条件标签相关
  // 检测条件标签是否重名
  testAutoLabelExist(params) {
    return services.get(`${PREFIX_WP}/autolabel/exsits`, {
      action: '检测条件标签是否重名',
      params,
    });
  },
  // 新增条件标签
  addAutoLabel(params) {
    return services.post(`${PREFIX_WP}/add_auto_label`, params, {
      action: '新增条件标签',
    });
  },
  // 查询条件标签列表
  getAutoLabels(params) {
    return services.get('/wp/portrait/dmp_tag/tag/auto_label/list', {
      // return services.get(`${PREFIX_WP}/query_auto_label`, {
      action: '获取条件标签列表',
      params,
    });
  },
  // 删除条件标签
  deleteConditionTagById(params) {
    return services.post('/wp/portrait/dmp_tag/tag/auto_label/delete', params, {
      // return services.post(`${PREFIX_WP}/delete_auto_label`, params, {
      action: '删除条件标签失败',
    });
  },
  // 获取条件标签详情
  getAutoLabelDetailById(params) {
    return services.get('/wp/portrait/dmp_tag/tag/auto_label/detail', {
      // return services.get(`${PREFIX_WP}/auto_label_detail`, {
      action: '获取条件标签详情',
      params,
    });
  },
  // 获取商品标签列表
  getMerchantLabelTag(params) {
    return services.get(`${PREFIX_WP_ITEM}/label/query`, {
      action: '获取商品标签列表',
      params,
    });
  },
};
