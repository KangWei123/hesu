/**
 * 类型
 */
export const Type = {
  All: null, // 全部
  In: 0, // 内部
  Out: 1, // 外部
};

export const typeName = {
  [Type.All]: '全部', // 全部
  [Type.In]: '内部人员', // 人工
  [Type.Out]: '外部人员', // 系统
};

export const typeOptions = [
  { key: Type.All, label: typeName[Type.All] },
  { key: Type.In, label: typeName[Type.In] },
  { key: Type.Out, label: typeName[Type.Out] },
];

export const SEX = {
  Female: 1, // 女
  Male: 2, // 男
};

export const SEX_NAME = {
  [SEX.Female]: '女',
  [SEX.Male]: '男',
};

export const SEX_OPTIONS = [
  { key: SEX.Male, label: '男' },
  { key: SEX.Female, label: '女' },
];

export const adjustType = {
  infinite: '1', // 无上限
  unInfinite: '2', // 上限
};
