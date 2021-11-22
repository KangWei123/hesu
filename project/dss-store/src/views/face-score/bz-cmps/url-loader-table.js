/*
url 请求组件，实现iTimer接口，会定时发送请求
*/

import urlLoader from '@/dss-store/src/components/url-loader.js';
import service from '@/dss-common/utils/services.js';
export default {
  extends: urlLoader,
  data() {
    return {
      enterTimeAnchor: null
    };
  },
  methods: {
    unique(arr) {
      // 根据唯一标识idStr来对数组进行去重
      const res = new Map(); //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      return arr.filter(item => {
        return !res.has(item.unionId) && res.set(item.unionId, 1);
      });
    },

    getData() {
      this.isLoading = true;
      return service
        .get(this.url, {
          params: { ...this.params, enterTimeAnchor: this.enterTimeAnchor },
          action: this.desc
        })
        .done(res => {
          if (res && res.data && res.data.length) {
            this.enterTimeAnchor = res.data[0].signInTime;
          }
          //返回errorCode=101全量刷新
          if (res.errorCode === 101) {
            this.enterTimeAnchor = null;
          }
          res.data = this.unique(res.data.concat(this.response.data)).slice(0, 10);
          this.response = res;
        })
        .always(() => {
          this.isLoading = false;
        });
    }
  }
};
