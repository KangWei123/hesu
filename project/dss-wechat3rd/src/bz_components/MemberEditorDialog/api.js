/**
 * Created by allenhe on 18/9/5.
 * @author allen
 */
import services from '@/dss-common/utils/services.js';

export default {
  detail(params) {
    return services.get('/wp/user/user_detail', {
      action: '获取会员信息',
      params,
    });
  },

  newMember(params) {
    return services.json('/wp/user/add_user', params, { action: '添加会员' });
  },

  updateMember(params) {
    return services.post('/wp/user/update_user', params, {
      action: '编辑会员',
    });
  },

  getLevelSimplyList(params) {
    return services.json('/plt/level/config/list', params, {
      action: '获取会员等级列表',
    });
  },
};
