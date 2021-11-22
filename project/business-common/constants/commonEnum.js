export const SEX = {
  Female: 2, // 女
  Male: 1, // 男
  Unknown: 0, // 未知
};

export const SEX_NAME = {
  [SEX.Female]: '女',
  [SEX.Male]: '男',
  [SEX.Unknown]: '未知',
};

export const SEX_OPTIONS = [
  { key: SEX.Male, label: '男' },
  { key: SEX.Female, label: '女' },
  { key: SEX.Unknown, label: '未知' },
];
