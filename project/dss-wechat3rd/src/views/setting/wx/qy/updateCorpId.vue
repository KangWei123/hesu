<template>
  <div class="wrap">
    <el-dialog
      title="已绑定corpId"
      :visible.sync="dialogVisible"
      width="540px"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div class="content" v-if="corpId">
        <p class="title">已绑定ID</p>
        <el-input :placeholder="corpId" style="margin-top: 10px" v-model.trim="corpID"></el-input>
        <div class="help">
          <p>
            <span  style="color:#3879FB;margin-left: 20px"  class="hint" @click="help(5)">怎样查看企业ID？</span>
            <img src="../../../../images/marketing/message/question.png" alt="" class="img">
          </p>
        </div>
      </div>
      <div class="content" v-if="!corpId">
        <p class="title">企业微信企业ID绑定</p>
        <el-input placeholder="请复制企业ID粘贴输入" style="margin-top:10px" v-model.trim="corpID"></el-input>
        <div class="help">
          <p>
            <span  style="color:#3879FB;margin-left: 20px"  class="hint" @click="help(6)">怎样查看企业ID？</span>
            <img src="../../../../images/marketing/message/question.png" alt="" class="img">
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" >
      <el-button type="primary" @click="confirm" style="border-radius: 15px;background-color: #3879FB" v-if="!corpId">确 定</el-button>
      <el-button type="primary" @click="save" style="border-radius: 15px;background-color: #3879FB" v-if="corpId">保 存</el-button>
      <el-button @click="cancel"  style="border-radius: 15px">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'updateCorpId',
    data() {
      return {
        dialogVisible: false,
        corpId: '',
        corpID: ''
      };
    },
    props: {
      submitCorpId: Function,
      getCompanyAuthId: Function,
      wxAuthInfo: Function
    },
    methods: {
      // 跳转至帮助页面
      help(id) {
        this.$router.replace({
          path: '/setting/wx/qy/clientAuth',
          query: {
            src: '../../../../images/wxAuth/startAuth.png',
            title: '进入企业微信，点击我的企业，选择企业ID；',
            back: '/setting/wx/qy',
            id,
            corpId: this.corpId
          }
        });
      },
      open(corpId) {
        this.dialogVisible = true;
        this.corpId = corpId;
        this.corpID = corpId;
      },
      save() {
        if (this.corpID) {
          this.submitCorpId(this.corpID);
          this.close();
        } else {
          this.$message({
            type: 'warning',
            message: '请粘贴输入corpId'
          });
        }
      },
      close() {
        this.dialogVisible = false;
        this.corpID = '';
      },
      confirm() {
        if (this.corpID) {
          this.submitCorpId(this.corpID);
          this.close();
        } else {
          this.$message({
            type: 'warning',
            message: '请粘贴输入corpId'
          });
        }
      },
      cancel() {
        this.close();
        this.getCompanyAuthId();
        this.wxAuthInfo();
      },
      handleClose() {
        this.getCompanyAuthId();
        this.close();
      }
    }
  };
</script>

<style scoped lang="less">
  .wrap{
    /deep/ .el-dialog__header{
      height:61px;
      line-height: 61px;
      padding: 0 0 0 20px;
      background:rgba(244,244,244,1);
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
    }
    /deep/ .el-dialog__footer{
      margin-top: 100px;
      text-align: center;
    }
  }

.content{
  width: 390px;
  margin: 50px auto 0 auto;
  .title{
    font-weight:400;
    color:rgba(51,51,51,1);
    font-size:16px;
    font-family:PingFangSC-Regular,PingFang SC;
  }
  .help{
    margin-top: 10px;
    width: 100%;
    font-size: 12px;
    p{
      float: right;
      span{
        &:hover{
          text-decoration: underline;
          cursor: pointer;
        }
      }
      img{
        width: 20px;
        height: 20px;
        position: relative;
        top: 4px;
      }
    }
  }
}
 /deep/ .el-dialog__footer{
  padding-bottom: 0;
  .dialog-footer{
    margin-bottom: 58px;
    display: inline-block;
  }
}


</style>
