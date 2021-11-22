export const STATUS = {
  // 全部
  ALL: 0,
  // 未回复
  NOREPLY: 1,
  // 已回复
  REPLIED: 2,
};

export const STATUS_NAME = {
  [STATUS.ALL]: '全部',
  [STATUS.NOREPLY]: '未回复',
  [STATUS.REPLIED]: '已回复',
};

export const STATUS_OPTIONS = [
  { key: STATUS.ALL, label: '全部' },
  { key: STATUS.NOREPLY, label: '未回复' },
  { key: STATUS.REPLIED, label: '已回复' },
];
