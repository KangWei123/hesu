<template>
    <div class="wrap" v-loading="loading">
      <div class="step">
        <div class="content">
          <div class="content-left">
            <div class="stepOne">
              <span>✔</span>
            </div>
            <span>已完成</span>
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
        <ul class="itemOne" >
          <li class="listOne">
            <p class="title">URL</p>
            <el-input style="width: 390px;height: 45px" :placeholder="eventNotifyUrl"  :value="eventNotifyUrl" id="foo1" />
            <el-button style="width: 180px;height: 45px;background:#1D5FE4;margin-left: 17px;border-radius: 0 " ref="copyOne"  data-clipboard-target="#foo1" @click="copyOne">复制URL</el-button>
          </li>
          <li class="listOne">
            <p class="title">Token</p>
            <el-input style="width: 390px;height: 45px" :placeholder="eventNotifyToken" :value="eventNotifyToken" id="foo2" />
            <el-button style="width: 180px;height: 45px;background:#1D5FE4;margin-left: 17px;border-radius: 0" ref="copyTwo"  data-clipboard-target="#foo2" @click="copyTwo">复制Token</el-button>
          </li>
          <li class="listOne">
            <p class="title">EncodingAESKey</p>
            <el-input style="width: 390px;height: 45px" :placeholder="eventNotifyKey" :value="eventNotifyKey" id="foo3" />
            <el-button style="width: 180px;height: 45px;background:#1D5FE4;margin-left: 17px;border-radius: 0 " ref="copyThr"  data-clipboard-target="#foo3" @click="copyThr">复制EncodingAESKey</el-button>
          </li>
        </ul>
      <div class="btn">
        <el-button type="primary" round @click="completeReturn" style="background:#3879FB;margin-top: 30px;padding: 0 26px" size="medium">完成返回</el-button>
        <br>
        <span class="subContent" @click="help" >怎么设置接收事件服务器？</span>
        <img src="../../../../images/marketing/message/question.png" alt="" class="img">
      </div>
    </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import Clipboard from 'clipboard';
  import settingsApi from '@/dss-wechat3rd/src/api/settings';
  export default {
    name: 'authReturn',
    mounted() {
      this.copyBtnOne = new Clipboard(this.$refs.copyOne.$el);
      this.copyBtnTwo = new Clipboard(this.$refs.copyTwo.$el);
      this.copyBtnThr = new Clipboard(this.$refs.copyThr.$el);
      this.id = this.$route.query.id;
      this.loading = true;
      settingsApi
        .getCompanyAuthCondition()
        .then(res => {
          this.eventNotifyUrl = res.data[this.id].eventNotifyUrl;
          this.eventNotifyToken = res.data[this.id].eventNotifyToken;
          this.eventNotifyKey = res.data[this.id].eventNotifyKey;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    methods: {
      help() {
        const id = this.id;
        if (this.id == 0) {
          this.$router.push({
            path: '/setting/wx/qy/clientAuth',
            query: {
              src: '../../../../images/wxAuth/communicationReturn1.png',
              title: '第一步，进入企业微信，点击管理工具，选择接收事件服务器',
              back: '/setting/wx/qy/authReturn',
              id
            }
          });
        } else if (this.id == 1) {
          this.$router.push({
            path: '/setting/wx/qy/clientAuth',
            query: {
              src: '../../../../images/wxAuth/clientAuth1.png',
              title: '第一步，点击接收服务器设置，进入设置详情页面；',
              back: '/setting/wx/qy/authReturn',
              id
            }
          });
        } else if (this.id == 2) {
          this.$router.push({
            path: '/setting/wx/qy/clientAuth',
            query: {
              src: '../../../../images/wxAuth/serverAuth.png',
              title: '第一步，进入对应的小程序，选择设置API接收',
              back: '/setting/wx/qy/authReturn',
              id
            }
          });
        }
      },
      completeReturn() {
        this.$router.replace('/setting/wx/qy/authList');
      },
      ...mapActions(['getCompanyId']),
      copyOne() {
        const clipboard = this.copyBtnOne;
        clipboard.on('success', () => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
        });
        clipboard.on('error', () => {
          this.$message({
            message: '复制失败，请重新复制',
            type: 'error'
          });
        });
      },
      copyTwo() {
        const clipboard = this.copyBtnTwo;
        clipboard.on('success', () => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
        });
        clipboard.on('error', () => {
          this.$message({
            message: '复制失败，请重新复制',
            type: 'error'
          });
        });
      },
      copyThr() {
        const clipboard = this.copyBtnThr;
        clipboard.on('success', () => {
          this.$message({
            message: '复制成功',
            type: 'success'
          });
        });
        clipboard.on('error', () => {
          this.$message({
            message: '复制失败，请重新复制',
            type: 'error'
          });
        });
      }
    },
    data() {
      return {
        copyBtnOne: null,
        copyBtnTwo: null,
        copyBtnThr: null,
        eventNotifyUrl: '',
        eventNotifyToken: '',
        eventNotifyKey: '',
        id: null,
        loading: false
      };
    }
  };
</script>

<style scoped lang="less">
  .wrap{
    width: 720px;
    margin: 40px auto 0 auto;
    .step{
      .content{
        width:400px;
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
      }
    }
    .itemOne{
      text-align: center;
      margin-top: 50px;
      .listOne{
        margin-bottom: 20px;
        .title{
          margin-bottom: 10px;
          text-align: left;
          margin-left: 65px;
          background:rgba(255,255,255,1);
          border-radius:4px;
        }
        /deep/.el-input__inner{
          height: 45px;
          line-height: 45px;
        }
      }
    }
    .btn{
      text-align: center;
     /*/deep/ .el-button{
       padding: 3px 26px;
     }*/
      .subContent{
        color: #3879FB;
        margin-top:28px;
        display: inline-block;
        &:hover{
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .img{
        position: relative;
        top: 2px;
        width: 20px;
        height: 20px;
      }
    }
  }

</style>
