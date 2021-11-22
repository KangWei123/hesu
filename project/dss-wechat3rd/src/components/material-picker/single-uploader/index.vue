<template>
  <el-upload
    :action="uploadUrl"
    :data="formData"
    :on-success="handleSuccess"
    :on-error="handleError"
    :accept="accept"
    name="files"
    v-bind="uploadProps"
    :before-upload="beforeUpload"
    :auto-upload="autoUpload"
    :show-file-list="showFileList"
    :limit="1"
    ref="uploader"
  >
    <slot />
  </el-upload>
</template>
<script>
import api from '../materials.js';
import { FILE_ACCEPT as ACCEPT, SIZE_LIMIT, SIZE_ERROR } from '../MaterialsConfig.js';

export default {
  data() {
    const uploadUrl = api.materialAddUrl.url;
    return {
      uploadUrl,
      ACCEPT,
      SIZE_LIMIT,
      SIZE_ERROR,
      accept: ACCEPT[this.fileType],
      file: null
    };
  },

  computed: {
    formData() {
      return {
        ...(this.groupId ? { groupId: this.groupId } : {}),
        ...(this.fileType ? { materialType: this.fileType } : {}),
        ...(this.title ? { materialName: this.title } : {})
      };
    }
  },

  props: {
    // formData
    groupId: {
      type: Number
    },
    fileType: {
      type: Number,
      retuired: true
    },
    uploadProps: {
      type: Object,
      default: _ => {
        return {
          name: 'files'
        };
      }
    },
    title: {
      type: String
    },
    // custom error handler
    catchError: {
      type: Function,
      default: null
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    showFileList: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleSuccess(opt) {
      this.$refs.uploader.clearFiles();
      if (!opt.success) {
        this.handleError(opt);
      } else {
        this.$emit('on-success', opt.data);
      }
      this.$emit('on-finally');
    },

    handleError(opt) {
      this.$refs.uploader.clearFiles();
      this.$emit('on-error', opt);
      this.$emit('on-finally');
      if (this.catchError) {
        this.catchError(`上传失败${opt && opt.errorMessage ? ':' + opt.errorMessage : ''}`);
      } else {
        this.$message({
          type: 'error',
          message: `上传失败${opt && opt.errorMessage ? ':' + opt.errorMessage : ''}`
        });
      }
    },

    beforeUpload(file) {
      // loading
      this.$emit('on-start');
      const size = file.size;
      let maxSize = this.SIZE_LIMIT[this.fileType];
      if (size > maxSize) {
        this.handleError({
          errorMessage: this.SIZE_ERROR[this.fileType]
        });
        return false;
      }
      return true;
    },

    getFile() {
      if (this.$refs.uploader.uploadFiles && this.$refs.uploader.uploadFiles.length) {
        return this.$refs.uploader.uploadFiles[0].raw;
      }
    },
    submit() {
      this.$emit('on-start');
      this.$refs.uploader.submit();
    }
  }
};
</script>
