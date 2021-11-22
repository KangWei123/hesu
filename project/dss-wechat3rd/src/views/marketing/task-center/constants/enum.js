// import { isThisISOWeek } from 'date-fns';

/**
 * 拼团活动状态
 */
const groupActivityStatus = {
  DELETED: -2, // 已删除
  INIT: -1, // 初始化
  SHELF: 1, // 上架
  NOT_SHELF: 0 // 下架
};

/**
 * 拼团进度状态
 */
const groupStatus = {
  ON_PROGRESS: -1, // 拼团中，
  SUCCESS: 1, // 拼团成功
  FAILED: 0, // 拼团失败
  REFUNDING: -2, // 退款中
  REFUND_COMPLETED: -3, // 退款成功
  isFailed(status) {
    return this.FAILED === status || this.REFUND_COMPLETED === status || this.REFUNDING === status;
  }
};

/**
 * 砍价活动状态
 */
const cutpriceActivityStatus = {
  DELETED: -1, // 已删除
  NOT_STARTED: 0, // 未开始
  ON_GOING: 1, // 进行中
  ENDED: 2 // 已结束
};

/**
 * 砍价进度状态
 */
const cutpriceStatus = {
  TIME_OUT: 0, // 已超时
  ON_GOING: 1, // 砍价中
  DONE: 2, // 已砍到底价
  PAID: 3, // 已支付
  NOT_PAY: 4, // 待支付
  REFUNDING: -2, // 退款中
  REFUND_COMPLETED: -3, // 退款完成
  isSuccess(status) {
    const isSuccess =
      status === this.DONE || status === this.PAID || status === this.REFUNDING || status === this.REFUND_COMPLETED;
    return isSuccess;
  }
};

/**
 * 礼品卡状态
 */
const giftCardStatus = {
  SELF_ACTIVATION: 1,
  GIFT_INACTIVATION: 2,
  GIFT_ACTIVATION: 3,
  INACTIVATION: 4,
  getArray() {
    if (!this.array) {
      this.array = [
        {
          value: this.SELF_ACTIVATION,
          label: '自用已激活'
        },
        {
          value: this.GIFT_INACTIVATION,
          label: '赠送未激活'
        },
        {
          value: this.GIFT_ACTIVATION,
          label: '赠送已激活'
        },
        {
          value: this.INACTIVATION,
          label: '未激活'
        }
      ];
    }
    return this.array;
  },
  getLabel(key) {
    const finded = this.getArray().find(item => item.value === 'key');
    if (finded) {
      return finded.label;
    }
    return;
  }
};

/**
 * 秒杀活动状态
 */
const seckillActivityStatus = {
  NOT_STARTED: 0, // 未开始
  ON_GOING: 1, // 进行中
  ENDED: 2, // 已结束
  DELETED: -1 // 已删除
};

const integralActivityStatus = {
  UNOPEN: 0, //未开始
  GOING: 1, //进行中
  END: 2, //已结束,
  DELETE: 3 //已删除
};
const filter = {
  price(value, scale = 100) {
    return value ? (value / scale).toFixed(2) : '0.00';
  }
};

export {
  groupActivityStatus,
  groupStatus,
  cutpriceActivityStatus,
  cutpriceStatus,
  giftCardStatus,
  seckillActivityStatus,
  integralActivityStatus,
  filter
};
