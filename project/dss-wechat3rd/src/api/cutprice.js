import services from '@/dss-common/utils/services';
import Qs from 'qs';
import wpBaseApi from '@/business-common/wp-base-api.js';
const WpSchema = wpBaseApi.WpSchema;

export default {
  bargain: {
    create(params) {
      return services.json(WpSchema + '/bargain/activity/create', params, {
        action: '创建砍价活动'
      });
    },

    delete(id) {
      return services.post(
        WpSchema + '/bargain/activity/delete',
        {
          id: id
        },
        {
          action: '删除砍价活动'
        }
      );
    },

    shelf(params) {
      return services.post(WpSchema + '/bargain/activity/shelf', params, {
        action: '砍价活动上下架'
      });
    },

    update(params) {
      return services.json(WpSchema + '/bargain/activity/update', params, {
        action: '更新砍价活动'
      });
    },

    list(params) {
      return services.get(WpSchema + '/bargain/activity/manage/listV2', {
        action: '获取活动列表',
        params
      });
    },

    detail(id) {
      return services.get(`${WpSchema}/bargain/activity/detail?id=${id}`, {
        action: '获取活动详情'
      });
    },

    initiateList(params) {
      return services.get(WpSchema + '/bargain/activity/list', {
        action: '获取发起砍价列表',
        params,
        paramsSerializer(data) {
          return Qs.stringify(data, {
            allowDots: true
          });
        }
      });
    },

    initiateDetail(params) {
      return services.get(WpSchema + '/bargain/activity/initiate/detail', {
        action: '获取发起砍价列表',
        params
      });
    },

    setting_select(params) {
      return services.get(WpSchema + '/bargain_setting/select', {
        action: '获取砍价设置',
        params
      });
    },

    setting_update(params) {
      return services.json(WpSchema + '/bargain_setting/update', params, {
        action: '更新砍价设置'
      });
    },

    manage_list(params) {
      return services.get(WpSchema + '/bargain/activity/manage/list', {
        action: '砍价活动管理列表',
        params
      });
    },

    activityOver(params) {
      return services.post(WpSchema + '/bargain/activity/over', params, {
        action: '结束砍价活动'
      });
    },

    /**
     * 校验砍价门店
     * @param {*} params 商品信息
     */
    queryUnavaliableStore(params) {
      return services.get(WpSchema + '/bargain/activity/queryUnavaliableStore', {
        action: '获取不符合规则的门店',
        params
      });
    }
  }
};
