<template>
  <div class="wx-pc" v-loading="loading" element-loading-spinner="el-icon-loading">
    <!--等待公众号授权-->
    <div class="init" v-if="step == 'init'">
      <p class="title">绑定微信公众号的好处：</p>
      <p>1、顾客可在微信内收到商家公众号的消息推送；</p>
      <p>2、微信支持：在线付款超过5元，顾客将自动关注商家公众号；</p>
      <p>3、绑定认证服务号，预约、购买成功等各种场景下，顾客可收到微信模版消息提醒；</p>
      <p>4、绑定认证服务号并开通同步微信卡包功能，顾客可同步卡券后，在微信卡包内一键访问网店</p>

      <div class="bottom-button">
        <el-button
          size="small"
          :loading="checking"
          type="primary"
          class="btn"
          :title="allowOperate ? '' : '暂无权限操作'"
          @click="bindMp"
          >绑定公众号
        </el-button>
      </div>
    </div>

    <!--授权成功，展示信息-->
    <div class="success" v-if="step == 'success'">
      <!-- 操作提示 -->
      <div class="op-code">
        <span class="txt">如果需要将公众号绑定到其它店铺，请先解绑。</span>
        <span class="btn" :title="allowOperate ? '' : '暂无权限操作'" @click="unBind">解除绑定</span>
      </div>

      <!-- 授权信息 -->
      <div class="auth-info">
        <!-- <div class="icon"
              :style="values.headImgIconStyle"></div> -->
        <div v-for="(key, index) in order" :key="index">
          <div class="name">{{ names[key] }}：</div>
          <div class="value">{{ values[key] }}</div>
        </div>
      </div>

      <!-- 二维码 -->
      <div class="qrcode-box" v-if="qrcodeUrl">
        <div class="icon-red"></div>
        <img class="qrcode" :src="qrcodeUrl" />
        <el-button type="primary" round class="btn-copy" @click="handleCopy(h5PageUrl)" v-if="h5PageUrl"
          >复制链接</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/business-common/store.js';
  import storeConst from '@/business-common/constants/packageEnum.js';
  import settingsApi from '@/dss-wechat3rd/src/api/settings.js';
  import { mapState } from 'vuex';
  import './index.less';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';

  export default {
    name: 'Index',

    computed: {
      ...mapState({
        wxAuthInfo: 'wxAuthInfo',
        roleList: 'roleList',
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.settingButton.mp_setting_edit
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
        loading: false,
        checking: false,
        authorization: null,
        step: 'init',
        order: ['wkn', 'status', 'nickname', 'type'],
        names: {
          wkn: '微信公众号',
          status: '绑定状态',
          nickname: '公众号昵称',
          type: '公众号类型',
        },
        values: {
          wkn: '',
          status: '',
          nickname: '',
          type: '',

          /* headImg: '',
        qrcodeUrl: '',
        headImgIconStyle: '',
        qrcodeUrlIconStyle: '' */
        },
        qrcodeUrl: null, // 二维码链接
        h5PageUrl: null, // 公众号配置的h5页面链接
      };
    },

    mounted() {
      this.step = this.wxAuthInfo.wxMpAppId ? 'success' : 'init';
      // 公众号授权的信息
      if (this.step === 'success') {
        this.getMpAuthorizationInfo(); // 获取公众号授权的信息
        this.getH5PageUrl(); // 获取公众号配置的h5页面链接
      }
    },

    methods: {
      // 解除绑定
      unBind() {
        if (this.allowOperate) {
          this.$confirm('确认解除绑定？', '解除公众号与店铺的绑定', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.apiUnBindApp();
            })
            .catch(() => {
              console.log('取消解除');
            });
        }
      },

      apiUnBindApp() {
        const params = {
          authorizerAppId: this.wxAuthInfo.wxMpAppId,
        };

        settingsApi
          .unBindApp(params)
          .then(() => {
            this.$message({
              type: 'success',
              message: '解除绑定成功，请重新登录',
            });
            this.step = this.wxAuthInfo.wxMpAppId ? 'success' : 'init';
          })
          .catch(() => {
            this.$message({ type: 'error', message: '解除绑定失败' });
          });
      },

      /**
       * 获取公众号授权的信息
       */
      getMpAuthorizationInfo() {
        this.loading = true;
        settingsApi
          .getAuthorizationInfo({ authType: storeConst.WX_AUTH_TYPE.MP })
          .then(res => {
            const data = res.data;
            if (data) {
              this.values.wkn = data.userName;
              this.values.status = '已绑定';
              this.values.nickname = data.nickName || '';
              this.values.type =
                (data.verifyTypeInfo === -1 ? '未认证' : '认证') + (data.serviceTypeInfo === 2 ? '服务号' : '订阅号');

              /* this.values.headImg = data.headImg;
            this.values.headImgIconStyle =
              'background: transparent url(' + data.headImg + ') no-repeat 0 0;background-size: cover;';

            this.values.qrcodeUrl = data.qrcodeUrl;
            this.values.qrcodeUrlIconStyle =
              'background: transparent url(' + data.qrcodeUrl + ') no-repeat 0 0;background-size: cover;'; */

              this.qrcodeUrl = data.qrcodeUrl; // 二维码链接
            }
          })
          .always(() => {
            this.loading = false;
          });
      },

      bindMp() {
        if (this.allowOperate) {
          window.open('/wp/auth/authQRCode?authType=' + storeConst.WX_AUTH_TYPE.MP, '_blank');
          this.$confirm('微信授权操作结果', '授权', {
            confirmButtonText: '已授权',
            cancelButtonText: '未授权',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.checking = true;
              this.loopCtrl();
            })
            .catch(() => {
              console.log('取消授权');
            });
        }
      },

      // 轮询
      loopCtrl() {
        if (this.checking) {
          this.$message({
            message: '查询授权信息中...',
            type: 'warning',
            duration: 5000,
          });
          setTimeout(() => {
            if (this.checking) {
              this.getMpAuthorizeResult();
            }
          }, 5000);
        }
      },

      // 获取公众号授权结果
      getMpAuthorizeResult() {
        settingsApi
          .getAuthorizationInfo({ authType: storeConst.WX_AUTH_TYPE.MP })
          .then(res => {
            if (!!res.data && !!res.data.authorizerAppId) {
              this.checking = false;
              store.commit('set_wxAuthInfo', {
                wxMpAppId: res.data.authorizerAppId,
              });
            }
          })
          .always(() => {
            if (this.checking) {
              this.loopCtrl();
            }
          });
      },

      /**
       * 获取公众号配置的h5页面链接
       */
      getH5PageUrl() {
        settingsApi.getH5PageUrl().then(res => {
          this.h5PageUrl = res.data || null;
        });
      },

      /**
       * 复制
       * @param copyValue 要复制的值
       */
      handleCopy(copyValue) {
        // select()方法只对<input>和<textarea>有效，所以要先将值放到input标签中，再选中复制
        const oInput = document.createElement('input');
        oInput.value = copyValue;
        document.body.appendChild(oInput); // 在document.body末尾添加oInput
        oInput.select(); // 选择对象
        document.execCommand('Copy'); // 执行浏览器复制命令
        document.body.removeChild(oInput); // 删除document.body末尾的oInput

        this.$message({
          message: '复制成功',
          type: 'success',
        });
      },
    },
  };
</script>
