import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

const simpleActivityCache = {};

export default {
  activity: {
    /**
     * 装修列表
     * @param {{
     *   activityName?: string
     *   activityNo?: string
     *   pageNo: number
     *   pageSize: number
     * }} param
     */
    getDecorateableActivities(param) {
      return services.json(`${WpSchema}/activity/booking/list/embedded`, param, {
        action: '获取装修活动列表',
      });
    },
    /**
     * 通过 id 获取活动
     * @param {any[]} parmas
     */
    async getActivitiesByIds(parmas) {
      const nocaches = parmas.filter(i => !(i in simpleActivityCache));
      // 接口请求
      if (nocaches.length) {
        const { data } = await services.json(`${WpSchema}/activity/booking/list/ids`, nocaches, {
          action: '通过 ids 获取活动',
        });
        // 缓存
        data.forEach(i => {
          simpleActivityCache[i.id] = i;
        });
      }

      return parmas.map(i => simpleActivityCache[i]).filter(Boolean);
    },
  },
};
