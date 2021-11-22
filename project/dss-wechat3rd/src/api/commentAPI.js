import services from '@/dss-common/utils/services.js';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  query(params) {
    return services.get(WpSchema + '/item_comment/queryList', {
      action: '获取评论列表',
      params
    });
  },
  deleteComment(params) {
    return services.get(WpSchema + '/item_comment/delete_vir', {
      action: '删除评论',
      params
    });
  },
  showComment(params) {
    return services.get(WpSchema + '/item_comment/set_show', {
      action: '显示评论',
      params
    });
  },
  replyComment(params) {
    return services.get(WpSchema + '/item_comment/reply', {
      action: '回复',
      params
    });
  },
  hideComment(params) {
    return services.get(WpSchema + '/item_comment/set_hide', {
      action: '隐藏评论',
      params
    });
  },
  addComment(params) {
    return services.json(WpSchema + '/item_comment/add_vir', params, {
      action: '新增虚拟评论'
    });
  },
  handlePick(params) {
    return services.post(WpSchema + '/item_comment/recommend', params, {
      action: '是否精选'
    });
  },
  querySetUpMeassage(params) {
    return services.get(WpSchema + '/item_comment/config/get', {
      action: '获取晒单配置',
      params
    });
  },
  saveSetUpMeassage(params) {
    return services.post(WpSchema + '/item_comment/config/update', params, {
      action: '晒单配置修改'
    });
  },
  deleteComments(params) {
    return services.post(WpSchema + '/item_comment/sub/delete', params, {
      action: '删除商品评论'
    });
  },
  queryComment(params) {
    return services.get(WpSchema + '/item_comment/sub/list', {
      action: '查询晒单下评论',
      params
    });
  }
};
