/**
 * Created by love on 21/7/29.
 * @author trumpli<lizuohua>
 */
import services from '@/dss-common/utils/services';

const WpSchema = '/mall/b';

export default {
  getFeedBackList(params) {
    return services.json(WpSchema + '/feedBack/queryFeedBack', params, {
      action: '获取回复信息列表',
    });
  },
  deteleFeedBack(params) {
    return services.json(WpSchema + '/adviceFeedback/manage/delete/feedback', params, {
      action: '删除回复信息以及反馈消息',
    });
  },
  addFeedBack(params) {
    return services.json(WpSchema + '/feedBack/addReply', params, {
      action: '回复反馈消息',
    });
  },

  getQuickReplyList(params) {
    return services.json(WpSchema + '/reply/quick/queryQuickReply', params, {
      action: '快捷回复列表',
    });
  },
  addQuickFeedBack(params) {
    return services.json(WpSchema + '/reply/quick/addQuickReply', params, {
      action: '添加快捷回复',
    });
  },
  editQuickFeedBack(params) {
    return services.json(WpSchema + '/reply/quick/updateQuickReply', params, {
      action: '修改快捷回复',
    });
  },
  deleteQuickFeedBack(params) {
    return services.get(WpSchema + '/reply/quick/deleteQuickReply', {
      params,
      action: '删除快捷回复',
    });
  },
};
