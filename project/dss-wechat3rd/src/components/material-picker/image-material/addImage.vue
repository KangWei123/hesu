<template>
  <el-upload
    :action="`${materialsAddUrl}?type=${picType}`"
    :data="formData"
    :show-file-list="false"
    :on-success="handleSuccess"
    :on-error="handleError"
    :accept="accept"
    name="files"
    v-bind="uploadProps"
    :before-upload="beforeUpload"
  >
    <slot />
  </el-upload>
</template>
<script>
import mApi from './materials.js';
import { FILE_TYPES, FILE_ACCEPT, SIZE_LIMIT } from './MaterialsConfig.js';

const ImageType = FILE_TYPES.IMAGE;
export default {
  data() {
    return {
      formData: {
        type: ImageType
      },
      accept: FILE_ACCEPT[ImageType]
    };
  },
  computed: {
    materialsAddUrl() {
      let materialsAddUrl = '';
      if (this.isTemporary) {
        materialsAddUrl = mApi.addTemporary.url;
        this.formData.fileType = 4;
      } else {
        materialsAddUrl = this.isLocal ? mApi.addLocal.url : mApi.add.url;
      }
      console.log(materialsAddUrl);
      return materialsAddUrl;
    }
  },
  mounted() {
    if (!!this.groupId) {
      this.formData = {
        type: ImageType,
        groupId: this.groupId
      };
    }
  },
  props: {
    //素材来源是否 本地素材，否则是 微信素材
    isLocal: {
      type: Boolean,
      default: true
    },
    isTemporary: {
      type: Boolean,
      default: false
    },
    picType: {
      type: Number,
      default: 1
    },
    uploadProps: {
      type: Object,
      default: _ => {
        return {
          name: 'files'
        };
      }
    },
    groupId: {
      type: Number,
      default: undefined
    },
    catchError: {
      type: Function,
      default: null
    }
  },
  watch: {
    groupId(newVal) {
      if (!!newVal) {
        this.formData = {
          type: ImageType,
          groupId: newVal
        };
      }
    }
  },
  methods: {
    handleSuccess(opt) {
      if (!opt.success) {
        this.handleError({ errorMessage: `${opt.errorMessage}` });
      } else {
        this.$emit('success', opt.data);
      }
    },

    handleError(opt) {
      if (this.catchError) {
        this.catchError(`上传失败${opt && opt.errorMessage ? ':' + opt.errorMessage : ''}`);
      } else {
        this.$message({
          type: 'error',
          message: `上传失败${opt && opt.errorMessage ? ':' + opt.errorMessage : ''}`
        });
      }
    },
    submit() {
      this.$refs.upload && this.$refs.upload.submit();
    },
    changeFormData(value) {
      this.formData = {
        ...this.formData,
        ...value
      };
    },

    beforeUpload(file) {
      const size = file.size;
      let maxSize = SIZE_LIMIT[ImageType];
      if (this.picType !== 1) {
        maxSize = 65536;
      }
      if (maxSize < size) {
        if (maxSize === 65536) {
          this.handleError({
            errorMessage: '图片大小不能超过64KB'
          });
        } else {
          this.handleError({
            errorMessage: `图片大小不能超过${maxSize / 1024 / 1024}MB`
          });
        }
        return false;
      }
      return true;
    }
  }
};
</script>
