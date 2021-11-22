<template>
  <div class="page-header">
    <div class="header">
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <a href="javascript:;" style="display: inline-block; cursor: default; padding-right: 20px">
        <!-- 店铺logo -->
        <span
          class="logo"
          :style="'background-image: url(' + curApp.logo + ')'"
          v-if="!!curApp && !!curApp.logo"
        ></span>
        <img class="logo" :src="require('@/dss-common/img/brand/logo-default.png')" v-else />

        <!-- 店铺名称 -->
        <span class="ellipsis app-name" :title="!!curApp ? curApp.name : ''"> {{ !!curApp ? curApp.name : '' }}</span>
      </a>

      <span class="menu" :class="item.selected ? 'activity-menu' : ''" v-for="(item, index) in headList" :key="index">
        <a :href="item.url" :target="item.identifier == 'ws' ? '_blank' : '_self'" class="tab" v-if="!item.disabled">{{
          item.name
        }}</a>
        <el-popover v-else placement="bottom" width="200" trigger="hover" :content="item.disableTip">
          <a class="tab" slot="reference">{{ item.name }}</a>
        </el-popover>
      </span>

      <div class="page-header-right">
        <!-- <select-store v-if="isHasSelStore" @changeStore="changeStore" /> -->
        <el-dropdown @command="operationHandler" class="account-info">
          <div class="info-box">
            <span :class="{ 'has-new': messageCenterMenu && messageCenterMenu.hasNew }">
              <img :src="avatar" />
            </span>
            <span class="ellipsis user-name">{{ userName || '' }}</span>
            <i class="el-icon-arrow-down" style="vertical-align: middle"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <!-- 操作菜单 -->
            <el-dropdown-item v-for="(item, index) in operationList" :key="index" :command="item">
              <div v-if="item.isHasPermission" class="menu-item">
                <wk-icon :name="item.icon" class="menu-icon" />
                <span :class="{ 'has-new': item && item.hasNew }">{{ item.name }}</span>
              </div>
              <el-popover v-else placement="bottom" width="200" trigger="hover" :content="item.disableTip" />
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import avatar from '@/dss-common/img/avatar-blue.png';
  import systemSetting from '@/dss-common/img/page-header/logo-system-setting.png';
  import systemSettingSelected from '@/dss-common/img/page-header/logo-system-setting-selected.png';
  import logo from '@/dss-common/img/new-portal/common/logo.png';
  import storeImg from '@/dss-common/img/page-header/logo-store.png';
  import storeImgSelected from '@/dss-common/img/page-header/logo-store-selected.png';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum.js';
  import Hamburger from '@/dss-common/components/Hamburger/index';
  import SelectStore from '@/business-common/components/store-select/index';
  import store from '@/business-common/store.js';
  import messageImg from '@/dss-common/img/page-header/logo-message.png';
  import messageImgSelected from '@/dss-common/img/page-header/logo-message-selected.png';
  import MessageHandler from './handler/messageHandler';

  export default {
    props: {
      pageMenuKey: {
        type: String,
        default: scopeMenuEnum.dictionary.wkbMenu,
      },
      wkbStatus: {
        type: Number,
        default: 0,
      },
      klbStatus: {
        type: Number,
        default: 0,
      },
      userName: {
        type: String,
        default: '',
      },
      userInfos: {
        type: Object,
        default() {
          return {};
        },
      },
      isHasSelStore: {
        type: Boolean,
        default: false,
      },
      optsList: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Hamburger,
      SelectStore,
    },
    data() {
      return {
        avatar,
        systemSetting,
        systemSettingSelected,
        messageImg,
        messageImgSelected,
        messagesMenu: scopeMenuEnum.dictionary.messagesMenu,
        logo,
        storeImg,
        storeImgSelected,
        headList: [],
        operationList: [{ key: 'quitAccount', isHasPermission: 1, icon: 'icon-quit', name: '退出登录' }],
        opened: true,
        rightMenuList: [],
        messageCenterMenu: {},
      };
    },

    mounted() {
      // tofix 导航菜单丢失
      if (this.rootScopeMenu && this.rootScopeMenu.length) {
        this.assembleScopeMenu();
      }
    },

    computed: {
      ...mapState({
        globalInfo: 'global_info', // wkb用户信息
        userInfo: 'userInfo', // klb用户信息
        curApp: 'curApp',
        curStore: 'curStore',
        rootScopeMenu: 'rootScopeMenu',
        sidebar: 'sidebar',
      }),
    },

    watch: {
      rootScopeMenu: {
        deep: true,
        handler(newVal, oldVal) {
          this.redirectFn();
          this.assembleScopeMenu();
        },
      },
      operationList(newVal) {
        this.messageOperate();
        this.messageCenterMenu = (newVal || []).find(item => item.identifier === this.messagesMenu);
      },
      optsList: {
        handler(newVal) {
          if (newVal && newVal.length) {
            newVal.forEach(item => {
              this.operationList.unshift(item);
            });
          }
        },
        immediate: true,
      },
    },

    beforeDestroy() {
      this._messageHandler = null;
      clearInterval(this._interval);
    },

    methods: {
      changeStore(id) {
        this.$emit('changeStore', id);
      },
      toggleSideBar() {
        // this.opened = !this.opened;
        store.dispatch('toggleSideBar');
      },
      isSelected(url) {
        return url && window.location.href && window.location.href.indexOf(url) !== -1;
      },
      // 操作头部右边下拉菜单
      operationHandler(cmd = {}) {
        const { key } = cmd;
        if (key === 'quitAccount' || key === 'switchApp') {
          this.$emit('operation-action', key);
          return;
        }
        this.goPage(cmd);
      },
      // 页面跳转
      goPage(item) {
        if (item.identifier === this.messagesMenu && item.hasNew) {
          this._messageHandler.setRead();
        }
        window.top.location.href = item.url;
      },
      redirectFn() {
        if (this.rootScopeMenu && this.rootScopeMenu.length) {
          const index = this.rootScopeMenu.findIndex(item => item.identifier === this.pageMenuKey);
          if (index === -1) {
            const path = this.rootScopeMenu[0] && this.rootScopeMenu[0].url.replace('/', '');

            const url = window.location.href.split('/');

            const index = url.findIndex(item => item.includes('.html'));

            if (index !== -1) {
              url[index] = path + '#';
              window.top.location.href = url.join('/');
            }
          }
        }
      },
      assembleScopeMenu() {
        let settingMenu = {};
        let messageMenu = {};
        this.rootScopeMenu.forEach(item => {
          if (item.identifier === 'company') {
            item.icon = 'icon-set';
            item.isSelected = this.isSelected('/console.html');
            item.disableTip = scopeMenuEnum.disabledTip;
            item.key = 'company';

            settingMenu = { ...item };
          } else if (item.identifier === this.messagesMenu) {
            item.icon = 'icon-message';
            item.isSelected = this.isSelected('/message-center.html');
            item.disableTip = scopeMenuEnum.disabledTip;
            item.hasNew = false;
            // this.rightMenuList.push(item);
            messageMenu = { ...item };
          }
        });

        const isHasMenu = !!Object.keys(settingMenu).length;
        const index = this.operationList.findIndex(item => item.id === settingMenu.id);

        if (index === -1) {
          isHasMenu && this.operationList.unshift(settingMenu);
        }

        if (!!messageMenu.isHasPermission && this.operationList.findIndex(item => item.id === messageMenu.id) < 0) {
          this.operationList.unshift(messageMenu);
        }

        const tmpHeadList = this.rootScopeMenu.filter(
          item => item.identifier !== 'company' && item.identifier !== this.messagesMenu
        );

        // 需要深拷贝一次，否则watch机制会导致死循环
        this.headList = this.$plain(tmpHeadList);

        this.headList.forEach(item => {
          item.disableTip = scopeMenuEnum.disabledTip;
          if (item.url === '/wkb.html') {
            item.selected = this.isSelected('/wkb.html') && !this.isSelected('/wkb.html?source=center');
          } else {
            item.selected = this.isSelected(item.url);
          }
          // 登录大数据平台时需要把本地缓存的token通过url带过去
          const wdToken = localStorage.getItem('wdToken');
          if (item.identifier === 'ws' && wdToken) {
            item.url = item.url + '?token=' + wdToken;
          }
        });
      },

      // 新消息提醒
      messageOperate() {
        const userInfos = this.userInfos;
        const messageMenuIndex = this.operationList.findIndex(item => item.identifier === this.messagesMenu);

        if (userInfos.appInfo && !this._messageHandler && ~messageMenuIndex) {
          const { userPhone } = userInfos;
          const { epId } = userInfos.appInfo;
          const messageMenu = this.operationList[messageMenuIndex];

          this._messageHandler = new MessageHandler('head', { userPhone, epId });
          const fun = async () => {
            const { isNew } = await this._messageHandler.getMessage();

            if (isNew) {
              messageMenu.hasNew = isNew;
              this.$set(this.operationList, messageMenuIndex, messageMenu);
              clearInterval(this._interval);
            }
          };

          fun();
          this._interval = setInterval(fun, 300000);
        }
      },
    },
  };
