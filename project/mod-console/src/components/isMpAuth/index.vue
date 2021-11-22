<template>
  <div class="wrap">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="540px" :before-close="handleClose">
      <p class="subTitle">当前尚未进行企业微信授权，请优先进行企业微信授权，点击确认跳转至企业微信授权</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirm" round style="border-radius: 15px">确 定</el-button>
        <el-button @click="cancel" round style="border-radius: 15px">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Index',
    data() {
      return {
        dialogVisible: false,
      };
    },
    methods: {
      handleClose() {
        this.close();
      },
      cancel() {
        this.close();
      },
      close() {
        this.dialogVisible = false;
      },
      confirm() {
        this.$router.push({
          path: '/setting/wx/qy',
        });
      },
      open() {
        this.dialogVisible = true;
      },
    },
  };
</script>

<style scoped lang="less">
  .wrap {
    /deep/ .el-dialog__body {
      text-align: center;
      .subTitle {
        margin: 86px auto 0 auto;
        display: inline-block;
        font-size: 16px;
        text-align: center;
        width: 355px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
      }
    }

    /deep/ .el-dialog__header {
      background-color: #f4f4f4;
      height: 61px;
      padding: 0;
      /deep/ .el-dialog__title {
        font-size: 14px;
        display: inline-block;
        font-family: PingFangSC-Regular, PingFang SC;
        margin: 20px 0 0 20px;
      }
    }

    .dialog-footer {
      text-align: center;
      width: 100%;
      display: inline-block;
      margin-top: 85px;
    }
  }
</style>
