<template>
  <div class="mp-is-empty">
    <div class="guide">
      <p style="line-height: 1">微信小程序</p>
      <p>只需简单配置，就可以一键生成自己的小程序，帮助企业降低开发成本。</p>
      <p>商品、订单统一通过惟客宝美业后台管理，简单高效！</p>
    </div>

    <div class="op-block">
      <div class="icon icon-red"></div>
      <div class="title">已拥有小程序账号</div>
      <div class="desc">
        建议先完成<span :title="this.allowOperate ? '' : '暂无权限操作'" @click="toCertification">店铺认证</span
        >，请确保小程序认证主体和当前店铺主体一致。
      </div>
      <el-button
        type="primary"
        class="btn"
        size="mini"
        :disabled="checking"
        :title="this.allowOperate ? '' : '暂无权限操作'"
        @click="clickBindMinPro"
      >
        一键生成小程序
      </el-button>
    </div>

    <div class="op-block">
      <div class="icon icon-gray"></div>
      <div class="title">没有小程序账号</div>
      <div class="desc">
        点击下方按钮前往微信公众平台注册(目前仅支持[企业]类型的主体)，在授权即可。查看
        <span :title="this.allowOperate ? '' : '暂无权限操作'" @click="toViewJoinParticulars">注册事项</span>
      </div>
      <el-button
        type="primary"
        class="btn btn2"
        size="mini"
        :title="this.allowOperate ? '' : '暂无权限操作'"
        @click="clickCreateMinPro"
      >
        小程序官方注册
      </el-button>
    </div>
  </div>
</template>

<script>
  import settingsApi from '@/mod-console/src/api/settings.js';
  import store from '@/business-common/store.js';
  import storeConst from '@/business-common/constants/packageEnum.js';

  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    name: 'Index',
    computed: {
      ...mapState({
        global_info: 'global_info',
        wxAuthInfo: 'wxAuthInfo',
        roleList: 'roleList',
        companyScopeMenu: 'companyScopeMenu',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.companyScopeMenu,
          scopeMenuEnum.dictionary.companyChildMenu.wkbWxSettingMenu.clientButton.client_applet_authorization_edit
        );

        if (editButton.isHasPermission) {
          return true;
        } else {
          return false;
        }
      },
    },
    data() {
      return {
        checking: false,
      };
    },
    beforeDestroy() {
      if (this._searchId) {
        clearTimeout(this._searchId);
      }
    },
    methods: {
      // 绑定小程序
      clickBindMinPro() {
        if (this.allowOperate) {
          window.open('/wp/auth/authQRCode?authType=' + storeConst.WX_AUTH_TYPE.MA, '_blank');
          this.$confirm('微信授权操作结果', '授权', {
            confirmButtonText: '已授权',
            cancelButtonText: '未授权',
            type: 'warning',
            customClass: 'wkt-warning',
          }).then(() => {
            this.checking = true;
            this.loopCtrl();
          });
        }
      },

      // 轮训
      loopCtrl() {
        if (this.checking) {
          this.$message({
            message: '查询授权信息中...',
            type: 'warning',
            duration: 5000,
          });
          this._searchId = setTimeout(() => {
            if (this.checking) {
              this.getAuthorizationInfo();
            }
          }, 5000);
        }
      },

      // 查询授权结果
      getAuthorizationInfo() {
        settingsApi
          .getAuthorizationInfo({ authType: storeConst.WX_AUTH_TYPE.MA })
          .then(res => {
            if (!!res.data && !!res.data.authorizerAppId) {
              this.checking = false;
              store.commit('set_wxAuthInfo', {
                wxMaAppId: res.data.authorizerAppId,
              });
            }
          })
          .always(() => {
            this.loopCtrl();
          });
      },
      // 创建小程序
      clickCreateMinPro() {
        if (this.allowOperate) {
          window.open('https://mp.weixin.qq.com/', '_blank');
        }
      },
      // 店铺认证
      toCertification() {
        if (this.allowOperate) {
          window.open('https://developers.weixin.qq.com/miniprogram/product/renzheng.html', '_blank');
        }
      },
      // 注册事项
      toViewJoinParticulars() {
        if (this.allowOperate) {
          window.open(
            'https://developers.weixin.qq.com/miniprogram/product/#1-%E6%B3%A8%E5%86%8C%E6%8F%90%E4%BA%A4%E8%A7%84%E8%8C%83',
            '_blank'
          );
        }
      },
    },
  };
</script>
