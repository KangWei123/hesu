export default {
  inboundType: {
    PURCHASE: {
      value: 10,
      label: '采购入库'
    },
    RELOCATE_IN: {
      value: 11,
      label: '调拨入库'
    },
    REFUND: {
      value: 12,
      label: '退货入库'
    },
    OTHER_IN: {
      value: 13,
      label: '其他入库'
    },
    REVIEW_IN: {
      value: 14,
      label: '盘点入库'
    }
  },
  outboundType: {
    SALE: {
      value: 20,
      label: '销售出库'
    },
    RELOCATE_OUT: {
      value: 21,
      label: '调拨出库'
    },
    DAMAGE: {
      value: 22,
      label: '损坏出库'
    },
    OTHER_OUT: {
      value: 23,
      label: '其他出库'
    },
    REVIEW_OUT: {
      value: 24,
      label: '盘点出库'
    }
  },
  boundStatus: {
    PENDING: {
      value: 1,
      label: '待审批'
    },
    PART: {
      value: 4,
      label: '部分入库'
    },
    THROUGH: {
      value: 20,
      label: '审核通过'
    },
    REFUSE: {
      value: 21,
      label: '拒绝'
    },
    FAILURE: {
      value: 22,
      label: '审核失败'
    },
    FINISHED: {
      value: 3,
      label: '出入库完成'
    },
    DELETED: {
      value: 0,
      label: '已删除'
    },
    CANCEL: {
      value: 5,
      label: '用户申请取消'
    },
    REFUND_ALL: {
      value: 7,
      label: '全部退款'
    }
  }
};
