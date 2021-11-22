<template>
  <div class="main-qy-content" v-loading="loading">
    <p class="explain">备注说明：必须按照指引说明完成所有对应的授权绑定，才能保证功能的正常使用；</p>
    <div class="step">
      <div class="content">
        <div class="content-left">
          <div class="stepOne">
            <!-- <span>{{ corpId ? '✓' : '1' }}</span> -->
            <wk-icon class="icon" :class="corpId ? 'icon-success' : 'icon-undone'" name="icon-success" />
          </div>
          <span>{{ corpId ? '已完成' : '第一步' }}</span>
        </div>
        <ul class="list">
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
        </ul>
        <div class="content-right">
          <div class="stepTwo" :class="corpId ? 'active' : 'stepTwo'">
            <wk-icon class="icon" :class="communicateAuth ? 'icon-success' : 'icon-undone'" name="icon-success" />
            <!-- <span>{{ communicateAuth ? '✔' : '2' }}</span> -->
          </div>
          <span>{{ communicateAuth ? '已完成' : '第二步' }}</span>
        </div>
        <ul class="list">
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
        </ul>
        <div class="content-right">
          <div class="stepTwo" :class="communicateAuth ? 'active' : 'stepTwo'">
            <wk-icon class="icon" :class="clientAuth ? 'icon-success' : 'icon-undone'" name="icon-success" />
            <!-- <span>{{ clientAuth ? '✔' : '3' }}</span> -->
          </div>
          <span>{{ clientAuth ? '已完成' : '第三步' }}</span>
        </div>
        <ul class="list">
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
          <li class="item"></li>
        </ul>
        <div class="content-right">
          <div class="stepTwo" :class="clientAuth ? 'active' : 'stepTwo'">
            <wk-icon class="icon" :class="clientAuth ? 'icon-success' : 'icon-undone'" name="icon-success" />
            <!-- <span>{{ mpAuth ? '✔' : '4' }}</span> -->
          </div>
          <span>{{ mpAuth ? '已完成' : '第四步' }}</span>
        </div>
      </div>
    </div>
    <ul class="authList">
      <li class="item" v-if="corpId">
        <img src="../../../../images/wxAuth/authEnter/Group.png" alt="" />
        <p class="auth">绑定企业ID</p>
        <p class="noAuth">{{ corpId }}</p>
        <el-button
          style="font-size: 12px"
          @click="updateCorpId(corpId)"
          type="primary"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          >修改</el-button
        >
      </li>
      <li class="item" v-if="!corpId">
        <img src="../../../../images/wxAuth/authEnter/Group.png" alt="" />
        <p class="auth">绑定企业ID</p>
        <p class="noAuth">未授权</p>
        <el-button
          style="color: white; font-size: 12px"
          @click="bindCorpId"
          type="primary"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          >开始绑定</el-button
        >
      </li>
      <li class="item">
        <img src="../../../../images/wxAuth/authEnter/tongxunlu.png" alt="" />
        <p class="auth">通讯录授权</p>
        <p class="noAuth" v-if="!communicateAuth">未授权</p>
        <p class="noAuth" v-if="communicateAuth">已授权</p>
        <el-button
          style="color: white; font-size: 14px"
          @click="startAuth('/setting/wx/qy/auth/communicateAuth')"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          v-if="!communicateAuth"
          :flag="flag"
          :type="corpId ? 'primary' : 'info'"
          :disabled="!corpId"
          >开始绑定</el-button
        >
        <el-button
          style="color: white; font-size: 12px"
          type="primary"
          @click="amendCommunicateAuth('/setting/wx/qy/auth/communicateAuth')"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          v-if="communicateAuth"
          :flag="!flag"
          >修改</el-button
        >
      </li>
      <li class="item">
        <img src="../../../../images/wxAuth/authEnter/kehu.png" alt="" />
        <p class="auth">客户关系授权</p>
        <p class="noAuth" v-if="!clientAuth">未授权</p>
        <p class="noAuth" v-if="clientAuth">已授权</p>
        <el-button
          style="color: white; font-size: 12px"
          @click="startAuth('/setting/wx/qy/auth/clientApplicationAuth')"
          v-if="!clientAuth && communicateAuth"
          :flag="flag"
          type="primary"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          >开始绑定</el-button
        >
        <el-button
          style="color: white; font-size: 14px; background-color: #cecece"
          @click="startAuth('/setting/wx/qy/auth/clientApplicationAuth')"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          v-if="!clientAuth && !communicateAuth"
          :flag="flag"
          :type="corpId && communicateAuth ? 'primary' : 'info'"
          :disabled="!!getCommunicateAuthStatus"
          >开始绑定</el-button
        >
        <el-button
          style="color: white; font-size: 14px"
          type="primary"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          @click="amendClientApplicationAuth('/setting/wx/qy/auth/clientApplicationAuth')"
          v-if="clientAuth"
          :flag="!flag"
          >修改</el-button
        >
      </li>
      <li class="item">
        <img src="../../../../images/wxAuth/authEnter/xiaochengxu.png" alt="" />
        <p class="auth">小程序应用授权</p>
        <p class="noAuth" v-if="!mpAuth">未授权</p>
        <p class="noAuth" v-if="mpAuth">已授权</p>
        <el-button
          style="color: white; font-size: 12px"
          @click="startAuth('/setting/wx/qy/auth/mpAuth')"
          v-if="!mpAuth && clientAuth"
          :flag="flag"
          type="primary"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          >开始绑定</el-button
        >
        <el-button
          style="color: white; font-size: 14px; background-color: #cecece"
          @click="startAuth('/setting/wx/qy/auth/mpAuth')"
          v-if="!mpAuth && !clientAuth"
          :flag="flag"
          :type="corpId && clientAuth ? 'primary' : 'info'"
          :disabled="!!getClientAuthtatus"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          >开始绑定</el-button
        >
        <el-button
          style="color: white; font-size: 14px"
          type="primary"
          @click="amendMpAuth('/setting/wx/qy/auth/mpAuth')"
          :title="this.allowOperate ? '' : '暂无权限操作'"
          v-if="mpAuth"
          :flag="!flag"
          >修改</el-button
        >
      </li>
    </ul>
    <UpdateCorpId
      ref="updateCorpId"
      :submit-corp-id="submitCorpId"
      :get-company-auth-id="getCompanyAuthId"
      :wx-auth-info="wxAuthInfo"
    ></UpdateCorpId>
    <authAndRelease ref="AuthAndRelease"></authAndRelease>
  </div>
