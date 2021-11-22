<template>
  <div class="wrap" v-loading="loading">
    <p class="mainTitle">客户联系授权</p>
    <div class="step">
      <div class="content">
        <div class="content-left">
          <div class="stepOne">
            <span>1</span>
          </div>
          <span>第一步</span>
        </div>
        <ul class="list">
          <li class="item" v-for="(item, index) in list" :key="index"></li>
        </ul>
        <div class="content-right">
          <div class="stepTwo">
            <span>2</span>
          </div>
          <span>第二步</span>
        </div>
      </div>
    </div>
    <p class="title">客户联系Secret绑定</p>
    <br />
    <el-input
      placeholder="请复制客户联系Secret黏贴输入"
      style="width: 390px; height: 45px; margin-right: 20px"
      v-model.trim="clientApplicationAuth"
    />
    <span style="color: #3879fb" @click="help" class="help">怎样查看客户联系Secret?</span>
    <img src="../../../../images/question.png" alt="" class="img" />
    <div class="confirmBtn">
      <el-button
        class="cancel"
        @click="cancel"
        style="
          background: rgba(56, 121, 251, 0.06);
          border: 1px solid rgba(56, 121, 251, 1);
          color: rgba(56, 121, 251, 1);
          width: 100px;
        "
        >取消</el-button
      >
      <el-button
        type="primary"
        @click="confirmCommit"
        v-if="flag"
        style="width: 100px; background: rgba(56, 121, 251, 1); margin-left: 17px"
        >确认提交</el-button
      >
      <el-button
        type="primary"
        @click="confirmAmend"
        v-if="!flag"
        style="width: 100px; background: rgba(56, 121, 251, 1); margin-left: 17px"
        >确认修改</el-button
      >
    </div>
  </div>
</template>

<script>
  import settingsApi from '@/mod-console/src/api/settings';
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'CommunicateAuth',
    data() {
      return {
        clientApplicationAuth: '',
        loading: false,
        list: [1, 2, 3, 4, 5, 6],
        flag: null,
      };
    },
    mounted() {
      this.getCompanyId();
      this.clientApplicationAuth = this.$route.query.secret;
      this.flag = this.$route.query.flag;
    },
    methods: {
      ...mapActions(['getCompanyId']),
      help() {
        this.$router.push({
          path: '/setting/wx/qy/clientAuth',
          query: {
            src: '../../../../images/wxAuth/Group.png',
            title: '第一步进入企业微信，选择客户联系，点击API按钮',
            back: '/setting/wx/qy/auth/clientApplicationAuth',
            flag: this.flag,
            secret: this.clientApplicationAuth,
          },
        });
      },
      cancel() {
        this.$router.replace('/setting/wx/qy/authList');
      },
      confirmCommit() {
        if (this.clientApplicationAuth) {
          this.loading = true;
          settingsApi
            .addCompanyAuthInformation({
              appType: 2,
              agentSecret: this.clientApplicationAuth,
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '添加通讯录Secret成功',
                  type: 'success',
                });
                this.loading = false;
                this.$router.push({
                  path: '/setting/wx/qy/authReturn',
                  query: {
                    id: 1,
                  },
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
          this.$message.error('请输入客户联系Secret在提交');
        }
      },
      confirmAmend() {
        if (this.clientApplicationAuth) {
          this.loading = true;
          settingsApi
            .updateCompanyAuthInformation({
              corpId: this.companyId,
              appType: 2,
              agentSecret: this.clientApplicationAuth,
            })
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '修改客户联系Secret成功',
                  type: 'success',
                });
                this.loading = false;
                this.$router.push({
                  path: '/setting/wx/qy/authReturn',
                  query: {
                    id: 1,
                  },
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
          this.$message.error('请输入客户联系Secret在提交修改');
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .wrap {
    position: relative;
    margin: 50px auto 0 auto;
    width: 720px;
    text-align: center;
    .mainTitle {
      position: absolute;
      background: white;
      font-size: 18px;
      width: 100%;
      top: -190px;
      padding-left: 10px;
      left: 0;
      color: grey;
    }
    .step {
      .content {
        width: 400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .content-left {
          width: 60px;
          text-align: center;
          .stepOne {
            width: 60px;
            height: 60px;
            background: linear-gradient(270deg, rgba(38, 184, 255, 1) 0%, rgba(56, 121, 251, 1) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 75px;
            margin-bottom: 6px;
            span {
              font-size: 36px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
          }
          span {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 22px;
          }
        }
        .list {
          display: flex;
          justify-content: space-around;
          width: 200px;
          position: relative;
          top: -10px;
          .item {
            width: 8px;
            height: 8px;
            background: rgba(221, 221, 221, 1);
            border-radius: 50%;
          }
        }
        .content-right {
          width: 60px;
          text-align: center;
          .stepTwo {
            width: 60px;
            height: 60px;
            background: linear-gradient(270deg, rgba(38, 184, 255, 0.5) 0%, rgba(56, 121, 251, 0.5) 100%);
            border-radius: 50%;
            text-align: center;
            line-height: 75px;
            margin-bottom: 6px;
            span {
              font-size: 36px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
            }
          }
          span {
            height: 22px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 22px;
          }
        }
      }
    }
    .title {
      display: inline-block;
      width: 100%;
      text-align: left;
      margin: 50px 0 10px 68px;
    }
    /deep/ .el-input__inner {
      height: 45px;
      line-height: 45px;
    }
    .help {
      cursor: pointer;
      font-size: 12px;
      &:hover {
        text-decoration: underline;
      }
    }
    .img {
      position: relative;
      top: 4px;
      left: 2px;
      width: 20px;
      height: 20px;
    }
    .confirmBtn {
      margin-top: 50px;
      width: 100%;
      text-align: center;
      .cancel {
        color: white;
        border: 1px solid white;
      }
    }
  }
</style>
