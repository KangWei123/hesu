/**
 * 会员类型
 */
export const MemberType = {
  // 普通会员
  Normal: 1,
  // 付费会员
  Paying: 2,
};

export const MemberTypeName = {
  [MemberType.Normal]: '普通会员',
  [MemberType.Paying]: '付费会员',
};

/**
 * 应用渠道类型
 */
export const ChannelType = {
  Wechat: 1,
  Import: 2,
  AdminCreate: 3,
  OpenAPIImport: 4,
  // ..
};

/**
 * 会员状态
 */
export const MemberStatus = {
  Active: 1, // 激活
  Freeze: 2, // 冻结
  // Active: 1,
  // Deleted: 2,
  // Freeze: 3,
};

export const MemberStatusName = {
  [MemberStatus.Active]: '激活',
  [MemberStatus.Deleted]: '删除',
  [MemberStatus.Freeze]: '冻结',
};

export const MemberStatusColor = {
  [MemberStatus.Active]: '#52C41A',
  [MemberStatus.Deleted]: '#f5222d',
  [MemberStatus.Freeze]: '#CCC',
};

/**
 * 地址类型
 */
export const AddressType = {
  // Default: 0, // 默认地址，
  Home: 1, // 家庭住址
  Office: 2, // 工作地址，
  Receive: 3, // 收货地址
};

export const AddressTypeName = {
  [AddressType.Default]: '默认地址',
  [AddressType.Home]: '家庭住址',
  [AddressType.Office]: '工作地址',
  [AddressType.Receive]: '收货地址',
};

/**
 * 生命周期判定方式
 */
export const LifeCycleDetectType = {
  Manual: 1, // 人工
  System: 2, // 系统
};

export const LifeCycleDetectTypeName = {
  [LifeCycleDetectType.Manual]: '人工判定', // 人工
  [LifeCycleDetectType.System]: '系统判定', // 系统
};

/**
 * 积分类型
 */
export const ScoreType = {
  /**
   * 发放
   */
  Give: 1,
  /**
   * 消耗
   */
  Consume: 2,
};

/**
 * 积分动作类型
 */
export const ScoreChangeType = {
  Inc: 1,
  Dec: 2,
  Overduce: 3,
};

/**
 * 积分动作类型描述
 */
export const ScoreChangeTypeInfo = {
  [ScoreChangeType.Inc]: ['+', 'green', '新增'],
  [ScoreChangeType.Dec]: ['-', 'red', '扣减'],
  [ScoreChangeType.Overduce]: ['-', 'orange', '过期'],
};

/**
 *  积分发放规则状态
 */
export const ScoreGiveStatus = {
  NOT_STARTED: 1,
  ON_GOING: 2,
  ENDED: 3,
};

/**
 * 积分发放规则状态描述
 */
export const ScoreGiveStatusDesc = {
  [ScoreGiveStatus.NOT_STARTED]: '未开始',
  [ScoreGiveStatus.ON_GOING]: '进行中',
  [ScoreGiveStatus.ENDED]: '已结束',
};
