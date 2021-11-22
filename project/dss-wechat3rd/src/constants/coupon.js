// 优惠券种类
export const CouponKind = {
  /**
   * 平台券 0
   */
  PLATFORM: 0,
  /**
   * 店铺券 1
   */
  STORE: 1,
};

export const couponKindMap = {
  [CouponKind.PLATFORM]: '平台券',
  [CouponKind.STORE]: '店铺券',
};

export const couponKindList = [
  { value: CouponKind.PLATFORM, label: couponKindMap[CouponKind.PLATFORM] },
  { value: CouponKind.STORE, label: couponKindMap[CouponKind.STORE] },
];

// 优惠券类型
export const CouponType = {
  /**
   * 满减券 0
   */
  DEFAULT: 0,
  /**
   * 运费券 1
   */
  LOGISTICS_COUPON: 1,
  /**
   * 折扣券 2
   */
  DISCOUNT_COUPON: 2,
  /**
   * 礼品券 3
   */
  GIFT_COUPON: 3,
  /**
   * 停车券-金额 4
   */
  PARKING_AMOUNT_COUPON: 4,
  /**
   * 停车券-时长 5
   */
  PARKING_DURATION_COUPON: 5,
  /**
   * 停车券 自定义值，替代 4,5
   */
  PARKING_COUPON: 99,
};

export const couponTypeMap = {
  [CouponType.DEFAULT]: '满减券',
  [CouponType.LOGISTICS_COUPON]: '运费券',
  [CouponType.DISCOUNT_COUPON]: '折扣券',
  [CouponType.GIFT_COUPON]: '礼品券',
  [CouponType.PARKING_AMOUNT_COUPON]: '停车券',
  [CouponType.PARKING_DURATION_COUPON]: '停车券',
  [CouponType.PARKING_COUPON]: '停车券',
};

export const couponTypeList = [
  { value: CouponType.DEFAULT, label: couponTypeMap[CouponType.DEFAULT] },
  { value: CouponType.DISCOUNT_COUPON, label: couponTypeMap[CouponType.DISCOUNT_COUPON] },
  { value: CouponType.LOGISTICS_COUPON, label: couponTypeMap[CouponType.LOGISTICS_COUPON] },
  { value: CouponType.GIFT_COUPON, label: couponTypeMap[CouponType.GIFT_COUPON] },
  // { value: CouponType.PARKING_COUPON, label: couponTypeMap[CouponType.PARKING_DURATION_COUPON] },
];

// 优惠券状态+审批状态
export const CouponStatus = {
  /**
   * 无效 0
   */
  INVALID: 0,
  /**
   * 有效 1
   */
  VALID: 1,
  /**
   * 过期 2
   */
  EXPIRE: 2,
  /**
   * 发放完毕 3
   */
  FINISH: 3,
  /**
   * 待审核 4
   */
  WAIT_AUDIT: 4,
  /**
   * 审核失败 5
   */
  AUDIT_FAIL: 5,
  /**
   * 取消申请 6
   */
  CANCEL_AUDIT: 6,
};

export const couponStatusMap = {
  [CouponStatus.INVALID]: '无效',
  [CouponStatus.VALID]: '有效',
  [CouponStatus.EXPIRE]: '过期',
  [CouponStatus.FINISH]: '发放完毕',
  [CouponStatus.WAIT_AUDIT]: '待审核',
  [CouponStatus.AUDIT_FAIL]: '审核失败',
  [CouponStatus.CANCEL_AUDIT]: '取消申请',
};

export const couponStatusList = [
  { value: CouponStatus.INVALID, label: couponStatusMap[CouponStatus.INVALID] },
  { value: CouponStatus.VALID, label: couponStatusMap[CouponStatus.VALID] },
  { value: CouponStatus.EXPIRE, label: couponStatusMap[CouponStatus.EXPIRE] },
  { value: CouponStatus.FINISH, label: couponStatusMap[CouponStatus.FINISH] },
];

export const couponStatusListBbc = [
  { value: CouponStatus.INVALID, label: couponStatusMap[CouponStatus.INVALID] },
  { value: CouponStatus.VALID, label: couponStatusMap[CouponStatus.VALID] },
  { value: CouponStatus.EXPIRE, label: couponStatusMap[CouponStatus.EXPIRE] },
  { value: CouponStatus.FINISH, label: couponStatusMap[CouponStatus.FINISH] },
  { value: CouponStatus.WAIT_AUDIT, label: couponStatusMap[CouponStatus.WAIT_AUDIT] },
  { value: CouponStatus.AUDIT_FAIL, label: couponStatusMap[CouponStatus.AUDIT_FAIL] },
  { value: CouponStatus.CANCEL_AUDIT, label: couponStatusMap[CouponStatus.CANCEL_AUDIT] },
];

export const AuditStatus = {
  /**
   * 待审核 1
   */
  WAIT_AUDIT: 1,
  /**
   * 审核通过 2
   */
  AUDIT_SUCCESS: 2,
  /**
   * 审核失败 3
   */
  AUDIT_FAIL: 3,
  /**
   * 取消审核 4
   */
  CANCEL_AUDIT: 4,
};

