export default {
  naturalNumber: {
    reg: /^(0|[1-9][0-9]*)$/,
    msg: '请输入大于等于0的整数',
  },
  positiveInteger: {
    reg: /^[1-9]+\d*$/,
    msg: '请输入大于0的整数',
  },

  positiveNumber: {
    reg: /^[0-9]{0,1}(\.[0-9]{0,1})?$/,
    msg: '请输入0到9.9之间的数字',
  },

  positiveTwoNumber: {
    reg: /^[0-9]{0,2}(\.[0-9]{0,1})?$/,
    msg: '请输入0到99.9之间的数字,保留一位小数',
  },

  littleeTwoIntNum: {
    reg: /^[1-9][0-9]{0,1}$/,
    msg: '数值范围在1~99的整数',
  },

  littleeIntZeroNum: {
    reg: /^[0-9][0-9]{0,6}$/,
    msg: '数值范围在0~9999999的整数',
  },

  littleeIntNum: {
    reg: /^[1-9][0-9]{0,6}$/,
    msg: '数值范围在1~9999999的整数',
  },

  phone: {
    // reg: /^1[3|4|5|6|8|7][0-9]\d{8}$/,
    reg: /^1[3456789]\d{9}$/,
    msg: '无效的手机号码',
  },
  tel: {
    reg: /^((\d{3,4})-)(\d{7,8})$|^1[3|4|5|6|8|7][0-9]\d{8}$/,
    msg: '无效的电话，例子：区号-电话号码，或手机号码',
  },
  servicePhone: {
    reg: /^(((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[013,5-8]|18[0-9]|19[0-9])[0-9]{8})|([0-9]{3,4}-[0-9]{7,8})$)|(^400-[016789]\d{2}-\d{4}$)|(^400[016789]\d{6})$/,
    msg: '无效的客服电话，例子：区号-电话号码，手机号码，或400客服热线',
  },
  email: {
    reg: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    msg: '邮箱格式不正确。例子：xxxxx@xxx.xxx',
  },
  url: {
    reg: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    msg: 'Url无效，例子：www.xxxxxx.com',
  },
  // 密码强度正则
  password: {
    // 解析(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$) 包含数字，出现字母或特殊字符
    // {6,16} 6到10个字符
    // (^\S*$) 不包含空格
    reg: /^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S{6,16}$/,
    msg: '6~16字符，包含字母、数字、符号中至少2种，不能有空格',
  },
  name: {
    reg: /^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i,
    msg: '字母、数字、汉字、-、或 _ 组成',
  },
  simpleName: {
    reg: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
    msg: '字母、数字或汉字 组成',
  },
  charAndNum: {
    reg: /^[0-9A-Za-z]+$/i,
    msg: '字母、数字组成',
  },
  // 账号验证
  account: {
    reg: /^[_\-a-zA-Z0-9\u4e00-\u9fa5]{4,16}$/i,
    msg: '4~16字符，字母、数字、汉字、-、或 _ 组成',
  },
  // 后端id数字
  idNo: {
    reg: /^\d{1,20}$/g,
    msg: '不超过20位的数字',
  },
  smsCode: {
    reg: /^\d{4,6}$/g,
    msg: '验证码格式不正确，请输入数字（4~6字符）',
  },
  //
  intWithTwo: {
    reg: /^([2-9]|[1-9][0-9]\d{0,1})$/,
    msg: '请输入2到999的正整数',
  },
  // 包含0的整数
  intWithZero: {
    reg: /(^[1-9]\d{0,6}$)|(^0$)/,
    msg: '请输入0~9999999之间的数字',
  },
  // 正整数输入位数在1到7个字符包含0
  positiveInt: {
    reg: /^[1-9]\d{0,6}$/, // /^[1-9]\d{0,7}$/不包含0
    msg: '请输入1~9999999之间的数字，并且开头不能为零',
  },
  money: {
    reg: /^[0-9]{1,5}(\.[0-9]{1,2})?$/,
    msg: '请输入范围在0~99999.99的数字,只能保留小数点两位',
  },
  fax: {
    reg: /^(\d{3,4}-)?\d{7,8}$/,
    msg: '传真格式不正确',
  },
  qq: {
    reg: /^[1-9][0-9]{4,9}$/,
    msg: 'QQ号格式不正确',
  },
  wxChat: {
    reg: /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})$/,
    msg: '微信号格式不正确',
  },
  littleNum: {
    reg: /^[0-9]{1,3}(\.[0-9]{1,2})?$/,
    msg: '数值范围在0~999.99的数字，保留两位小数',
  },
  littleIntNum: {
    reg: /^[1-9][0-9]{0,2}$/,
    msg: '数值范围在1~999的整数',
  },
  limitNumberInput(input) {
    if (input) {
      return input.replace(/[^\d]/g, '');
    }
    return '';
  },
};
