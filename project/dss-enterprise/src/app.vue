<template>
  <div id="app"
       class="brand-app">
    <div class="header-nav">
      <div class="nav-box" id="key-header">
        <div class="pc">
          <div class="header">
            <a class="logo" href="javascript:;" style="display: inline-block;cursor: default;">
              <a href="/" class="logo-wrapper">
                <img class="header-logo privateLogo" :src="logo" />
              </a>
            </a>
            <div class="btn-box">
              <a class="logout" href="javascript:;" id="logout" @click="operationHandler">退出</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade"
                mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import './app.less';
import logo from '@/dss-common/img/new-portal/common/logo-d.png';
import cBaseApi from '@/dss-common/api/base.js';
export default {
  name: 'app',
  data() {
    return {
      logo
    };
  },

  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  methods: {
    // 右上角账户区域操作
    operationHandler() {
      cBaseApi.logout();
    }
  }
};
</script>
