<template>
  <div id="app" class="brand-app">
    <div class="home-header">
      <div class="title">惟客云数字化客户经营系统</div>
      <div class="btn-box">
        <span class="">你好，欢迎回来。{{ time }}</span>
        <span class="logout" @click="operationHandler">{{ userInfo.userName }}，退出登录</span>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import './app.less';
  import logo from '@/dss-common/img/new-portal/common/logo-d.png';
  import cBaseApi from '@/dss-common/api/base.js';
  import dateUtil from '@/dss-common/utils/date';

  export default {
    name: 'App',
    data() {
      return {
        logo,
        time: '',
      };
    },

    computed: {
      ...mapState({
        userInfo: 'userInfo',
      }),
    },

    mounted() {
      console.log(this.userInfo);
      this.getTime();
    },

    methods: {
      // 右上角账户区域操作
      operationHandler() {
        cBaseApi.logout();
      },

      getTime() {
        const now = new Date();
        const hours = now.getHours() > 12 ? now.getHours() - 12 : now.getHours();
        this.time = this.judgeTime(now) + hours + ':' + dateUtil.format(now, 'mm');
      },

      // 获取上下午
      judgeTime(date) {
        const hours = date.getHours();
        if (hours >= 0 && hours < 12) {
          return '上午';
        } else {
          return '下午';
        }
      },
    },
  };
</script>
