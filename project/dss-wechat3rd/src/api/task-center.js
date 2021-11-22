import services from '@/dss-common/utils/services';
import wpBaseApi from '@/business-common/wp-base-api';
const WpSchema = wpBaseApi.WpSchema;
const PREFIX = '/wp/promotion';

export default {
  /**
   * 查询推广任务列表
   * @param params
   */
  getTaskList(params) {
    return services.get(`${WpSchema}/promotion/task/list`, {
      params,
      action: '获取推广任务列表'
    });
  },
  /**
   * 删除推广任务
   * @param params
   */
  deleteTaskById(params) {
    return services.post(`${WpSchema}/promotion/task/delete`, params, {
      action: '删除推广任务'
    });
  },
  /**
   * 提前结束推广任务
   * @param params
   */
  finishTaskById(params) {
    return services.post(`${WpSchema}/promotion/task/end`, params, {
      action: '提前结束推广任务'
    });
  },
  /**
   * 查询推广任务记录列表
   * @param params
   */
  getTaskRecordList(params) {
    return services.get(`${WpSchema}/promotion/task/record/list`, {
      params,
      action: '查询推广任务记录列表'
    });
  },
  /**
   * 查询单条任务记录
   * @param params
   */
  getTaskRecord(params) {
    return services.get(`${WpSchema}/promotion/task/invite/id/list`, {
      params,
      action: '查询单条任务记录'
    });
  },
  /**
   * 查询砍价任务记录
   * @param params
   */
  getTaskBargainList(params) {
    return services.get(`${WpSchema}/bargain/activity/list`, {
      params,
      action: '查询砍价任务记录'
    });
  },
  /**
   * 获取砍价任务详情
   * @param {*} id
   */
  initiateDetail(params) {
    return services.get(WpSchema + '/bargain/activity/initiate/detail', {
      action: '获取砍价任务详情',
      params
    });
  },
  /**
   * 查询拼团任务记录
   * @param params
   */
  getTaskGroupList(params) {
    return services.get(`${WpSchema}/pt_group/detail/list`, {
      params,
      action: '查询拼团任务记录'
    });
  },
  /**
   * 获取拼团任务详情
   * @param params
   */
  getOrderDetail(params) {
    return services.get(`${WpSchema}/order/detail`, {
      params,
      action: '获取拼团任务详情'
    });
  },
  /**
   * 查询秒杀任务记录
   * @param params
   */
  getTaskSekillList(params) {
    return services.get(`${WpSchema}/order/listV2`, {
      params,
      action: '查询秒杀任务记录'
    });
  },

  /**
   * 获取拼团详情
   * @param {*} id
   */
  groupDetail(id) {
    return services.get(`${WpSchema}/pt_group/detail?groupNo=${id}`, {
      action: '获取拼团详情'
    });
  },

  // 获取创建任务
  getAddTask(params) {
    return services.json(`${PREFIX}/task/save`, params, {
      action: '添加创建任务'
    });
  },
  // 获取编辑创建任务
  getEditTask(params) {
    return services.get(PREFIX + '/task/info', {
      params,
      action: '获取编辑创建任务'
    });
  },
  // 获取优惠券
  getCouponsList(params) {
    return services.get('/wp/coupon/query', {
      params,
      action: '获取优惠券'
    });
  },

  /**
   * 获取区域
   * @param params
   * @returns {*}
   */
  queryRegion(parentId = 0) {
    return services.get('/c/buz/region/query', {
      action: '获取区域',
      params: {
        parentId: parentId
      }
    });
  },
  /**
   * 物流公司列表
   * @param params
   * @returns {*}
   */
  getShippingCompanyList(params) {
    return services.get(WpSchema + '/order/shipping_company_list', {
      params: params,
      action: '物流公司列表'
    });
  },
  /**
   * 订购订单发货
   * @param params
   * @returns {*}
   */
  micro_shipping(params) {
    return services.get(WpSchema + '/order/customize/shipping', {
      params: params,
      action: '发货'
    });
  },
  /**
   * 发货
   * @param params
   * @returns {*}
   */
  shipping(params) {
    return services.get(WpSchema + '/order/shipping', {
      params: params,
      action: '发货'
    });
  },
  /**
   * 商家查询发货单信息
   * @param params
   * @returns {*}
   */
  getQueryLogistics(params) {
    return services.get(WpSchema + '/order/query_logistics', {
      params: params,
      action: '查询发货单信息'
    });
  },
  /**
   * 修改收获地址
   * @param params
   * @returns {*}
   */
  updateAdress(params) {
    return services.get(WpSchema + '/order/update/address', {
      params: params,
      action: '修改收获地址'
    });
  },
  /**
   * 订单备注接口
   * @param params
   * @returns {*}
   */
  addOrderRemark(params) {
    return services.get(WpSchema + '/order/message', {
      params: params,
      action: '订单备注接口'
    });
  },
  /**
   * 确认自提接口
   * @param params
   * @returns {*}
   */
  confirmOrderRemark(params) {
    return services.get(WpSchema + '/order/self_pickup', {
      params: params,
      action: '确认自提接口'
    });
  },

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
      return services.get(WpSchema + '/bargain/activity/manage/list', {
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
        params
        // paramsSerializer(data) {
        //   return Qs.stringify(data, {
        //     allowDots: true
        //   });
        // }
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
     * 查询物流信息
     * @param params
     * @returns {*}
     */
    getLogistics(params) {
      return services.get(WpSchema + '/logistics/message/query', {
        params: params,
        action: '查询物流信息'
      });
    }
  }
};
