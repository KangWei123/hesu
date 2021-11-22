import services from '../utils/services';
const WpSchema = '/wp';
export default {
  getTripWarnCount(params) {
    return services.post(WpSchema + '/am/strategy/warnNum', params, {
      action: '获取旅程预警数',
    });
  },
  getTripWarnList(params) {
    return services.post(WpSchema + '/am/strategy/warnList', params, {
      action: '获取旅程预警列表',
    });
  },
};
