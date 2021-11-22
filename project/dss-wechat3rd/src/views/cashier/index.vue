<template>
  <div id="content" class="content">
    <div class="left border-right">
      <!-- 会员信息 -->
      <MemberInfo />
      <!-- 侧边栏 -->
      <SideBar />
    </div>
    <div class="center">
      <!-- 头信息 -->
      <Header />
      <!-- Tab标签  -->
      <Tabs @select="select" />
      <!-- 商品信息  [ Good、Order ]-->
      <component :is="currentView"></component>
    </div>
  </div>
</template>
<script>
  import './index.less';
  import MemberInfo from './member-info/member-info.vue';
  import SideBar from './sidebar/sidebar.vue';
  import Header from './header/header.vue';
  import Tabs from './Tabs/Tabs.vue';
  import Goods from './goods/goods.vue';
  import Order from './order/order.vue';
  import wpBaseApi from '@/business-common/wp-base-api';

  export default {
    components: {
      MemberInfo,
      SideBar,
      Header,
      Tabs,
      Goods,
      Order,
    },

    data() {
      return {
        timer: null, // 定时器
        wkb_root: null,
        currentView: 'Goods',
      };
    },
    mounted() {
      // 心跳处理，每隔25分钟即1500000毫秒，执行一次检查登录，避免30分钟登录超时
      this.timer = setInterval(() => {
        wpBaseApi.checkWpLogin(); // 检查登录
      }, 1500000);
      this.callback();
      window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', this.callback);
    },
    methods: {
      // 动态设置屏幕大小
      setupScreen() {
        const content = document.getElementById('content');
        this.wkb_root = document.getElementsByClassName('wkb-root')[0];
        if (this.wkb_root) {
          this.wkb_root.style.display = 'none';
        }
        document.body.appendChild(content);
      },
      callback() {
        // 得到手机屏幕的宽度
        const htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
        // 得到html的Dom元素
        const htmlDom = document.getElementsByTagName('html')[0];
        // 设置根元素字体大小
        htmlDom.style.fontSize = htmlWidth / 102.4 + 'px';
        this.setupScreen();
      },
      // 选择订单类型
      select(item) {
        console.log(item);
        this.currentView = item.name;
      },
    },
    beforeDestroy() {
      clearInterval(this.timer); // 销毁定时器
    },
  };
</script>
