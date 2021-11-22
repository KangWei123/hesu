import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Vue from 'vue';
export default Vue.component('url-loader', {
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
    },
    //是否增量刷新
    isAll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let data = {};
    if (this.dataType === 'Array') {
      data = [];
    }
    return {
      isLoading: false,
      response: { data: data },
      stompClient: '',
      timer: ''
    };
  },
  render() {
    return this.$scopedSlots.default({
      isLoading: this.loading,
      response: this.response
    });
  },

  methods: {
    unique(arr) {
      // 根据唯一标识idStr来对数组进行去重
      const res = new Map(); //定义常量 res,值为一个Map对象实例
      //返回arr数组过滤后的结果，结果为一个数组   过滤条件是，如果res中没有某个键，就设置这个键的值为1
      arr.forEach(item => {
        if (item.faceTag === 2) {
          item.idStr = item.faceId.toString() + item.updateTime.toString();
        }
      });
      //排序
      arr.sort((a, b) => {
        return b.updateTime - a.updateTime;
      });

      return arr.filter(item => {
        return !res.has(item.idStr) && res.set(item.idStr, 1);
      });
    },

    initWebSocket() {
      this.connection();
      window.onbeforeunload = () => {
        this.disconnect();
      };
      //断开重连机制, 尝试发送消息, 捕获异常发生时重连;
      // this.timer = setInterval(() => {
      //   try {
      //     this.stompClient.send('2');
      //   } catch (err) {
      //     console.log('断线了: ' + err);
      //     this.connection();
      //   }
      // }, 28000);
    },
    connection() {
      // 建立连接对象
      let socket = new SockJS('/c/ws/portal');
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      // this.stompClient.heartbeat.outgoing = 28000; //若使用STOMP 1.1 版本，默认开启了心跳检测机制（默认值都是10000ms）
      // this.stompClient.heartbeat.incoming = 0; //客户端不从服务端接收心跳包
      // 定义客户端的认证信息,按需求配置
      let headers = {};
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        frame => {
          let destinationTail = frame.body;
          this.stompClient.subscribe(
            this.url + destinationTail,
            msg => {
              // 订阅服务端提供的某个topic
              let res = JSON.parse(msg.body); // msg.body存放的是服务端发送给我们的信息
              if (this.isAll) {
                res.data = this.unique(res.data.concat(this.response.data)).slice(0, 20);
              }
              this.response = res;
            },
            headers
          );

          // this.stompClient.send('/app/chat.addUser', headers, JSON.stringify({ sender: '', chatType: 'JOIN' })); //用户加入接口
        },
        err => {
          // 连接发生错误时的处理函数
          console.log(err);
          setTimeout(() => {
            this.connection();
          }, 3000);
        }
      );
    }, //连接 后台
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
        console.log('断开连接');
      }
    } // 断开连接
  },
  mounted() {
    this.initWebSocket();
  },
  beforeDestroy() {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    // clearInterval(this.timer);
  }
});
