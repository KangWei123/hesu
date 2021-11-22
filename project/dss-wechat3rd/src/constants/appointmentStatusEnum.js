export default {
  STATUS: {
    ALL: {
      label: '所有订单',
      name: 'all',
      value: null
    },
    PAID: {
      label: '已支付',
      name: 'PAID',
      value: 20
    },
    CHECK_IN: {
      label: '已入住',
      name: 'CHECK_IN',
      value: 35
    },
    BEING_USED: {
      label: '使用中',
      name: 'BEING_USED',
      value: 37
    },
    COMPLETE: {
      label: '已完成',
      name: 'COMPLETE',
      value: 60
    },
    CANCEL: {
      label: '已取消',
      name: 'CANCEL',
      value: -1
    },
    WAIT_PAY: {
      label: '待支付',
      name: 'WAIT_PAY',
      value: 10
    },
    WAIT: {
      label: '待服务',
      name: 'WAIT',
      value: 70
    },
    TIMEOUT: {
      label: '已超时',
      name: 'TIMEOUT',
      value: 80
    },
    REFUNDING: {
      label: '退款中',
      name: 'REFUNDING',
      value: -1
    },
    REFUND_COMPETE: {
      label: '退款完成',
      name: 'REFUND_COMPETE',
      value: -20
    },
    REFUND_REFUSE: {
      label: '拒绝退款',
      name: 'REFUND_REFUSE',
      value: -30
    }
  }
};
