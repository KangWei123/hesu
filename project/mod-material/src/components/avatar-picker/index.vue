<template>
  <el-upload
    class="avatar-picker"
    :action="action"
    :data="params"
    :show-file-list="false"
    :accept="accept"
    :on-success="handleSuccess"
    :before-upload="handleBeforeUpload"
    name="files"
  >
    <img v-if="value" :src="value" class="avatar-picker__img" />
    <i v-else class="el-icon-plus avatar-picker__add"></i>
  </el-upload>
</template>

<script>
  import api from '@/mod-material/src/api/materials';
  import config from '@/mod-material/src/constants/config';

  /**
   * 头像选择器
   */
  export default {
    name: 'AvatarPicker',
    props: {
      action: {
        type: String,
        // TODO: 从素材中心中获取
        default: api.addLocal.url,
      },
      value: {
        type: String,
        default: null,
      },
      /**
       * 扩展图片上传类型
       */
      params: {
        type: Object,
        default: () => {
          return {
            type: config.FILE_TYPES.THUMB,
          };
        },
      },
    },
    data() {
      return {
        // params: {
        //   type: config.FILE_TYPES.THUMB,
        // },
        accept: config.FILE_ACCEPT[config.FILE_TYPES.THUMB],
      };
    },
    methods: {
      handleSuccess(res, file) {
        this.$emit('input', res.data);
      },
      handleBeforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    },
  };
</script>

<style lang="less">
  .avatar-picker {
    @width: 48px;
    display: inline-block;
    width: @width;
    height: @width;
    border: 1px solid #cccccc;
    cursor: pointer;
    overflow: hidden;
    border-radius: 100%;

    &:hover {
      border-color: #409eff;
    }

    .el-upload {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__img {
      width: @width;
      height: @width;
      object-fit: cover;
    }

    &__add {
      font-size: 16px;
    }
  }
</style>