/**
 * 审核状态
 */
export const couponAuditStatusMap = {
  [AuditStatus.WAIT_AUDIT]: '待审核',
  [AuditStatus.AUDIT_SUCCESS]: '审核通过',
  [AuditStatus.AUDIT_FAIL]: '审核失败',
  [AuditStatus.CANCEL_AUDIT]: '取消申请',
};

export const couponAuditStatusList = [
  { value: AuditStatus.WAIT_AUDIT, label: couponAuditStatusMap[AuditStatus.WAIT_AUDIT] },
  { value: AuditStatus.AUDIT_SUCCESS, label: couponAuditStatusMap[AuditStatus.AUDIT_SUCCESS] },
  { value: AuditStatus.AUDIT_FAIL, label: couponAuditStatusMap[AuditStatus.AUDIT_FAIL] },
  { value: AuditStatus.CANCEL_AUDIT, label: couponAuditStatusMap[AuditStatus.CANCEL_AUDIT] },
];

// 发放渠道
export const ProvideChannel = {
  /**
   * 营销专用 0
   */
  MARKETING_CENTER: 0,
  /**
   * 领券中心 1
   */
  COUPON_CENTER: 1,
  /**
   * 导购专用 2
   */
  GUIDE_USE: 2,
};

export const provideChannelMap = {
  [ProvideChannel.MARKETING_CENTER]: '营销专用',
  [ProvideChannel.COUPON_CENTER]: '领券中心',
  [ProvideChannel.GUIDE_USE]: '导购专用',
};

export const provideChannelList = [
  { value: ProvideChannel.COUPON_CENTER, label: provideChannelMap[ProvideChannel.COUPON_CENTER] },
  { value: ProvideChannel.MARKETING_CENTER, label: provideChannelMap[ProvideChannel.MARKETING_CENTER] },
  // { value: ProvideChannel.GUIDE_USE, label: provideChannelMap[ProvideChannel.GUIDE_USE] },
];

// 使用范围
export const UseScope = {
  /**
   * 通用券 0
   */
  COMMON: 0,
  /**
   * 线上商城 1
   */
  ONLINE: 1,
  /**
   * 线下门店 2
   */
  OFFLINE: 2,
};

export const couponUseScopeTypeMap = {
  [UseScope.COMMON]: '通用券',
  [UseScope.ONLINE]: '线上商城',
  [UseScope.OFFLINE]: '线下门店',
};

export const couponUseScopeTypeList = [
  { value: UseScope.COMMON, label: couponUseScopeTypeMap[UseScope.COMMON] },
  { value: UseScope.ONLINE, label: couponUseScopeTypeMap[UseScope.ONLINE] },
  { value: UseScope.OFFLINE, label: couponUseScopeTypeMap[UseScope.OFFLINE] },
];

/**
 * 核销来源
 */
export const VerificationSource = {
  /**
   * 管理后台 0
   */
  BACKSTAGE: 0,
  /**
   *  线上商城 1
   */
  ONLINE_MALL: 1,
  /**
   *  核销小程序 2
   */
  WRITE_OFF_APPLET: 2,
};

export const verificationSourceMap = {
  [VerificationSource.BACKSTAGE]: '管理后台',
  [VerificationSource.ONLINE_MALL]: '线上商城',
  [VerificationSource.WRITE_OFF_APPLET]: '核销小程序',
};

export const verificationSourceList = [
  { value: VerificationSource.BACKSTAGE, label: verificationSourceMap[VerificationSource.BACKSTAGE] },
  { value: VerificationSource.ONLINE_MALL, label: verificationSourceMap[VerificationSource.ONLINE_MALL] },
  { value: VerificationSource.WRITE_OFF_APPLET, label: verificationSourceMap[VerificationSource.WRITE_OFF_APPLET] },
];

/**
 * 优惠券有效期类型
 */
export const CouponValidDate = {
  /**
   * 具体天数 0
   */
  DEFAULT: 0,
  /**
   * 时间范围 1
   */
  CUSTOM: 1,
};

export const couponValidDateMap = {
  [CouponValidDate.DEFAULT]: '领取后N天内有效',
  [CouponValidDate.CUSTOM]: '时间段',
};

export const couponValidDateList = [
  { value: CouponValidDate.DEFAULT, label: couponValidDateMap[CouponValidDate.DEFAULT] },
  { value: CouponValidDate.CUSTOM, label: couponValidDateMap[CouponValidDate.CUSTOM] },
];

/**
 * 领取条件
 */
export const ReceiveType = {
  NEWUSER: 0, // 新人
  LEVEL: 1, // 会员等级
  ALL: 2,
};

export const receiveTypeMap = {
  [ReceiveType.ALL]: '全部',
  [ReceiveType.NEWUSER]: '新人(首次下单)',
  [ReceiveType.LEVEL]: '选定会员等级',
};

