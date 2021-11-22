import services from '@/dss-common/utils/services';

export default {
  createActivity(params) {
    return services.post('/c/buz/activity/create', params, {
      action: '创建活动'
    });
  },

  listActivity(params) {
    return services.get('/c/buz/activity/list', {
      params,
      action: '活动列表'
    });
  },

  //获取所有活动列表，只有精简的字段，且不分页
  listCondensedActivity() {
    return services.get('/c/buz/activity/list/all', {
      action: '活动列表'
    });
  },

  getActivityEffect(params) {
    return services.get('/c/buz/activity/effect', {
      params,
      action: '效果分析'
    });
  },

  downloadEffectData(activityId) {
    window.open(
      url.makeUrl('/c/buz/activity/effect/download', {
        activityId: activityId,
        fileName: '效果明细分析.csv'
      })
    );
  }
};
