<template>
  <div id="app"
       class="brand-app">
    <div class="header">
      <a href="/">
        <img class="wkb-logo"
             :src="logo" />
      </a>

      <div class="right">
        <el-dropdown @command="operationHandler">
          <span class="ellipsis user-name">{{userInfo ? userInfo.userName || userInfo.epName : ''}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item,index) in operationList"
                              :key="index"
                              :command="item.id">
              {{item.name}}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
import logo from '@/dss-common/img/new-portal/common/logo-blue.png';
import cBaseApi from '@/dss-common/api/base.js';
export default {
  name: 'app',
  data() {
    return {
      logo,
      operationList: [{ id: 'quitAccount', name: '退出账户' }]
    };
  },

  computed: {
    ...mapState({
      userInfo: 'userInfo'
    })
  },
  methods: {
    // 右上角账户区域操作
    operationHandler(cmd) {
      switch (cmd) {
        case 'quitAccount':
          cBaseApi.logout();
          break;
      }
    }
  }
};
</script>
