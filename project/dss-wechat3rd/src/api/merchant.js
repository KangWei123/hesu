import services from '@/dss-common/utils/services';

const WpSchema = '/mall/b';

export default {
  queryFloorList(params) {
    return services.get(`${WpSchema}/storey/query/list`, {
      params,
      action: '获取楼层列表',
    });
  },
  floor: {
    queryFloor(params) {
      return services.json(`${WpSchema}/building/queryList`, params, {
        action: '查询楼栋列表',
      });
    },
    addFloor(params) {
      return services.json(`${WpSchema}/building/create`, params, {
        action: '增加楼栋信息',
      });
    },
    updateFloor(params) {
      return services.json(`${WpSchema}/building/update`, params, {
        action: '修改楼栋信息',
      });
    },
    deleteFloor(params) {
      return services.get(`${WpSchema}/building/deleteById`, {
        params,
        action: '根据指定Id删除楼栋信息',
      });
    },
    detailFloor(params) {
      return services.get(`${WpSchema}/building/queryById`, {
        params,
        action: '根据指定Id查询楼栋信息',
      });
    },
  },
  business: {
    add(params) {
      return services.json(`${WpSchema}/tenant/create`, params, {
        action: '增加商户',
      });
    },
    update(params) {
      return services.json(`${WpSchema}/tenant/update`, params, {
        action: '编辑商户',
      });
    },
    updateStatus(params) {
      return services.post(`${WpSchema}/tenant/updateStatus`, params, {
        action: '编辑商户',
      });
    },
    detail(params) {
      return services.post(`${WpSchema}/tenant/queryById`, params, {
        action: '获取商户详情',
      });
    },
    del(params) {
      return services.get(`${WpSchema}/tenant/deleteById`, {
        params,
        action: '根据楼层Id删除商户列表',
      });
    },
    query(params) {
      return services.json(`${WpSchema}/tenant/queryList`, params, {
        action: '查询商户列表',
      });
    },
  },

  businessChangeStatus(params) {
    return services.get(`${WpSchema}/business/change/status`, {
      params,
      action: '改边楼层商户状态',
    });
  },

  businessQueryLogos(params) {
    return services.get(`${WpSchema}/business/query/logos`, {
      params,
      action: '根据楼层Id查找商户logo',
    });
  },
  // 基于关键词以及其他查询条件分页查询商户列表
  queryBusinessList(params) {
    return services.json(`${WpSchema}/business/queryBusinessList`, params, {
      action: '基于关键词以及其他查询条件分页查询商户列表',
    });
  },
  // 查询楼栋列表
  queryBusinessBuilding() {
    return services.json(`${WpSchema}/business/building/query`, {}, {});
  },
  /* 查询商户品类列表 */
  storeCategoryQueryList(params) {
    return services.json(`${WpSchema}/store-category/queryList`, params, {
      action: '查询商户品类列表',
    });
  },
  // 基于编号查询商户信息
  queryBusinessByCode(params) {
    return services.post(`${WpSchema}/business/queryBusinessByCode?code=${params.code}`);
  },
  // 新增商户
  addBusiness(params) {
    return services.json(`${WpSchema}/business/insert`, params, {
      action: '新增商户',
    });
  },
  // 更新商户
  updateBusiness(params) {
    return services.json(`${WpSchema}/business/update`, params, {
      action: '更新商户',
    });
  },
  // 分页获取商户账号列表
  queryBusinessUserList(params) {
    console.log(params);
    return services.json(`${WpSchema}/user-account/business-user/query-list`, params, {
      action: '分页获取商户账号列表',
    });
  },
  // 添加商户账号
  addBusinessUserAccount(params) {
    return services.json(`${WpSchema}/user-account/insert-business-user`, params, {
      action: '添加商户账号',
    });
  },
  updateBusinessUserAccount(params) {
    return services.json(`${WpSchema}/user-account/update-business-user`, params, {
      action: '编辑商户账号',
    });
  },
  // 根据id查询商户账号
  queryBusinessUserById(params) {
    return services.json(`${WpSchema}/user-account/business-user/query-single`, params, {
      action: '根据id查询商户账号',
    });
  },
  // 商品排序
  businessSort(params) {
    return services.post(`${WpSchema}/business/sort`, params, {
      action: '商品排序',
    });
  },
  // 修改商户状态
  updateBusinessStatus(params) {
    return services.json(`${WpSchema}/business/status/update`, params, {
      action: '修改商户状态',
    });
  },

  updateBusinessShow(params) {
    return services.json(`${WpSchema}/business/status/updateIsShowById`, params, {
      action: '修改商户状态',
    });
  },

  // 校检同一业态下备用编码
  checkCodeBak(params) {
    return services.post(`${WpSchema}/business/check/code/bak`, params, {
      action: '校检同一业态下备用编码',
    });
  },

  // 商户发券
  // 新增发券权限
  addCouponJurisdiction(params) {
    return services.json(`${WpSchema}/business/send/coupon/insert`, params, {
      action: '新增发券权限',
    });
  },
  // 发券权限列表
  getCouponJurisdictionList(params) {
    console.log(params);
    return services.json(`${WpSchema}/business/send/coupon/list`, params, {
      action: '发券权限列表',
    });
  },
  // 修改发券权限
  updateCouponJurisdiction(params) {
    return services.json(`${WpSchema}/business/send/coupon/update`, params, {
      action: '修改发券权限',
    });
  },
  // 获取userId
  getCouponJurisdictionUserId(id) {
    return services.json(`${WpSchema}/coupons/selectBusniessAuthById?id=${id}`, {
      action: '获取userId',
    });
  },

  // 优惠券
  // 添加优惠券
  addCoupon(params) {
    return services.json(`${WpSchema}/coupons/add`, params, {
      action: '添加优惠券',
    });
  },
  // 单条查询
  queryCoupon(params) {
    return services.json(`${WpSchema}/business/send/coupon/detail`, params, {
      action: '查询优惠券',
    });
  },
  // 优惠券列表
  getCouponList(params) {
    return services.json(`${WpSchema}/coupons/list`, params, {
      action: '优惠券列表',
    });
  },

  // 明细
  // /wp/coupon-ticket/query-list
  getOneCouponDetail(params) {
    return services.json(`${WpSchema}/coupon-ticket/query-list`, params, {
      action: '优惠券明细',
    });
  },
  // 商户积分
  getStoreIntegralList(params) {
    return services.json(`${WpSchema}/store/score/record`, params, {
      action: '商户积分列表',
    });
  },
  // 商户汇总
  getStoreSummaryList(params) {
    return services.json(`${WpSchema}/store/score/getList`, params, {
      action: '商户汇总列表',
    });
  },
  // 导出
  exportlList: `${WpSchema}/store/score/export`,
  // 确认结算
  settlementStoreIntegral(params) {
    return services.json(`${WpSchema}/store/score/settlement`, params, {
      action: '确认结算',
    });
  },
};
