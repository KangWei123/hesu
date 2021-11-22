<template>
  <el-dialog
    class="dss-dialog dss-upload dss-upload-dialog"
    :title="title"
    :visible.sync="show"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-upload
      ref="upload"
      :auto-upload="autoUpload"
      accept=".xls,.xlsx"
      :data="params"
      :on-success="onFileSuccess"
      :on-error="onFileError"
      :before-upload="onBeforeUpload"
      class="upload-item"
      :action="uploadServerUrl"
      :limit="limit"
      multiple
    >
      <span class="upload-btn"> <wk-icon name="icon-upload" class="wk-icon" />上传文件</span>
    </el-upload>

    <div class="template">
      <span class="upload-tip">
        请上传您需要的文件，支持扩展名：xls、xlsx
        <span v-if="limit"> ，最多上传{{ limit }}个文件 </span>
      </span>
      <span class="template-desc"
        >{{ templateDesc
        }}<a class="template-download" target="_blank" v-if="needTemplate" :href="templateDownUrl">模版下载</a></span
      >
    </div>

    <div class="fail-message">
      <div :style="{ color: errorCode == null ? 'green' : 'red' }" v-html="tipMessage"></div>
    </div>

    <div class="dialog-footer">
      <el-button @click="clickCancel">取 消</el-button>
      <el-button :disabled="!existFile && autoUpload" v-loading="submitting" type="primary" @click="toSubmit">
        确 认
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      // 是否可见
      visible: {
        type: Boolean,
        default: false,
      },
      // 任务标题
      title: {
        type: String,
        default: '导入',
      },
      // 最大上传个数
      limit: {
        type: Number,
        default: null,
      },

      // 额外参数
      params: {
        type: Object,
        default: function () {
          return {};
        },
      },

      // 模版下载地址描述
      templateDesc: {
        type: String,
        default: '您可以下载我们提供的模版，批量编辑门店信息进行管理。',
      },
      // 是否需要下载模板
      needTemplate: {
        type: Boolean,
        default: true,
      },
      // 模版下载地址
      templateDownUrl: {
        type: String,
        default: '#',
      },
      // 上传地址
      uploadServerUrl: {
        type: String,
        default: 'http://127.0.0.1',
      },
      // 成功后是否提示
      hintSubmit: {
        type: Boolean,
        default: true,
      },
      // 是否自动上传
      autoUpload: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        // 提交中
        submitting: false,
        existFile: false,

        // 上传错误信息
        tipMessage: null,
        errorCode: -1,
      };
    },

    watch: {
      visible(val) {
        if (val) {
          if (this.autoUpload) {
            this.clearFiles();
          }
          this.getUploadPromise(true);
          this.submitting = false;
        }
      },
    },

    mounted() {
      this.getUploadPromise(true);
    },

    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
          if (!val) {
            this.tipMessage = null;
            this.errorCode = -1;
          }
        },
      },
    },

    methods: {
      getUploadPromise(force = false) {
        if (force || !this._promise) {
          this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
          });
        }
        return this._promise;
      },

      setUploadEnd(success) {
        this.existFile = false;
        this.submitting = false;
        success && this._resolve && this._resolve();
        !success && this._reject && this._reject();
        this.clearFiles();
        this.getUploadPromise(true);
      },

      onFileSuccess(response, file, fileList) {
        if (response.success) {
          if (this.hintSubmit) {
            this.$message({
              message: file.name + '导入成功! ',
              type: 'success',
            });
            this.tipMessage = response.data;
          }

          this.errorCode = null;
        } else {
          this.$message({
            message: response.msg || file.name + ' 上传失败。' + (this.errorCode === 1001 ? response.errorMessage : ''),
            type: 'error',
          });

          this.tipMessage = response.errorMessage ? response.errorMessage.replace(/\n/g, '</br>') : '';
          this.tipMessage = this.tipMessage + '</br>';
          this.errorCode = response.errorCode;
          this.setUploadEnd(false);

          return;
        }

        const uploading = fileList.find(f => f.percentage !== 100);
        if (!uploading) {
          this.setUploadEnd(true);
          this.$emit('upload-success', this.hintSubmit ? response.errorMessage : response);
          // this.show = false;
        }
      },

      onFileError(err, file, fileList) {
        if (fileList.length === 0) {
          this.setUploadEnd(false);
        }
        this.$message.error(file.name + ' 上传失败');
      },

      onBeforeUpload(file) {
        const errMsg = this.checkFile(file);
        if (errMsg) {
          this.$message({ message: errMsg, type: 'warning' });
          return false;
        }
        this.existFile = true;
        return this.getUploadPromise();
      },

      checkFile(file) {
        let upName;
        if (!!file.name && !!(upName = file.name.toUpperCase())) {
          if (upName.indexOf('.XLS') <= 0 && upName.indexOf('.XLSX') <= 0) {
            return '上传文件请选中EXCEL文件！';
          }
        }
      },

      toSubmit() {
        if (this.submitting) {
          return;
        }

        if (!this.existFile && this.autoUpload) {
          this.$message({
            message: '没有文件被选择，请选择上传的文件',
            type: 'warning',
          });
          return;
        }

        if (this.autoUpload) {
          this.getUploadPromise();
          this._resolve();
          this.submitting = true;
        } else {
          this.show = false;
        }
      },

      /**
       * 当需要手动上传时，调用该方法:autoUpload = false
       */
      manualSubmit() {
        if (this.submitting) {
          return;
        }

        const upload = this.$refs.upload;
        if (upload) {
          upload.submit();
        }
        if (!this.existFile) {
          this.$message({
            message: '没有文件被选择，请选择上传的文件',
            type: 'warning',
          });
          return;
        }
        this.getUploadPromise();
        this._resolve();
        this.submitting = true;
      },

      clearFiles() {
        const upload = this.$refs.upload;
        if (upload && upload.clearFiles) {
          upload.clearFiles();
        }
      },

      clickCancel() {
        this.show = false;
      },
    },
  };
