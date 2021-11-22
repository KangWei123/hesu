export default {
  //红包分配方式
  type: {
    //平均
    AVERAGE: 0,
    //随机
    RANDOM: 1
  },
  //红包门槛
  thresholdFee: {
    //无门槛
    NOTHRESHOLD: 0
  },
  //红包状态
  status: {
    //进行中
    UNDERWAY: 0,
    //已完成
    SUCCESS: 1,
    //失败
    FAILED: 2,
    //已结束
    END: 3
  },
  expireType: {
    // 固定时间段
    DATERANGE: 0,
    // 当日
    DAY: 1,
    // 次日
    NEXTDAY: 2
  },
  redpacketStyle: {
    // 默认背景
    default: 0,
    // 自定义背景
    custom: 1
  },
  cashWithdrawalType: {
    //不可提现
    UN_ABLE: 0,
    //开放提现
    ABLE: 1
  }
};
