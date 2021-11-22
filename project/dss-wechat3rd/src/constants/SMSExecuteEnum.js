export default {
  status: {
    WAIT: {
      label: '立刻群发',
      value: 0
    },
    EXECUTING: {
      label: '发送中',
      value: 1
    },
    FINISH: {
      label: '发送完成',
      value: 2
    },
    FAILED: {
      label: '发送失败',
      value: 3
    }
  },

  sendType: {
    IMMEDIATE: 0,
    SCHEDULED: 1
  }
};
