/**
 * 活动状态
 */
export const ActivityStatus = {
  Pending: 10,
  Doing: 20,
  Ended: 30,
};
export const ActivityStatusName = {
  [ActivityStatus.Pending]: '未开始',
  [ActivityStatus.Doing]: '进行中',
  [ActivityStatus.Ended]: '已结束',
};

/**
 * 项目上下架状态
 */
export const ProjectStateType = {
  ON: 1,
  OFF: 2,
};
export const ProjectStateTypeName = {
  [ProjectStateType.ON]: '上架',
  [ProjectStateType.OFF]: '下架',
};

export default {
  ProjectStateType,
  ProjectStateTypeName,
  ActivityStatus,
  ActivityStatusName,
};
