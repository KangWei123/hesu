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
  Authed: 2, // 已认证
};

export const AuthTypeName = {
  [AuthType.UnAuth]: '未认证',
  [AuthType.Authed]: '已认证',
};

export const AuthTypes = [
  {
    label: AuthTypeName[AuthType.UnAuth],
    value: AuthType.UnAuth,
  },
  {
    label: AuthTypeName[AuthType.Authed],
    value: AuthType.Authed,
  },
];

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

export const ImportStatus = {
  OK_IMPORT: 200,
  PENDING: 300,
  SYS_ERROR: 500,
};

export const CheckInState = {
  CHECK_IN: 1,
  NOT_CHECK_IN: 2,
};

export const CheckInStateNameMapping = {
  [CheckInState.CHECK_IN]: '已入住',
  [CheckInState.NOT_CHECK_IN]: '未入住',
};

export const CheckInStates = [
  {
    label: '已入住',
    value: CheckInState.CHECK_IN,
  },
  {
    label: '未入住',
    value: CheckInState.NOT_CHECK_IN,
  },
];