</template>

<script>
  import settingsApi from '@/dss-wechat3rd/src/api/settings';
  import UpdateCorpId from './updateCorpId';
  import service from '../../../../api';
  import { w3rdApi } from '@/register/wechat3rd';
  import authAndRelease from '@/dss-wechat3rd/src/components/auth-and-release';
  import { mapState } from 'vuex';
  import scopeMenuEnum from '@/business-common/scopeMenuEnum';
  export default {
    name: 'AuthList',
    computed: {
      ...mapState({
        roleList: 'roleList',
        wkbScopeMenu: 'wkbScopeMenu',
      }),
      // 只允许企业管理员操作
      allowOperate() {
        const editButton = scopeMenuEnum.getMenuScopeByIdentifier(
          this.wkbScopeMenu,
          scopeMenuEnum.dictionary.wkbChildMenu.wkbWxSettingMenu.wxQyButton.wx_qy_edit
        );

        if (editButton.isHasPermission) {
          return true;
        } else {
          return false;
        }
      },
    },
    components: {
      UpdateCorpId,
      authAndRelease,
    },
    mounted() {
      this.isAuthAndIsRelease();
    },
    // 进入路由时做判断
    beforeRouteEnter(to, from, next) {
      const id = from.query.id;
      next(vm => {
        // 因为当钩子执行前，组件实例还没被创建
        // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
        if (id == 5) {
          vm.globalId = id;
          console.log(vm.globalId);
          vm.updateCorpId(from.query.corpId);
        } else if (id == 6) {
          vm.globalId = id;
          console.log(vm.globalId);
          vm.bindCorpId();
        }
      });
    },
    data() {
      return {
        corpId: '', // 后台获取的corpId
        corpID: '', // 本地缓存的corpID
        communicateAuth: false,
        clientAuth: false,
        mpAuth: false,
        flag: true,
        loading: false,
        corpLoading: false,
        auth: {
          communicateSecret: '',
          clientSecret: '',
          mpSecret: '',
          mpAgentId: '',
          mpAppId: '',
        },
        globalId: null,
      };
    },
    methods: {
      isAuthAndIsRelease() {
        this.loading = true;
        w3rdApi
          .getUserTemplate({
            maType: 1,
          })
          .then(res => {
            const maAppId = res.data ? res.data.maAppId : false;
            if (maAppId) {
              const codeStatus = res.data ? res.data.codeStatus : false;
              const releaseQrCodePath = res.data ? res.data.releaseQrCodePath : false;
              if (codeStatus === 20 || releaseQrCodePath) {
                this.$nextTick(() => {
                  if (!this.globalId) {
                    try {
                      this.wxAuthInfo();
                    } catch (e) {}
                    this.getCompanyAuthId();
                  }
                });
              } else if (codeStatus === 2) {
                this.loading = false;
                const content = '检测到员工小程序正在发布，发布成功后，请再进行企业微信的绑定';
                const btnContent = '确定';
                this.$nextTick(() => {
                  this.$refs.AuthAndRelease.open(content, btnContent);
                });
              } else {
                this.loading = false;
                const content = '检测到当前员工小程序未发布版本，请先发布版本再进行企业微信设置';
                const btnContent = '去发布';
                this.$nextTick(() => {
                  this.$refs.AuthAndRelease.open(content, btnContent);
                });
              }
            } else {
              this.loading = false;
              const content = '检测到当前员工小程序未绑定，请先绑定员工小程序再进行企业微信设置';
              const btnContent = '去绑定';
              this.$nextTick(() => {
                this.$refs.AuthAndRelease.open(content, btnContent);
              });
            }
          });
      },
      getCommunicateAuthStatus() {
        let status = null;
        status = !!this.corpId && !!this.communicateAuth;
        return status;
      },
      getClientAuthtatus() {
        let status = null;
        status = this.corpId && !!this.clientAuth;
        return status;
      },
      // 点击修改corpId
      updateCorpId(corpId) {
        if (this.allowOperate) {
          this.$refs.updateCorpId.open(corpId);
          this.corpId = null;
          this.communicateAuth = false;
          this.clientAuth = false;
          this.mpAuth = false;
        }
      },
      // 绑定corpId
      bindCorpId() {
        if (this.allowOperate) {
          this.$refs.updateCorpId.open();
        }
      },
      // 提交corpId
      submitCorpId(corpID) {
        this.loading = true;
        settingsApi
          .updateCompanyAuthId({
            corpId: corpID,
          })
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: 'corpId绑定成功',
              });
            } else {
              this.$message({
                type: 'error',
                message: 'corpId绑定失败，请稍后重试',
              });
            }
          })
          .finally(() => {
            this.loading = false;
            this.getCompanyAuthId();
            this.wxAuthInfo();
          });
      },
      // 获取corpId
      getCompanyAuthId() {
        this.loading = true;
        settingsApi
          .getCompanyAuthId()
          .then(res => {
            this.corpId = res.data.corpId;
          })
          .finally(() => {
            this.loading = false;
          });
      },
      help() {
        this.$router.push({
          path: '/setting/wx/qy/clientAuth',
          query: {
            src: '../../../../images/wxAuth/startAuth.png',
            title: '按照下图选择企业ID复制',
            back: '/setting/wx/qy',
          },
        });
      },
      startAuth(path) {
        if (this.allowOperate) {
          this.$router.push({
            path,
            query: {
              flag: this.flag,
            },
          });
        }
      },
      amendCommunicateAuth(path) {
        if (this.allowOperate) {
          this.flag = false;
          this.$router.push({
            path,
            query: {
              flag: this.flag,
              secret: this.auth.communicateSecret,
            },
          });
        }
      },
      amendClientApplicationAuth(path) {
        if (this.allowOperate) {
          this.flag = false;
          this.$router.push({
            path,
            query: {
              flag: this.flag,
              secret: this.auth.clientSecret,
            },
          });
        }
      },
      amendMpAuth(path) {
        if (this.allowOperate) {
          this.flag = false;
          this.$router.push({
            path,
            query: {
              flag: this.flag,
              agentSecret: this.auth.mpSecret,
              agentId: this.auth.mpAgentId,
              mpAppId: this.auth.mpAppId,
            },
          });
        }
      },
      wxAuthInfo() {
        this.loading = true;
        settingsApi
          .getCompanyAuthCondition()
          .then(res => {
            if (res.data && res.data.length) {
              res.data.forEach(item => {
                if (item.authStatus) {
                  if (item.appType === 1) {
                    this.communicateAuth = true;
                    this.auth.communicateSecret = item.agentSecret;
                  }
                  if (item.appType === 2) {
                    this.clientAuth = true;
                    this.auth.clientSecret = item.agentSecret;
                  }
                  if (item.appType === 3) {
                    this.mpAuth = true;
                    this.auth.mpSecret = item.agentSecret;
                    this.auth.mpAgentId = item.agentId;
                    this.auth.mpAppId = item.wxMiniAppId;
                  }
                }
              });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .wrap {
    width: 1300px;
    margin: 0 auto;
  }
  .main-qy-content {
    margin-top: 16px;
    padding: 24px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.06);

    .step {
      margin-top: 49px;
      .content {
        width: 81%;
        margin: 0 auto;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .icon {
          width: 32px;
          height: 32px;
        }
        .icon-success {
          fill: #52c41a;
        }
        .icon-undone {
          fill: #dce1e6;
        }
        .content-left {
          width: 60px;
          text-align: center;
          .stepOne {
            span {
              font-size: 36px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
          }
          span {
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #717378;
            line-height: 22px;
          }
        }
        .list {
          display: flex;
          justify-content: space-around;
          position: relative;
          top: -10px;
          width: 200px;
          .item {
            width: 6px;
            height: 6px;
            background: #d8d8d8;
            border-radius: 50%;
          }
        }
        .content-right {
          width: 60px;
          text-align: center;
          .stepTwo {
            &.active {
              opacity: 1 !important;
            }
            span {
              font-size: 36px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
          }

          span {
            height: 22px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #717378;
            line-height: 22px;
          }
        }
      }
    }
    .authList {
      margin-top: 18px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-around;
      .item {
        text-align: center;
        width: 160px;
        height: 216px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.07);
        border-radius: 4px;
        img {
          width: 56px;
          height: 56px;
          margin-top: 20px;
        }
        .auth {
          margin-top: 15px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 400;
          color: @ui-font-color-black;
        }
        .noAuth {
          margin-bottom: 12px;
          margin-top: 4px;
          height: 22px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #a1a4ab;
          line-height: 22px;
        }
      }
    }
    .explain {
      position: relative;
      padding: 20px;
      color: #303133;
      background: #f5f7fa;
    }
  }
</style>
