export default {
  ORDER: {
    label: '订单列表',
    name: 'order',
    value: null,
    STATUS: {
      ALL: {
        label: '所有订单',
        name: 'all',
        value: null
      },
      WAIT_PAY: {
        label: '待付款',
        name: 'wait_pay',
        value: 10
      },
      WAIT_CHECK: {
        label: '待审核',
        name: 'wait_check',
        value: 92, // 待医院审核
        value2: 93 // 待人工审核
      },
      WAIT_SUBSCRIBED: {
        label: '待认筹',
        name: 'wait_subscribed',
        value: 10
      },

      PAID: {
        label: '已支付',
        name: 'paid',
        value: 20
      },
      WAIT_SHIP: {
        label: '待发货',
        name: 'wait_ship',
        value: 30
      },
      WAIT_OFF: {
        label: '待核销',
        name: 'wait_off',
        value: 38
      },
      WAIT_DELIVERED: {
        label: '待收货',
        name: 'wait_delivered',
        value: 40
      },
      SUCCESS: {
        label: '已完成',
        name: 'success',
        value: 60
      },
      REFUSE_REFUND: {
        label: '拒绝退款',
        name: 'REFUSE_REFUND',
        value: -30
      },

      CANCELED: {
        label: '已取消',
        name: 'canceled',
        value: -1
      },

      WAIT_DELIVERY_MAN: {
        label: '等待骑手接单',
        name: 'wait_delivery_man',
        value: 31
      },

      DELIVERING: {
        label: '骑手配送中',
        name: 'delivering',
        value: 41
      }
    }
  },

  // 退款列表
  REFUND: {
    label: '退款列表',
    name: 'refund',
    statusName: 'REQUEST_REFUND',
    value: [-10, -20, -30],
    STATUS: {
      REQUEST_REFUND: -1, // 申请退款
      AGREE_REFUND_REQUEST: -2, // 已同意申请
      REFUND_ITEM_SHIPPING: -3, // 退款商品已发货
      CONFIRM_REFUND_ITEM: -4, // 已确认退货
      CONFIRM_REFUND: -5, // 已确认退款
      REFUND_REJECT: -6, // 已拒绝退款
      REFUND: -10, // 退款中
      REFUND_SUCCESS: -20, //退款完成
      REFUND_FAILED: -30, // 退款失败
      REVERT_REFUND: -50 // 已撤销退款申请
    }
  },

  // 退款状态
  REFUNDLIST: {
    label: '退款状态',
    name: 'REQUEST_REFUND',
    STATUS: {
      REQUEST_REFUND: {
        label: '申请退款',
        name: 'REQUEST_REFUND',
        value: [-1]
      },
      REFUND: {
        label: '退款中',
        name: 'REFUND',
        value: [-2, -3, -4, -10]
      },
      REFUND_SUCCESS: {
        label: '退款完成',
        name: 'REFUND_SUCCESS',
        value: [-20]
      },
      REFUND_FAILED: {
        label: '退款失败',
        name: 'REFUND_FAILED',
        value: [-6, -30]
      }
    }
  },

  // 订单类型
  ORDER_TYPE: {
    PRE_SALE: {
      value: 0,
      label: '预售订单'
    },
    PRODUCT: {
      value: 1,
      label: '产品'
    },
    GROUP: {
      value: 2,
      label: '组合商品'
    },
    NUM_CARD: {
      value: 3,
      label: '次数卡'
    },
    CHARGE: {
      value: 4,
      label: '充值卡'
    },
    MANUAL_CHARGE: {
      value: 5,
      label: '手动充值'
    },
    GIFT_CARD: {
      value: 14,
      label: '礼品卡'
    },
    GIFT: {
      value: 24,
      label: '赠品'
    },
    CARD_PACK: {
      value: 35,
      label: '代金卡包'
    },
    CUSTOM_GOODS: {
      value: 36,
      label: '定制商品'
    }
  },

  MARKETING_ORDER: {
    GROUP: {
      value: 5,
      label: '拼团'
    },
    SECKILL: {
      value: 1,
      label: '秒杀'
    },
    HAGGLE: {
      value: 6,
      label: '砍价'
    },
    INTEGRAL: {
      value: 2,
      label: '积分兑换'
    },
    DISTRIBUTION: {
      value: 4,
      label: '内购订单'
    },
    // todo 待与后端协商
    XYFOLD: {
      value: 'second_half',
      type: 7,
      tag: 1,
      label: '第x件y折'
    },
    FULLXDISCOUNT: {
      value: 'fixed_price',
      type: 7,
      tag: 2,
      label: '满x件优惠'
    },
    ONEPRICE: {
      value: 'much_by_more_discount',
      type: 7,
      tag: 4,
      label: '一口价'
    }
  },

  // 退款类型
  refund_type: {
    refund_item_and_money: 1, // 退款退货
    refund_money: 2 // 仅退款
  },

  // 退款货物状态
  refund_goods_type: {
    have_goods: 1, // 已收到货
    no_goods: 0 // 未收到货
  },

  // 送货方式
  express_type: {
    express: 1, // 快递
    self_extraction: 0, // 自提
    city_delivery: 3 // 同城配送
  },

  //发货类型：物流、无需物流
  SHIPPING_TYPE: {
    THIRD_PARTY: 2,
    NO_NEED: 3
  },

  // 物流状态
  LOGISTICS: {
    label: '物流状态',
    name: 'logistics',
    STATUS: {
      TO_DELIVERY: 10, // 待发货
      SOME_DELIVERING: 30, // 部分发货
      DELIVERING: 40, // 已发货
      DELIVERED: 50, // 已收货
      DELIVERING_EXCEPTION: 60 // 发货异常
    }
  },

  // 客房状态
  HOTEL: {
    STATUS: {
      PAID: {
        label: '已支付',
        name: 'PAID',
        value: 20
      },
      CHECK_IN: {
        label: '酒店订单已入住',
        name: 'CHECK_IN',
        value: 35
      }
    }
  },

  MICRO_ORDER: {
    label: '订单列表',
    name: 'microOrder',
    value: null,
    STATUS: {
      WAIT_REVIEW: {
        label: '待审核',
        name: 'wait_review',
        value: 10
      },
      WAIT_ORDER: {
        label: '待下单',
        name: 'wait_order',
        value: 20
      },
      WAIT_PAY: {
        label: '待付款',
        name: 'wait_pay',
        value: 30
      },
      TRANSFER: {
        label: '调货中',
        name: 'transfer',
        value: 40
      },
      WAIT_DELIVERED: {
        label: '待收货',
        name: 'wait_delivered',
        value: 50
      },
      SUCCESS: {
        label: '已完成',
        name: 'success',
        value: 60
      },
      CANCELED: {
        label: '已取消',
        name: 'canceled',
        value: 0
      },
      ALL: {
        label: '所有订单',
        name: 'all',
        value: null
      }
    }
  }
};