export const receiveTypeList = [
  { value: ReceiveType.ALL, label: receiveTypeMap[ReceiveType.ALL] },
  { value: ReceiveType.NEWUSER, label: receiveTypeMap[ReceiveType.NEWUSER] },
  { value: ReceiveType.LEVEL, label: receiveTypeMap[ReceiveType.LEVEL] },
];

/**
 * 适用范围
 */
export const SuitItemType = {
  /**
   * 全部 0
   */
  ALL: 0,
  /**
   * 指定商品 1
   */
  CUSTOM: 1,
  /**
   * 指定分类 2
   */
  CATEGORY: 2,
  /**
   * 指定店铺 3
   */
  STORE: 3,
};

export const suitItemTypeMap = {
  [SuitItemType.ALL]: '所有商品',
  [SuitItemType.CUSTOM]: '指定商品',
  [SuitItemType.CATEGORY]: '指定分类',
  [SuitItemType.STORE]: '指定店铺',
};

export const suitItemTypeButtonMap = {
  [SuitItemType.CUSTOM]: '选择商品',
  [SuitItemType.CATEGORY]: '选择分类',
  [SuitItemType.STORE]: '选择店铺',
};

export const suitItemTypeList = [
  { value: SuitItemType.ALL, label: suitItemTypeMap[SuitItemType.ALL] },
  { value: SuitItemType.CUSTOM, label: suitItemTypeMap[SuitItemType.CUSTOM] },
  { value: SuitItemType.CATEGORY, label: suitItemTypeMap[SuitItemType.CATEGORY] },
];

export const suitItemTypeListBbc = [
  { value: SuitItemType.ALL, label: suitItemTypeMap[SuitItemType.ALL] },
  { value: SuitItemType.CUSTOM, label: suitItemTypeMap[SuitItemType.CUSTOM] },
  { value: SuitItemType.CATEGORY, label: suitItemTypeMap[SuitItemType.CATEGORY] },
  { value: SuitItemType.STORE, label: suitItemTypeMap[SuitItemType.STORE] },
];

export const suitItemTypeMapByShort = {
  [SuitItemType.ALL]: '全部',
  [SuitItemType.STORE]: '指定项目',
};

export const suitSubStoreTypeEnum = {
  ALL: 0, // '全部',
  SUBSTORE: 1, // '指定子项目',
};

export const suitItemTypeButtonMapByShort = {
  [SuitItemType.STORE]: '选择项目',
};

export const suitItemTypeListByShort = [
  { value: SuitItemType.ALL, label: suitItemTypeMapByShort[SuitItemType.ALL] },
  { value: SuitItemType.STORE, label: suitItemTypeMapByShort[SuitItemType.STORE] },
];

/**
 * 优惠券用户使用状态
 */
export const CouponUseStatus = {
  /**
   * 无效/删除 0
   */
  INVALID: 0,
  /**
   * 有效 1
   */
  VALID: 1,
  /**
   * 已经使用 2
   */
  COMPLETE: 2,
  /**
   * 已过期 3
   */
  EXPIRE: 3,
  /**
   * 使用中 4
   */
  INUSE: 4,
  /**
   * 未开始 5
   */
  NOT_BEGIN: 5,
  /**
   * 撤销核销 6
   */
  REVOKE: 6,
};

export const couponUseStatusMap = {
  [CouponUseStatus.INVALID]: '已删除',
  [CouponUseStatus.VALID]: '已领取',
  [CouponUseStatus.COMPLETE]: '已核销',
  [CouponUseStatus.EXPIRE]: '已过期',
  [CouponUseStatus.INUSE]: '已冻结',
  [CouponUseStatus.NOT_BEGIN]: '未开始',
  [CouponUseStatus.REVOKE]: '撤销核销',
};

export const couponUseStatusList = [
  { value: CouponUseStatus.INVALID, label: couponUseStatusMap[CouponUseStatus.INVALID] },
  { value: CouponUseStatus.VALID, label: couponUseStatusMap[CouponUseStatus.VALID] },
  { value: CouponUseStatus.COMPLETE, label: couponUseStatusMap[CouponUseStatus.COMPLETE] },
  { value: CouponUseStatus.EXPIRE, label: couponUseStatusMap[CouponUseStatus.EXPIRE] },
  { value: CouponUseStatus.INUSE, label: couponUseStatusMap[CouponUseStatus.INUSE] },
];

export const voucherCouponStatus = {
  notEnabled: 0, // 未启用
  Enabled: 1, // 已启用
};

export const voucherCouponStatusMap = {
  [voucherCouponStatus.notEnabled]: '未启用',
  [voucherCouponStatus.Enabled]: '已启用',
};

export const voucherCouponStatusList = [
  { value: voucherCouponStatus.notEnabled, label: voucherCouponStatusMap[voucherCouponStatus.notEnabled] },
  { value: voucherCouponStatus.Enabled, label: voucherCouponStatusMap[voucherCouponStatus.Enabled] },
];
