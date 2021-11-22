/**
 * 康养跨模块常量
 */
export const FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const FORMAT_4_ELM = 'yyyy-MM-dd hh:mm:ss';
export const DATE_FORMAT_4_ELM = 'yyyy-MM-dd';
export const FORMAT4ELM_MINUTES = 'yyyy-MM-dd HH:mm';
export const FORMAT4ELM_24HOURS = 'yyyy-MM-dd HH:mm:ss';

/**
 * 活动状态
 */
export const ActivityStatus = {
  Pending: 10, // 未进行
  Doing: 20, // 进行中
  Ended: 30, // 已结束
};

export const ActivityStatusName = {
  [ActivityStatus.Pending]: '未开始', // 未进行
  [ActivityStatus.Doing]: '进行中', // 进行中
  [ActivityStatus.Ended]: '已结束', // 已结束
};

/**
 * 上下架状态
 */
export const ShelfStatus = {
  On: 1,
  Off: 2,
};

export const ShelfStatusName = {
  [ShelfStatus.On]: '上架',
  [ShelfStatus.Off]: '下架',
};

/**
 * 签到状态
 */
export const SignStatus = {
  Cancelled: 0, // 已取消
  Payed: 10, // 已支付
  Verified: 20, // 已验证
};

export const WEEKS = ['一', '二', '三', '四', '五', '六', '日'];

export const ALL_APPOINTMENT_STATUS = [
  {
    value: '',
    label: '全部',
  },
  {
    value: 1,
    label: '已预约',
    color: '#274fe8',
  },
  {
    value: 3,
    label: '已完成',
    color: '#303133',
  },
  {
    value: 2,
    label: '已取消',
    color: '#ff8400',
  },
  {
    value: 0,
    label: '已过期',
    color: '#ff8400',
  },
];

export const PROJECT_STORAGE_KEY = 'ky_selected_projectId';
