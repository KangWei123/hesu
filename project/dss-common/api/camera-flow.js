import services from '../utils/services';

// 实时客流
const API_RT_PASSENGER = '/c/stat/pf/storeRTInfoNew';
// 实时顾客
const API_RT_CUSTOMER = '/c/stat/pf/storeRTUVInfo?';
// 画像
const API_CAMERA_PORTRAIT = 'c/stat/portrait/camera_portrait';
// 客流量分析
const API_PASSENGER_DIAGNOSIS = '/c/stat/pf/list';
// 客流量时段对比
const API_PASSENGER_HOUR = '/c/stat/pfh/list_hour';
// 用户到店标签
const API_CAMERA_TAG = '/c/statistic/report/store/cameraCustomerTagData';
// 客户到店列表
const API_CUSTOMER_LIST = '/c/customer/query_customer';
// 客户到店列表(新)
const API_FETCH_CUSTOMER_LIST = '/c/customer/query_customer_new';
const API_REALTIME_CUSTOMER_LIST = '/c/statistic/report/store/customer_rt__enter';
// 用户白名单列表
const API_EMPLOYEE_LIST = '/c/store/employee/query';
// 用户到店标签
const API_CAMERA_RT_TAG = '/c/statistic/report/store/camera_rt_customer';
// 设置用户为店员，不在进入客流系统
const API_TAG_FLAG_SET = '/c/store/employee/inset_device';
// 取消用户为店员，重新进入客流系统
const API_TAG_FLAG_DELETE = '/c/store/employee/delete_device';
// 修改用户标签
const API_TAG_UPDATE = '/c/statistic/report/store/cameraCustomerTagData/update';
// 用户列表的用户占比
const API_USER_PORTRAIT = '/c/stat/portrait/customer_portrait';
// 用户列表的用户占比
const API_USER_REQUERY_RECORD = '/c/prom/guide_report/query_record';
// 查询用户
const API_CUSTOMER_QUERY = '/c/customer/query';
// 绑定用户faceid
const API_BIND_FACE = '/c/customer/bind/face';

// 绑定用户faceid
const API_USER_MEMBER = '/wp/user/query_by_phone';

// 获取商家印象
const API_MERCHANT_IMPRESSION = '/c/faceHistory/query_merchant_impression';

// 查询用户消费记录
const API_USER_ORDER_LIST = ' /wp/order/query/consume';

// 查询智能推荐
const API_RECOMMEND_LIST = '/wp/user/recommend/items_with_sku';

// 查询优惠券列表
const API_COUPON_LIST = '/wp/coupon/ticket/list/big_screen';

// 查询到店记录
const API_ARRIVE_RECORD_LIST = '/c/stat/pf/enter_record';

// 人脸图片上传
const API_UPLOAD_IMG = '/c/customer/query_customer_by_img';

// 查询浏览记录
const API_BROWSE_RECORD_LIST = '/wp/user/browse_record';

// 用户价值
const API_USER_VALUE = '/c/bigScreenETL/query/user_values';

// 消费品类占比
const API_CATEGORY_SALES_VOLUME = '/c/bigScreenETL/query/category_sales_volume';

// 短链触达
const API_SELECT_BY_MEMBERID = '/wp/wx/scheme/statistic/select_by_memberId';

