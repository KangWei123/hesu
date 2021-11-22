export default {
  data() {
    return {
      tagInput: {
        show: false,
        val: '',
      },
    };
  },
  methods: {
    // 删除标签
    handleClose(tag) {
      // 新建时候不需要接口判断
      this.form.businessLabel.splice(this.form.businessLabel.indexOf(tag), 1);
    },
    // 双击设置焦点
    showInput() {
      this.tagInput.show = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      const inputValue = this.tagInput.val;
      if (inputValue && this.form.businessLabel.indexOf(inputValue) === -1) {
        this.form.businessLabel.push(inputValue);
      }
      this.tagInput.show = false;
      this.tagInput.val = '';
    },
  },
};
