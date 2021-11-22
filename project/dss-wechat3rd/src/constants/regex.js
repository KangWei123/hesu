import utils from '@/dss-common/utils';

const cPrice = (msg, value, required) => {
  const budgetReg = /^\d{1,7}(\.\d{1,2})?$/; // 大于0的浮点数

  if (!required && !value) {
    return null;
  }
  if (value === '' || value == null) {
    return new Error(msg);
  } else if (utils.isNumber(value) && Number(value) >= 0) {
    return null;
  } else if (isNaN(value)) {
    // 数字最后一位加'.'也认为是数字，剔除这个情况
    return new Error('请输入数字');
  } else if (!budgetReg.test(value)) {
    return new Error('价格必须是0至9999999.99之间的数字且小数点后保留两位');
  } else {
    return null;
  }
};

function checkPrice(msg, required = false) {
  return (rule, value, callback) => {
    const priceError = cPrice(msg, value, required);
    if (priceError) {
      return callback(priceError);
    }
    return callback();
  };
}

export default {
  price: {
    reg: /^\d{1,7}(\.\d{1,2})?$/,
    msg: '请输入0至9999999.99之间的数字且小数点后保留两位',
  },
  couponPrice: {
    reg: /^\d{1,5}(\.\d{1,2})?$/,
    msg: '请输入0至99999.99之间的数字且小数点后保留两位',
  },
  discountPrice: {
    reg: /^\d{0,1}(\.\d{0,1})?$/,
    msg: '请输入0.1至9.9之间的数字且小数点后保留两位',
  },
  chargePrice: {
    reg: /^\d{1,4}(\.\d{1,2})?$/,
    msg: '请输入0至9999.99之间的数字且小数点后保留两位',
  },
  quantity: {
    reg: /^([0-9]\d{0,4})$/,
    msg: '请输入0到99999之间的正整数',
  },
  integral: {
    reg: /^([1-9]\d{0,4})$/,
    msg: '请输入1到99999之间的正整数',
  },
  littleIntNum: {
    reg: /^[1-9][0-9]{0,2}$/,
    msg: '数值范围在1~999的整数',
  },
  /**
   * usage:
   * import regex from '@/dss-wechat3rd/src/constants/regex'
   * {
   *  required: true,
   *  validator: regex.checkPrice('请输入售价),
   *  trigger: 'blur'
   * }
   * @param hint
   * @returns {function(*, *=, *)}
   */
  checkPrice: checkPrice,

  cPrice,

  goods: {
    checkSalePrice: checkPrice('请输入售价', true),

    checkLabelPrice: checkPrice('请输入标价', false),

    checkFrontMoney: checkPrice('请输入定金', true),

    checkCostPrice: checkPrice('请输入成本价', false),

    checkFreight: checkPrice('请输入运费', true),

    checkChargeAmount: checkPrice('请输入充值金额', true),

    checkGiftAmount: checkPrice('请输入赠送金额'),

    checkGoodsMaterialsId: (rule, value, callback) => {
      if (!value || (value.length == 1 && !value[0].id)) {
        return callback(new Error('请至少添加一张商品图片'));
      }
      return callback();
    },

    checkWeight(rule, value, callback) {
      if (!!value && !/^([1-9]\d{0,4})$/.test(value)) {
        return callback(new Error('请输入1到99999之间的正整数'));
      }
      return callback();
    },
    checkShelfLife(rule, value, callback) {
      if (!!value && !/^([1-9]\d{0,3})$/.test(value)) {
        return callback(new Error('请输入一个小于5位数的正整数'));
      }
      return callback();
    },

    checkSkuTree: (rule, value, callback) => {
      if (value && value.length) {
        value.forEach((skuTree, index) => {
          if (!(skuTree.treeValList && skuTree.treeValList.length)) {
            return callback(new Error('请为规格选择一个规格值'));
          } else if (index === 0 && skuTree.showImage) {
            skuTree.treeValList.forEach(treeVal => {
              if (!treeVal.imageId) {
                return callback(new Error('请为首规格规格添加图片'));
              }
            });
          }
        });
        return callback();
      } else {
        return callback();
      }
    },

    checkSkuInfo: (rule, value, callback) => {
      if (value && value.length) {
        value.forEach((skuInfo, index) => {
          // debugger;
          const salePriceError = cPrice('请输入售价', skuInfo.salePrice, true);
          if (salePriceError) {
            return callback(salePriceError);
          }
          const labelPriceError = cPrice('请输入标价', skuInfo.labelPrice, true);
          if (labelPriceError) {
            return callback(labelPriceError);
          }

          const frontMoneyError = cPrice('请输入定金', skuInfo.frontMoney, true);
          if (frontMoneyError) {
            return callback(frontMoneyError);
          }

          if (+skuInfo.salePrice > +skuInfo.labelPrice) {
            return callback(new Error('商品售价不能大于商品标价'));
          }
        });
        return callback();
      } else {
        return callback();
      }
    },

    itemCardServerList: (rule, value, callback) => {
      if (value && value.length) {
        value.forEach(server => {
          if (!server.serverCount) {
            return callback(new Error('请输入服务次数'));
          } else if (!/^[+]{0,1}(\d+)$/.test(server.serverCount)) {
            return callback(new Error('请输入正整数'));
          }
        });
        return callback();
      } else {
        return callback(new Error('请选择次卡支持的服务'));
      }
    },

    paramSetting: (rule, value, callback) => {
      if (value && value.length) {
        value.forEach(item => {
          if (!item.content) {
            return callback(new Error('请输参数内容'));
          }
        });
        return callback();
      } else {
        return callback();
      }
    },

    commonQa: (rule, value, callback) => {
      if (value && value.length) {
        value.forEach(item => {
          if (!item.q || !item.a) {
            return callback(new Error('请输问答内容'));
          }
        });
        return callback();
      } else {
        return callback();
      }
    },
  },
};