</script>
<style scoped lang="less">
  .page-header {
    position: fixed !important;
    width: 100%;
    -webkit-box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.1);
    z-index: 11;

    .header {
      font-size: 0;
      background-color: #fff;
      min-width: 1160px;
      height: 56px;
      line-height: 56px;
      position: relative;
      padding: 0 20px 0 10px;
      text-align: left;
      z-index: 9999;

      span,
      img {
        display: inline-block;
        vertical-align: middle;
      }
    }

    .logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-size: 100%;
      background-repeat: no-repeat;
      background-position: center;
    }

    .wkb-logo {
      margin: 0 25px 0 20px;
      width: 160px;
      height: 27px;
      vertical-align: middle;
    }

    .app-name {
      width: 80px;
      height: 20px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      color: #303133;
      line-height: 16px;
      margin-left: 10px;
    }

    .menu {
      font-size: 14px;
      display: inline-block;
      width: auto;
      position: relative;

      .tab {
        display: block;
        line-height: 56px;
        height: 56px;
        text-align: center;
        color: #717378;
        padding: 0 14px;
      }

      a,
      a:hover {
        text-decoration: none;
      }
    }

    .activity-menu {
      .tab {
        position: relative;
        color: #fa7516; /**todo 公共颜色 */
        height: 56px;
        line-height: 56px;
        padding: 0 14px;
        font-weight: 500;
        /*padding-bottom: 8px;*/
        //  border-bottom: 3px solid #fa7516;
        /*margin-top: 10px;*/

        &::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 84px;
          height: 3px;
          background: #fa7516;
        }
      }
    }

    .page-header-right {
      position: absolute;
      top: 0;
      right: 16px;
      // width: 300px;
      text-align: right;
      height: 56px;
      line-height: 56px;
      font-size: 0;

      .account-info {
        .info-box {
          margin-left: 15px;
          cursor: pointer;

          img {
            display: inline-block;
            width: 24px;
            height: 24px;
            border-radius: 1px;
            vertical-align: middle;
          }
        }

        .has-new {
          display: inline-block;
          position: relative;
          &::after {
            content: '';
            position: absolute;
            right: -4px;
            top: 13px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #f5222d;
            pointer-events: none;
          }
        }
      }
    }

    .user-name {
      max-width: 120px;
      margin-right: 10px;
      margin-left: 7px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #717378;
      cursor: pointer;
    }
  }
  .menu-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #717378;

    .menu-icon {
      width: 14px;
      height: 14px;
      margin-right: 9px;
      fill: #717378;
    }

    .has-new {
      display: inline-block;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: -8px;
        top: 8px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #f5222d;
        pointer-events: none;
      }
    }
  }

  .ellipsis {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }
</style>
