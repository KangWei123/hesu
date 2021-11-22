/**
 * Created by admin on 2019/7/29.
 * @author lemon<李亦黎>
 */
import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';

const WpSchema = wpBaseApi.WpSchema;
export default {
  list(params) {
    return services.get(WpSchema + '/share/present/query/list', {
      params,
      action: '获取分享有礼列表',
    });
  },
  add(params) {
    return services.post(WpSchema + '/share/present/add', params, {
      action: '新增分享有礼',
    });
  },
  detail(sharePresentInfoId) {
    return services.get(WpSchema + `/share/present/query?sharePresentInfoId=${sharePresentInfoId}`, {
      action: '查看分享有礼活动详情',
    });
  },
  // 更改分享有礼活动状态
  update(activityId, activityStatus) {
    return services.json(WpSchema + '/share/present/updateStatus', activityId, activityStatus);
  },
  queryList(params) {
    return services.get(WpSchema + '/store/query/dept', {
      params,
      action: '获取该商户下所有门店列表',
    });
  },
  queryRecordById(params) {
    return services.get(WpSchema + '/share/present/queryRecordById', {
      params,
      action: '查看分享有礼活动记录',
    });
  },
  addRecordUser(params) {
    return services.post(WpSchema + '/share/present/addRecodUser', params, {
      action: '新增分享有礼记录用户相关信息',
    });
  },
};
