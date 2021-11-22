<template>
    <div class="startAuth" >
      <p class="title">通讯录授权</p>
      <div class="content"  v-if="startAuth">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/startAuth.png" alt="" v-if="startAuth">
      </div>
      <div class="content"  v-if="commumicationAuth">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/commumicationAuth.png" alt="" v-if="commumicationAuth">
      </div>
      <div v-if="clientAuth" class="content">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/Group.png" alt="">
        <p class="subTitle">第二步选择Secret点击复制，粘贴到惟客平台</p>
        <img src="../../../../images/wxAuth/Group2.png" alt="">
      </div>
      <div v-if="mpAuth" class="content">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/mpAuth.png" alt="">
        <p class="subTitle">第二步： 进入应用，依次复制对应的字段信息；</p>
        <img src="../../../../images/wxAuth/mpAuth2.png" alt="">
      </div>
      <div v-if="serverAuth" class="content">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/serverAuth.png" alt="">
        <p class="subTitle">第二步，依次从惟客平台复制URL、Token、EncodingAESKey依次粘贴复制，并将所有接收消息勒事件类型勾选，并点击保存；</p>
        <img src="../../../../images/wxAuth/serverAuth2.png" alt="">
      </div>
      <div v-if="communicationReturn" class="content">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/communicationReturn1.png" alt="">
        <p class="subTitle">第二步，依次从惟客平台复制URL、Token、EncodingAESKey依次粘贴复制，并将所有接收消息勒事件类型勾选，并点击保存；</p>
        <img src="../../../../images/wxAuth/communicationReturn2.png" alt="">
      </div>
      <div v-if="clientAuthReturn1" class="content">
        <p class="subTitle">{{title}}</p>
        <img src="../../../../images/wxAuth/clientAuthReturn1.png" alt="">
        <p class="subTitle">第二步，依次从惟客平台复制URL、Token、EncodingAESKey依次粘贴复制，并将所有接收消息勒事件类型勾选，并点击保存；</p>
        <img src="../../../../images/wxAuth/clientAuthReturn2.png" alt="">
      </div>
      <div class="goBack">
        <el-button type="primary" round @click="goBack" style="background:#3879FB;width:100px;height:30px;margin-top: 20px;margin-bottom: 30px">返回</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'client-auth',
    data() {
      return {
        src: '',
        title: '',
        startAuth: false,
        commumicationAuth: false,
        clientAuth: false,
        mpAuth: false,
        serverAuth: false,
        communicationReturn: false,
        clientAuthReturn1: false,
        path: '',
        id: null
      };
    },
    created() {
      switch (this.$route.query.src) {
        case '../../../../images/wxAuth/startAuth.png':
          this.startAuth = true;
          break;
        case '../../../../images/wxAuth/commumicationAuth.png':
          this.commumicationAuth = true;
          break;
        case '../../../../images/wxAuth/Group.png':
          this.clientAuth = true;
          break;
        case '../../../../images/wxAuth/mpAuth.png':
          this.mpAuth = true;
          break;
        case '../../../../images/wxAuth/serverAuth.png':
          this.serverAuth = true;
          break;
        case '../../../../images/wxAuth/communicationReturn1.png':
          this.communicationReturn = true;
          break;
        case '../../../../images/wxAuth/clientAuth1.png':
          this.clientAuthReturn1 = true;
          break;
      }
      this.title = this.$route.query.title;
      this.path = this.$route.query.back;
      this.id = this.$route.query.id;
    },
    methods: {
      goBack() {
        const corpId = this.$route.query.corpId;
        const flag = this.$route.query.flag ? this.$route.query.flag : false;
        const secret = this.$route.query.secret ? this.$route.query.secret : '';
        const agentId = this.$route.query.agentId ? this.$route.query.agentId : '';
        const agentSecret = this.$route.query.agentSecret ? this.$route.query.agentSecret : '';
        const mpAppId = this.$route.query.mpAppId ? this.$route.query.mpAppId : '';
        this.$router.push({
          path: this.path,
          query: {
            id: this.id,
            corpId,
            flag,
            secret,
            agentId,
            agentSecret,
            mpAppId
          }
        });
      }
    }
  };
</script>

<style lang="less" >
  .startAuth{
    position: relative;
    overflow-x: hidden;
    .title{
      position: absolute;
      background: white;
      font-size: 18px;
      width: 100%;
      top: -80px;
      padding-left: 10px;
      left: 0;
      color: grey;
    }
    .content{
      text-align: center;
      .subTitle{
        text-align: center;
        font-size:16px;
        font-family:PingFangSC-Regular,PingFang SC;
        font-weight:400;
        color:rgba(51,51,51,1);
        line-height:22px;
        margin-top: 40px;
        margin-bottom:33px;
      }
      img{
        width:750px;
        height:502px;
      }
    }
    .goBack{
      width: 100%;
      text-align: center;
    }
  }

  .real-content{
    overflow-x: hidden;
  }
</style>