export default {
  API_RT_PASSENGER,
  API_RT_CUSTOMER,
  API_CAMERA_PORTRAIT,
  API_PASSENGER_DIAGNOSIS,
  API_PASSENGER_HOUR,
  API_CAMERA_TAG,
  API_CUSTOMER_LIST,
  API_FETCH_CUSTOMER_LIST,
  API_REALTIME_CUSTOMER_LIST,
  API_EMPLOYEE_LIST,
  API_TAG_FLAG_SET,
  API_TAG_FLAG_DELETE,
  API_TAG_UPDATE,
  API_USER_PORTRAIT,
  API_USER_REQUERY_RECORD,
  API_CUSTOMER_QUERY,
  API_BIND_FACE,
  API_USER_MEMBER,
  API_CAMERA_RT_TAG,
  API_USER_ORDER_LIST,
  API_MERCHANT_IMPRESSION,
  API_RECOMMEND_LIST,
  API_COUPON_LIST,
  API_ARRIVE_RECORD_LIST,
  API_UPLOAD_IMG,
  API_BROWSE_RECORD_LIST,
  API_USER_VALUE,
  API_CATEGORY_SALES_VOLUME,
  API_SELECT_BY_MEMBERID,

  getRTPassenger(params) {
    return services.get(API_RT_PASSENGER, {
      action: '获取实时客流',
      params,
    });
  },

  getRTCustomer(params) {
    return services.get(API_RT_CUSTOMER, {
      action: '获取实时客户',
      params,
    });
  },

  getCameraPortrait(params) {
    return services.get(API_CAMERA_PORTRAIT, {
      action: '获取摄像头画像',
      params,
    });
  },

  getPassengerDiagnosis(params) {
    return services.get(API_PASSENGER_DIAGNOSIS, {
      action: '获取客流分析数据',
      params,
    });
  },

  getPassengerHour(params) {
    return services.get(API_PASSENGER_HOUR, {
      action: '获取客流时段数据',
      params,
    });
  },

  getCameraTag(params) {
    return services.get(API_CAMERA_TAG, {
      action: '获取摄像头用户到店标签',
      params,
    });
  },

  getCustomerList(params) {
    return services.get(API_CUSTOMER_LIST, {
      action: '获取客户到店列表',
      params,
    });
  },
  fetchCustomerList(params) {
    return services.get(API_FETCH_CUSTOMER_LIST, {
      action: '获取客户到店列表',
      params,
    });
  },
  fetchRealTimeCustomerList(params) {
    return services.get(API_REALTIME_CUSTOMER_LIST, {
      action: '获取客户到店列表',
      params,
    });
  },
  getWhiteCustomerList(params) {
    return services.get(API_EMPLOYEE_LIST, {
      action: '获取白名单列表列表',
      params,
    });
  },

  getNewCameraTag(params) {
    return services.get(API_CAMERA_RT_TAG, {
      action: '获取摄像头用户到店标签',
      params,
    });
  },

  setTagFlag(params) {
    return services.post(API_TAG_FLAG_SET, params, {
      action: '设置用户标签不再记录',
    });
  },

  deleteTagFlag(params) {
    return services.post(API_TAG_FLAG_DELETE, params, {
      action: '恢复用户标签记录',
    });
  },

  updateTagFlag(params) {
    return services.post(API_TAG_UPDATE, params, {
      action: '修改用户标签',
    });
  },

  getUserPortrait(params) {
    return services.get(API_USER_PORTRAIT, {
      action: '获取用户列表画像',
      params,
    });
  },
  getQueryRecord(params) {
    return services.get(API_USER_REQUERY_RECORD, {
      action: '获取用户到店记录',
      params,
    });
  },
  getQueryCustomer(params) {
    return services.get(API_CUSTOMER_QUERY, {
      action: '获取用户详情',
      params,
    });
  },

  getBindface(params) {
    return services.get(API_BIND_FACE, {
      action: '绑定用户faceid',
      params,
    });
  },
  getQueryMember(params) {
    return services.get(API_USER_MEMBER, {
      action: '获取用户id',
      params,
    });
  },

  getImpression(params) {
    return services.get(API_MERCHANT_IMPRESSION, {
      action: '获取商家印象',
      params,
    });
  },
  getUserOrderList(params) {
    return services.get(API_USER_ORDER_LIST, {
      action: '获取用户消费记录',
      params,
    });
  },
  getRecommendList(params) {
    return services.get(API_RECOMMEND_LIST, {
      action: '获取智能推荐',
      params,
    });
  },
  getCouponList(params) {
    return services.get(API_COUPON_LIST, {
      action: '获取优惠券列表',
      params,
    });
  },
  getArriveRecordList(params) {
    return services.get(API_ARRIVE_RECORD_LIST, {
      action: '获取到店记录',
      params,
    });
  },
  getBrowseRecordList(params) {
    return services.get(API_BROWSE_RECORD_LIST, {
      action: '获取浏览记录',
      params,
    });
  },
  getUserValue(params) {
    return services.get(API_USER_VALUE, {
      action: '获取用户价值',
      params,
    });
  },
  getCategroySales(params) {
    return services.get(API_CATEGORY_SALES_VOLUME, {
      action: '获取用户消费品类占比',
      params,
    });
  },
  getSelect_by_memberId(params) {
    return services.get(API_SELECT_BY_MEMBERID, {
      action: '获取用户短链触达',
      params,
    });
  },
};
