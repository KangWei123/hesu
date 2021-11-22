/*
定时执行接口，
必须实现getData方法，该方法返回一个Promise对象
time设置定时调用时间
*/
export default {
  props: {
    time: {
      type: Number,
      default: 5000
    },
    //是否静态刷新
    static: {
      type: Boolean,
      default: false
    }
  },
  beforeDestroy() {
    if (this.__timerId) {
      clearTimeout(this.__timerId);
    }
  },
  watch: {
    static(newVal) {
      if (!newVal) {
        this.__timeRequest();
      }
    }
  },
  mounted() {
    this.__timeRequest();
  },
  methods: {
    __timeRequest() {
      if (!!this.__timerId) {
        clearTimeout(this.__timerId);
      }
      if (!this.static) {
        this.getData().always(() => {
          this.__timerId = setTimeout(() => {
            this.__timeRequest();
          }, this.time);
        });
      }
    }
  }
};
