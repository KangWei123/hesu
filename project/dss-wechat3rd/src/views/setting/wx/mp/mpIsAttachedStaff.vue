<template>

  <div class="mp-is-attached"
       v-loading="loading"
       element-loading-spinner="el-icon-loading">

    <div class="op-code">
      <span class="txt">如果小程序运行不正常，可以尝试重新授权</span>
      <span class="btn"
            :title="this.allowOperate ? '' : '暂无权限操作'"
            @click="reAuth">重新授权</span>
    </div>

    <div class="op-code">
      <span class="txt">如果需要将小程序绑定到其它店铺，请先解绑。</span>
      <span class="btn"
            :title="this.allowOperate ? '' : '暂无权限操作'"
            @click="unBind">解除绑定</span>
    </div>

    <div class="op-block"
         v-if="!online.version">
      <div class="icon icon-red"></div>
      <div class="title">开发版本</div>

      <div class="status"
           :class="dev.status in ableFailDesc ? 'fail-status' : ''">{{ !dev.version? '暂无开发版': StatusName[dev.status] }}</div>
      <div class="version"
           v-if="dev.version">版本号：{{dev.version}}</div>
      <div class="time">{{dev.time | time}}</div>

      <el-popover v-if="dev.qrCode"
                  placement="top"
                  width="200"
                  trigger="hover">
        <img style="width:200px;"
             :src="'data:image/jpeg;base64,'+dev.qrCode" />
        <a slot="reference"
           href="javascript:;"
           class="table-href">体验二维码</a>
      </el-popover>

      <el-popover v-if="dev.status in ableFailDesc"
                  placement="top"
                  title="失败原因"
                  width="200"
                  trigger="hover"
                  :content="dev.desc">
        <div class="reason"
             slot="reference">失败原因</div>
      </el-popover>

      <el-button type="primary"
                 v-if="dev.status in ableReload && dev.version"
                 :loading="submitting"
                 class="btn"
                 :title="this.allowOperate ? '' : '暂无权限操作'"
                 @click="clickReUploadMinPro">
        {{dev.status=='UPLOAD_NOT'?'开始上传':'重新上传'}}
      </el-button>

      <el-button type="primary"
                 :loading="submitting"
                 v-if="dev.status in ableReRelease"
                 class="btn"
                 :title="this.allowOperate ? '' : '暂无权限操作'"
                 @click="clickReleaseMinPro">发布
      </el-button>

    </div>

    <div class="op-block"
         v-if="online.version">
      <div class="icon icon-gray"></div>

      <div class="title">线上版本</div>
      <span class="version"
            v-if="online.version"> V {{online.version}}</span>
      <div class="version"
           v-else>暂无已上线版本</div>

      <img style="width:140px;"
           class="online-qr-img"
           :src="online.qrCode" />

      <div class="time">{{online.time | time}}</div>

    </div>

  </div>
</template>

<script>
import dateUtil from '@/dss-common/utils/date';
import settingsApi from '@/dss-wechat3rd/src/api/settings';
import storeConst from '@/business-common/constants/packageEnum.js';
import baseApi from '@/dss-common/api/base.js';
import scopeMenuEnum from '@/business-common/scopeMenuEnum';
import { mapState } from 'vuex';

const Status = {
  CANCEL_RELEASE: 3,
  UPLOAD_NOT: 12,
  UPLOAD_FAIL: 11,
  UPLOAD_SUCCESS: 10,
  //0, "审核成功" 2, "审核中"
  RELEASE_ING: {
    0: 1,
    2: 1
  },
  // 1, "审核失败"  21, "小程序发布失败"
  RELEASE_FAIL: {
    1: 1,
    21: 1
  }
};
const StatusName = {
  UPLOAD_NOT: '暂未上传',
  UPLOAD_FAIL: '上传失败',
  UPLOAD_SUCCESS: '上传成功',
  RELEASE_ING: '发布中',
  RELEASE_FAIL: '发布失败',
  CANCEL_RELEASE: '审核已撤销'
};

