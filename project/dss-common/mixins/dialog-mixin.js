/**
 * dialog mixins
 * 添加一个变量，控制展示和显示dialog
 * 使用方式可参考dss-wechat3rd/src/views/order/preview-order-dialog
 */
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      mShowDialog: false,
    };
  },
  watch: {
    value(newVal, oldVal) {
      this.mShowDialog = newVal;
    },
    mShowDialog(newVal, oldVal) {
      this.$emit('input', newVal);
    },
  },
  created() {
    this.mShowDialog = false;
  },
};
