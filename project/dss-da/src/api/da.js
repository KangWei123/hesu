import services from '@/dss-common/utils/services';
const PREFIX = '/c';
const SCHEMA = '/athena';
export default {
  member: {
    listTrendData(params) {
      return services.get(PREFIX + '/uni_data_report/user.trend.d/get', {
        params,
        action: '获取趋势指标'
      });
    },
    listLoyaltyAnalysisData(params) {
      return services.get(PREFIX + '/uni_data_report/user.repeat.customer.loyalty.d/get', {
        params,
        action: '获取忠诚度分析'
      });
    },
    listPurchaseAnalysisData(params) {
      return services.get(PREFIX + '/uni_data_report/user.repeat.customer.buypower.d/get', {
        params,
        action: '获取购买力分析'
      });
    },
    listRepeatPurchase(params) {
      return services.get(PREFIX + '/uni_data_report/user.repeat.purchase.d/get', {
        params,
        action: '获取复购率'
      });
    },
    getMemberRealData(params) {
      return services.get(PREFIX + '/uni_data_report/user.trend.detail/get', {
        params,
        action: '获取实时指标'
      });
    }
  },
  sales: {
    getBubbleData(params) {
      return services.get(PREFIX + '/uni_data_report/order.sale.bubble/get', {
        params,
        action: '获取销售额分析品类气泡图'
      });
    },
    getItemRankData(params) {
      return services.get(PREFIX + '/uni_data_report/order.sale.item.rank/get', {
        params,
        action: '获取销售额分析单品销售额排行'
      });
    },
    getTrendData(params) {
      return services.get(PREFIX + '/uni_data_report/order.sale.trend.d/get', {
        params,
        action: '获取销售额分析趋势图'
      });
    },
    getStoreData(params) {
      return services.get(PREFIX + '/uni_data_report/order.sale.store.fee.rank/get', {
        params,
        action: '获取门店销售额排行'
      });
    },
    getAnalysisData(params) {
      return services.get(PREFIX + '/uni_data_report/order.sale.analysis.detail/get', {
        params,
        action: '获取销售指标'
      });
    }
  },
  ma: {
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
  }
};
