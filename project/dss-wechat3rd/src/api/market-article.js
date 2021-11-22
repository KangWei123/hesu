/**
 * Created by admin on 2019/8/1.
 * @author lemon<李亦黎>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  list(params) {
    return services.get(WpSchema + '/market_article/query/list', {
      action: '获取营销图文列表',
      params,
    });
  },
  add(params) {
    return services.json(WpSchema + '/market_article/add', params, {
      action: '新增营销图文',
    });
  },
  addNew(params) {
    return services.post(WpSchema + '/market_article/add_new', params, {
      action: '新增营销图文（新）',
    });
  },
  update(params) {
    return services.json(WpSchema + '/market_article/update', params, {
      action: '修改营销图文',
    });
  },
  delete(params) {
    return services.post(WpSchema + '/market_article/delete', params, {
      action: '删除营销图文',
    });
  },
  detail(per_chooseAppId, id) {
    return services.get(WpSchema + `/market_article/query?id=${id}`, {
      action: '通过图文id获取获取营销图文详情',
    });
  },
  onshelve(params) {
    return services.post(WpSchema + '/market_article/onshelve', params, {
      action: '上架营销图文',
    });
  },
  offshelve(params) {
    return services.post(WpSchema + '/market_article/offshelve', params, {
      action: '下架营销图文',
    });
  },
  // 分类相关接口
  categoryList(params) {
    return services.get(WpSchema + '/article_category/query/list', {
      action: '获取营销图文分类',
      params,
    });
  },
  addCategory(params) {
    return services.json(WpSchema + '/article_category/add', params, {
      action: '添加营销图文分类',
    });
  },
  deleteCategory(params) {
    return services.post(WpSchema + '/article_category/delete', params, {
      action: '删除营销图文分类',
    });
  },
  updateCategory(params) {
    return services.json(WpSchema + '/article_category/update', params, {
      action: '修改营销图文分类',
    });
  },
  checkName(params) {
    return services.get(WpSchema + '/article_category/check/name', {
      action: '校验图文分类名称',
      params,
    });
  },
  // 评论相关接口
  commentList(params) {
    return services.get(WpSchema + '/market_article/comment/query', {
      action: '获取营销图文评论列表',
      params,
    });
  },
  deleteComment(params) {
    return services.post(WpSchema + '/market_article/comment/delete', params, {
      action: '删除评论',
    });
  },
  addReplyComment(params) {
    return services.json(WpSchema + '/market_article/comment/add_reply', params, {
      action: '添加回复评论',
    });
  },
  updateReplyTop(params) {
    return services.post(WpSchema + '/market_article/comment/update_reply_top', params, {
      action: '置顶/取消置顶评论',
    });
  },
  /**
   * 获取马甲账号信息
   */
  getPuppetList(params) {
    return services.get(`${WpSchema}/market_article/comment/puppet/get`, {
      action: '获取马甲账号信息',
      params,
    });
  },
  /**
   * 删除马甲账号
   */
  PuppetDelete(params) {
    return services.json(`${WpSchema}/market_article/comment/puppet/delete`, params, {
      action: '删除马甲账号',
    });
  },
  /**
   * 创建马甲账号
   */
  PuppetAdd(params) {
    return services.json(`${WpSchema}/market_article/comment/puppet/add`, params, {
      action: '创建马甲账号',
    });
  },
  /**
   * 发表马甲评论
   */
  addPupReplyComment(params) {
    return services.json(`${WpSchema}/market_article/comment/puppet_comment/add`, params, {
      action: '发表马甲评论',
    });
  },
};