export default {
  computed: {
    ...mapState({
      global_info: 'global_info',
      wxAuthInfo: 'wxAuthInfo',
      wkbScopeMenu: 'wkbScopeMenu'
    }),
    // 只允许企业管理员操作
    allowOperate() {
      const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
        this.wkbScopeMenu,
        scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.clientButton.employee_applet_authorization_edit
      );

      if (editButton.isHasPermission) {
        return true;
      } else {
        return false;
      }
    }
  },
  props: {
    businessMp: String
  },
  data() {
    return {
      submitting: false,
      loading: true,
      Status: Status,
      StatusName: StatusName,
      ableReload: {
        UPLOAD_NOT: 1,
        UPLOAD_FAIL: 1
      },
      ableFailDesc: {
        UPLOAD_FAIL: 1,
        RELEASE_FAIL: 1
      },
      ableReRelease: {
        UPLOAD_SUCCESS: 1,
        RELEASE_FAIL: 1,
        CANCEL_RELEASE: 3
      },
      //开发版本
      dev: {
        status: 'UPLOAD_NOT', //当前状态
        desc: '', //失败描述
        version: '', //版本号
        qrCode: '', //体验二维码
        time: '', //上次操作时间
        id: ''
      },
      //线上版本
      online: {
        version: '', //版本信息
        time: '', //版本发布时间
        qrCode: '' //发布版本二维码
      }
    };
  },

  mounted() {
    this.checkStatus();
  },

  filters: {
    time(time) {
      if (!time) {
        return '';
      }
      return dateUtil.format(new Date(time));
    }
  },

  methods: {
    filerStatus(status) {
      for (let devKey in Status) {
        if (Status[devKey] == status || (typeof Status[devKey] === 'object' && Status[devKey].hasOwnProperty(status))) {
          return devKey;
        }
      }
    },

    checkStatus() {
      this.loading = true;
      settingsApi
        .getMaCodeStatus({ maType: 1 })
        .then(res => {
          const { dev, online } = res.data || {};
          //const {dev, online} = mock.data || {};

          //开发版
          if (!!dev) {
            //辅助 业务状态
            this.dev.status = this.filerStatus(dev.status);
            //状态码的描述（失败时，表示错误提示）
            this.dev.desc = dev.statusDesc || '';
            //更新时间
            this.dev.time = dev.lastOperateTime;
            //版本号
            this.dev.version = dev.version || '';
            //sellerTemplateId
            this.dev.id = dev.id;
            //二维码
            this.dev.qrCode = dev.qrCode || '';
            //未上传代码的小程序默认直接上传
            if (dev.status === Status.UPLOAD_NOT) {
              this.clickReUploadMinPro();
            }
          }

          //线上版
          if (!!online) {
            //版本号
            this.online.version = online.version || '';
            //更新时间
            // new Date("2020-09-20 11:20:05") safari日期函数错误
            this.online.time = online.releaseTime ? online.releaseTime.replace(/-/g, '/') : '';
            //线上二维码
            this.online.qrCode = online.releaseQrCodePath || '';
          }

          //console.log(this.dev.status in this.ableReload && this.dev.version);
        })
        .always(() => {
          this.loading = false;
        });
    },

    //重新上传小程序
    clickReUploadMinPro() {
      if (this.allowOperate) {
        this.submitting = true;
        settingsApi
          .uploadMinPro({ sellerTemplateId: this.dev.id, maType: 1 })
          .then(() => {
            this.$message({ type: 'success', message: '配置已更新' });
            this.checkStatus();
          })
          .always(() => {
            this.submitting = false;
          });
      }
    },

    //发布小程序
    clickReleaseMinPro() {
      if (this.allowOperate) {
        this.submitting = true;
        settingsApi
          .releaseMinPro({ sellerTemplateId: this.dev.id, maType: 1 })
          .then(() => {
            this.$message({ type: 'success', message: '发布已提交' });
            this.checkStatus();
          })
          .always(() => {
            this.submitting = false;
          });
      }
    },
    // 重新授权
    reAuth() {
      if (this.allowOperate) {
        window.open('/wp/auth/authQRCode?authType=' + storeConst.WX_AUTH_TYPE.MA + '&maType=1', '_blank');
        this.$confirm('微信授权操作结果', '授权', {
          confirmButtonText: '已授权',
          cancelButtonText: '未授权',
          type: 'warning',
          customClass: 'wkt-warning'
        }).then(() => {
          this.checkStatus();
          this.getAuthorizationInfo();
        });
      }
    },

    //查询授权结果
    getAuthorizationInfo() {
      settingsApi
        .getAuthorizationInfo({ authType: storeConst.WX_AUTH_TYPE.MA, maType: 1 })
        .then(res => {
          if (!!res.data && !!res.data.authorizerAppId) {
            this.$message({
              type: 'success',
              message: '重新授权成功'
            });
            this.clickReUploadMinPro();
          } else {
            this.$message({
              type: 'error',
              message: ' 重新授权失败'
            });
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '重新授权失败'
          });
        });
    },

    // 解除绑定
    unBind() {
      if (this.allowOperate) {
        /*  console.log('unbind --> ' + this.wxAuthInfo.wxMaAppId);*/

        this.$confirm('确认解除绑定？', '解除小程序与店铺的绑定', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning'
        }).then(() => {
          this.apiUnBindApp();
        });
      }
    },

    apiUnBindApp() {
      let params = {
        authorizerAppId: this.businessMp || this.wxAuthInfo.wxMaAppIdB,
        maType: 1
      };

      settingsApi
        .unBindApp(params)
        .then(res => {
          this.$message({
            type: 'success',
            message: '解除绑定成功，请重新登录'
          });
          setTimeout(() => {
            baseApi.logout();
          }, 2000);
        })
        .catch(err => {
          this.$message({ type: 'error', message: '解除绑定失败' });
        });
    }
  }
};
</script>
