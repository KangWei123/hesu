import services from '@/dss-common/utils/services';
const SCHEMA = '/athena';
export default {
  applicationOverView(appKey) {
    return services.get(SCHEMA + '/reportforms/getstatisticsnowdata', {
      action: '获取应用概览页数据',
      params: { appKey }
    });
  },
  activeAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getactiveanalysisdata', {
      action: '获取活跃分析数据',
      params
    });
  },
  getAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getobtainanalysisdate', {
      action: '获取分析页数据',
      params
    });
  },
  retainAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getnewremainanalysisdata', {
      action: '获取留存分析数据',
      params
    });
  },
  activeretainAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getactiveremainanalysisdata', {
      action: '获取活跃留存分析数据',
      params
    });
  },
  shareAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getusersharedetaildata', {
      action: '获取分享分析数据',
      params
    });
  },
  portraitAnalysis(params) {
    return services.get(SCHEMA + '/reportforms/getcrowdportraitdata', {
      action: '获取画像分析数据',
      params
    });
  }
};
