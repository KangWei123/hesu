export const UserType = {
  NormalCustomer: 0, // 普通会员
  Dependent: 1, // 家属
  Elder: 2, // 长者
};

export const UserTypeName = {
  [UserType.NormalCustomer]: '普通客户',
  [UserType.Elder]: '长者',
  [UserType.Dependent]: '家属',
};

/**
 * 认证状态
 */
export const AuthType = {
  Unregister: 0, // 未注册
  UnAuth: 1, // 未认证
  Authed: 2, // 已认证 0未注册1未认证2已认证
};

export const AuthTypeName = {
  [AuthType.Unregister]: '未注册',
  [AuthType.UnAuth]: '未认证',
  [AuthType.Authed]: '已认证',
};

export const Sex = {
  Unknow: 0,
  Male: 1, // 男
  FeMale: 2,
};

export const SexName = {
  [Sex.Unknow]: '未知',
  [Sex.Male]: '男',
  [Sex.FeMale]: '女',
};

export const UserTypeList = [
  {
    label: UserTypeName[UserType.Elder],
    value: UserType.Elder,
  },
  {
    label: UserTypeName[UserType.Dependent],
    value: UserType.Dependent,
  },
  {
    label: '全部身份',
    value: null,
  },
];

export const AuthTypeList = [
  {
    label: '已认证',
    value: AuthType.Authed,
  },
  {
    label: '未认证',
    value: AuthType.UnAuth,
  },
  {
    label: '未注册',
    value: AuthType.Unregister,
  },
  {
    label: '全部',
    value: null,
  },
];
