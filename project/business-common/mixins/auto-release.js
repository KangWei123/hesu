/**
 * 用于自动释放监听器
 */
export default {
  beforeDestroy() {
    if (this._releasers_) {
      this._releasers_.forEach(i => i());
    }
  },
  methods: {
    globalAddRelease(releaser) {
      if (this._releasers_ == null) {
        this._releasers_ = [];
      }

      this._releasers_.push(releaser);
    },
  },
};
