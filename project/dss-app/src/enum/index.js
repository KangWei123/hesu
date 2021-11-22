/**
 * 应用状态
 */
export const AppStatus = {
  VALID: 1, // 有效,
  NORMAL_EXPIRED: 2, // 套餐过期
  TRY_EXPIRED: 3, // 试用过期
  TRY: 4, // 试用中
  DELETED: -1, // 已删除
  NOT_INIT: 5, // 未初始化应用账号
};

/**
 * 应用描述
 */
export const AppStatusDesc = {
  [AppStatus.VALID]: '有效',
  [AppStatus.NORMAL_EXPIRED]: '套餐过期',
  [AppStatus.TRY_EXPIRED]: '试用过期',
  [AppStatus.TRY]: '试用中',
  [AppStatus.DELETED]: '已删除',
  [AppStatus.NOT_INIT]: '未初始化', // 未初始化应用账号
};
