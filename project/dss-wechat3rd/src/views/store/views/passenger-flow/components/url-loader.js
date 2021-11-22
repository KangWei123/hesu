/*
url 请求组件，实现iTimer接口，会定时发送请求
*/
import Vue from 'vue';
import iTimer from '../mixins/i-timer.js';
import service from '@/dss-common/utils/services.js';

export default Vue.component('url-loader', {
  mixins: [iTimer],
  props: {
    // 请求路径，必填
    url: {
      type: String,
      default: ''
    },
    // 接口描述，非必填
    desc: {
      type: String,
      default: '获取数据'
    },
    // 请求参数，非必填
    params: {
      type: Object,
      default() {
        return null;
      }
    },
    dataType: {
      type: String,
      default: 'Object'
    }
  },
  data() {
    let data = {};
    if (this.dataType === 'Array') {
      data = [];
    }
    return {
      isLoading: false,
      response: { data: data }
    };
  },
  render() {
    return this.$scopedSlots.default({
      isLoading: this.loading,
      response: this.response
    });
  },
  methods: {
    getData() {
      this.isLoading = true;
      return service
        .get(this.url, {
          params: this.params,
          action: this.desc
        })
        .done(res => {
          this.response = res;
        })
        .always(() => {
          this.isLoading = false;
        });
    }
  }
});
