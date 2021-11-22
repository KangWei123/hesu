<template>
  <div class="wrap" v-loading="loading">
    <p class="mainTitle">小程序应用授权</p>
    <div class="step">
      <div class="content">
        <div class="content-left">
          <div class="stepOne">
            <span>1</span>
          </div>
          <span>第一步</span>
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
          <div class="stepTwo">
            <span>2</span>
          </div>
          <span>第二步</span>
        </div>
      </div>
    </div>
    <span class="title">AgentId绑定</span>
    <el-input
      placeholder="请复制关联小程序AgentId"
      style="width: 390px;height: 45px;margin-left:50px"
      v-model.trim="AgentId"
    />
    <br>
    <span class="title">Secret绑定</span>
    <el-input
      placeholder="请复制关联小程序Secret"
      style="width: 390px;height: 45px;margin-left:50px"
      v-model.trim="SecretId"
    />
    <span class="title">AppId绑定</span>
    <el-input
      placeholder="请复制企业微信小程序AppID"
      style="width: 390px;height: 45px;margin-left:50px"
      v-model.trim="wxMiniAppId"
    />
    <br>
    <div class="confirmBtn">
      <el-button type="info" class="cancel" style="background:rgba(56,121,251,0.06);border-radius:15px;border:1px solid rgba(56,121,251,1);color: #3879FB" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirmCommit" v-if="flag" style="margin-left: 17px;background-color: #3879FB">确认提交</el-button>
      <el-button type="primary" @click="confirmAmend" v-if="!flag" style="margin-left: 17px;background-color: #3879FB">确认修改</el-button>
    </div>
    <p class="help">
      <span  style="color:#3879FB;margin-left: 20px" @click="help" class="hint">怎样查看小程序应用Secret及AgentId?</span>
      <img src="../../../../../images/marketing/message/question.png" alt="" class="img">
    </p>
  </div>

</template>

<script>
  import settingsApi from '@/dss-wechat3rd/src/api/settings';
  import { mapActions } from 'vuex';
  export default {
    name: 'mpAuth',
    data() {
      return {
        AgentId: '',
        SecretId: '',
        loading: false,
        flag: null,
        wxMiniAppId: ''
      };
    },
    mounted() {
      this.getCompanyId();
      this.flag = this.$route.query.flag;
      this.SecretId = this.$route.query.agentSecret;
      this.AgentId = this.$route.query.agentId;
      this.wxMiniAppId = this.$route.query.mpAppId;
    },
    methods: {
      ...mapActions(['getCompanyId']),
      help() {
        this.$router.replace({
          path: '/setting/wx/qy/clientAuth',
          query: {
            src: '../../../../images/wxAuth/mpAuth.png',
            title: '第一步，进入企业微信，点击应用管理，选择对应的小程序；',
            back: '/setting/wx/qy/auth/mpAuth',
            flag: this.flag,
            agentSecret: this.SecretId,
            agentId: this.AgentId,
            mpAppId: this.wxMiniAppId
          }
        });
      },
      cancel() {
        this.$router.replace('/setting/wx/qy/authList');
      },
      confirmCommit() {
        if (this.AgentId && this.SecretId) {
          this.loading = true;
          settingsApi
            .addCompanyAuthInformation({
              appType: 3,
              AgentId: this.AgentId,
              agentSecret: this.SecretId,
              wxMiniAppId: this.wxMiniAppId
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '添加小程序AgentId与小程序Secret成功',
                  type: 'success'
                });
                this.loading = false;
                this.$router.push({
                  path: '/setting/wx/qy/authReturn',
                  query: {
                    id: 2
                  }
                });
              } else {
                this.loading = false;
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          this.$message.error('请输入AgentId和SecretId后在提交');
        }
      },
      confirmAmend() {
        if (this.AgentId && this.SecretId) {
          this.loading = true;
          settingsApi
            .updateCompanyAuthInformation({
              appType: 3,
              AgentId: this.AgentId,
              agentSecret: this.SecretId,
              wxMiniAppId: this.wxMiniAppId
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '修改小程序AgentId与小程序Secret成功',
                  type: 'success'
                });
                this.$router.push({
                  path: '/setting/wx/qy/authReturn',
                  query: {
                    id: 2
                  }
                });
              } else {
                this.loading = false;
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          this.loading = false;
          this.$message.error('请输入AgentId和SecretId后在提交修改');
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .wrap{
    margin: 50px auto;
    position: relative;
    width: 500px;
    .mainTitle{
      position: absolute;
      background: white;
      font-size: 18px;
      width: 100%;
      top: -190px;
      padding-left: 10px;
      left: 0;
      color: grey;
    }
    .step{
      margin-bottom: 80px;
      .content{
        width:350px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content-left{
          width: 60px;
          text-align: center;
          .stepOne{
            width: 60px;
            height: 60px;
            background:linear-gradient(270deg,rgba(38,184,255,1) 0%,rgba(56,121,251,1) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 75px;
            margin-bottom: 6px;
            span{
              font-size:36px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(255,255,255,1);
            }
          }
          span{
            height:22px;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:22px;
          }
        }
        .list{
          display: flex;
          justify-content: space-around;
          width: 200px;
          position: relative;
          top: -10px;
          .item{
            width:8px;
            height:8px;
            background:rgba(221,221,221,1);
            border-radius: 50%;
          }
        }
        .content-right{
          width: 60px;
          text-align: center;
          .stepTwo{
            width:60px;
            height:60px;
            background:linear-gradient(270deg,rgba(38,184,255,.5) 0%,rgba(56,121,251,0.5) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 75px;
            margin-bottom: 6px;
            span{
              font-size:36px;
              font-family:PingFangSC-Semibold,PingFang SC;
              font-weight:600;
              color:rgba(255,255,255,1);
            }
          }
          span{
            height:22px;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            font-weight:400;
            color:rgba(51,51,51,1);
            line-height:22px;
          }
        }
      }
    }
    .title{
      width: 92px;
      margin: 20px 0 10px 50px;
      display: inline-block;
    }
    /deep/ .el-input__inner{
      height: 45px;
      line-height: 45px;
    }
    .confirmBtn{
      margin-top: 30px;
      width: 100%;
      text-align: center;
      margin-bottom: 20px;
      .cancel{
        color: white;
        border: 1px solid white;
      }
    }
    .help{
      .hint{
        cursor: pointer;
        font-size: 12px;
        &:hover{
          text-decoration: underline;
        }
      }
      text-align: center;
      .img{
        width: 20px;
        height: 20px;
        position: relative;
        top: 4px;
        left: 2px;
      }
    }

  }
</style>