</script>

<style rel="stylesheet/less" lang="less">
  .dss-upload {
    .fail-message {
      max-height: 500px;
      overflow: auto;
      text-align: left;
      padding: 0 20px;
    }
  }

  .dss-upload .el-dialog {
    width: 480px;
  }

  .dss-upload-dialog {
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 25px;
      text-align: center;

      .el-upload-list__item-name {
        margin-right: 0;
      }
    }

    .el-dialog__title {
      color: @ui-font-color-black;
    }

    .template {
      font-family: PingFangSC-Regular;
      margin-bottom: 23px;

      .template-desc {
        height: 20px;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: @ui-font-color-darkGrey;
        line-height: 20px;
        margin-top: 8px;
        display: block;
        width: 100%;
      }

      .template-download {
        color: @ui-function-color-link;
      }
    }

    .dialog-footer {
      padding-top: 10px;

      .el-button {
        width: 80px;
        height: 36px;
        line-height: 36px;
        padding: 0;
      }

      .el-button--primary {
        span {
          color: #fff;
        }
      }

      .el-button--primary.is-disabled {
        background: #f0f2f5;
        border: 1px solid #dce1e6;

        span {
          color: #a1a4ab;
        }
      }
    }

    .upload-item {
      background: #fff;
      border-radius: 5px;
      margin-bottom: 18px;
    }

    .el-upload {
      height: 36px;
      line-height: 36px;
      text-align: center;
    }

    .upload-tip {
      font-size: 12px;
      color: @ui-font-color-darkGrey;
      letter-spacing: 0;
      text-align: center;
      width: 100%;

      span {
        display: inline !important;
      }
    }

    .upload-btn {
      // float: right;
      border: 1px solid #dce1e6;
      border-radius: 4px;
      font-size: 11px;
      color: @ui-font-color-black;
      letter-spacing: 0;
      width: 100px;
      height: 34px;
      line-height: 36px;
      display: inline-block;
      // color: @ui-theme-color-orange;

      .wk-icon {
        position: relative;
        top: 3px;
        fill: #717378;
        width: 18px;
        height: 18px;
      }

      .el-icon-upload2 {
        width: 17px;
        height: 34px;
        font-size: 17px;
        line-height: 34px;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
  }
</style>
