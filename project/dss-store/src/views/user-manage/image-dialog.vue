<template>
  <el-dialog
    title="图片搜索"
    class="editor-dialog"
    :visible.sync="showEditor"
    width="500px"
    append-to-body
    :before-close="closeHandler"
  >
    <div class="img-from">
      <div class="image-box">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          :class="file.url ? 'none' : ''"
          :action="url"
          :data="params"
          list-type="picture-card"
          :auto-upload="false"
          :show-file-list="false"
          accept=".jpg, .jpeg"
          name="file"
          :on-change="handleAvatarChange"
        >
          <!-- :on-success="handleAvatarSuccess"
                   :before-upload="beforeAvatarUpload"
                   :on-change="handleAvatarChange"> -->

          <img class="avatar" :src="file.url" v-if="file.url" />

          <i v-else class="el-icon-plus avatar-uploader-icon"></i>

          <a href="javascript:void (0);" class="dss-link again" v-if="file.url">重新上传</a>
        </el-upload>
      </div>

      <div class="upload-text">支持jpeg，jpg格式，像素最小100*100px，照片大小不超过3M</div>

      <div class="error-content">
        <span v-if="!isSure"> {{ errorMessage }}</span>
      </div>

      <div class="btn-box">
        <el-button type="primary" size="mini" @click="choosedImg" class="search-btn img-btn" :disabled="!isSure"
          >确认</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import cameraFlowApi from '@/dss-common/api/camera-flow.js';
  import utils from '@/dss-common/utils/date.js';

  export default {
    name: 'ImageDialog',
    components: {},
    props: {
      // 是否弹窗
      showEditor: {
        type: Boolean,
        default: false,
      },
      // 关闭弹窗函数
      closeHandler: {
        type: Function,
      },
    },
    watch: {
      userData: {
        deep: true,
        handler() {},
      },
    },
    data() {
      return {
        isSure: false,
        list: null,
        params: {},
        url: cameraFlowApi.API_UPLOAD_IMG,
        errorMessage: '',
        file: {},
      };
    },
    mounted() {},
    methods: {
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), 'MM/DD HH:mm', 8);
      },

      choosedImg() {
        // if (this.errorMessage) {
        //   this.isSure = false;
        //   return;
        // }
        // let response = {
        //   data: this.list,
        //   img: this.file.url
        // };
        // this.clearFiles();
        // this.$emit('choose', response);

        if (this.errorMessage) {
          this.isSure = false;
          return;
        }
        const that = this;
        const reader = new FileReader();
        let file = '';
        reader.readAsDataURL(this.file.raw);
        reader.onload = function (e) {
          file = this.result;
          that.$emit('choose', file);
        };
        // this.$emit('choose', file);
      },

      // 文件上传成功
      handleAvatarSuccess(res, file) {
        // 获取本地文件路径
        this.file = file;
        this.list = res.data;
        this.isSure = true;
        if (res.errorMessage) {
          this.errorMessage = res.errorMessage;
        } else {
          this.errorMessage = res.errorMessage;
        }
      },

      // 清除文件缓存
      clearFiles() {
        this.$refs.upload.clearFiles();
      },

      // 上传前格式校验
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 3;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 jpg ,jpeg格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 3MB!');
        }
        return isJPG && isLt2M;
      },
      handleAvatarChange(file) {
        if (file && file.status === 'ready') {
          const isAllow = this.beforeAvatarUpload(file.raw);
          this.file = isAllow ? file : {};
          this.isSure = !!isAllow;
        }
      },
    },
  };
</script>
<style lang="less">
  .editor-dialog .el-dialog__header {
    padding: 11px 20px 10px;
    background: rgba(245, 247, 250, 1);
    .el-dialog__headerbtn {
      top: 12px;
    }
  }

  .img-from {
    padding: 0 20px 20px 20px;
    .el-upload-list__item {
      display: none;
    }
    .image-box {
      margin-top: 70px;
      text-align: center;
      .avatar-uploader {
        display: inline-block;
        margin: 0 auto;
      }
      .avatar-uploader .el-upload {
        border: 1px solid #256eff;
        background: rgba(245, 247, 250, 1);
        cursor: pointer;
        position: relative;
        width: 180px;
        height: 180px;
        line-height: 180px;
        position: relative;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 180px;
        line-height: 180px;
        text-align: center;
      }
      .avatar {
        width: 180px;
        height: 180px;
        border-radius: 4px;
        display: block;
      }
      .el-icon-plus:before {
        color: #256eff;
      }
    }

    .none.avatar-uploader {
      .el-upload {
        border: none;
      }
    }

    .upload-text {
      margin-top: 12px;
      font-size: 12px;
      color: rgba(153, 153, 153, 1);
      text-align: center;
    }
    .btn-box {
      text-align: center;
      margin-top: 10px;
      .img-btn {
        width: 200px;
        box-sizing: border-box;
      }
    }
    .again {
      position: absolute;
      top: 223px;
      left: 66px;
      color: #256eff;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
    }
    .error-content {
      margin-top: 70px;
      text-align: center;
      font-size: 12px;
      height: 19px;
      color: rgba(251, 73, 56, 1);
    }
  }
</style>
