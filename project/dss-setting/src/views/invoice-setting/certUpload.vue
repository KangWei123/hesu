<template>
  <el-upload class="upload-container"
             action="/wp/cos/upload"
             :before-upload="handleBeforeUpload"
             :on-success="handleSuccess"
             :on-remove="handleRemove"
             :limit="1"
             :on-exceed="handleExceed"
              ref="my-upload">
    <el-button size="small"
               type="primary">点击上传</el-button>
  </el-upload>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleBeforeUpload(file) {
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isLt5M) {
        this.$message.error('上传的文件大小不能超过 5MB!');
      }
      return isLt5M;
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 个文件');
    },
    handleSuccess(res) {
      if (res.errorCode == 120000) {
        this.$refs['my-upload'].clearFiles();
        this.$message.error('上传失败：您当前职位无权限操作');
      } else {
        // todo 需要根据后端返回字段定义
        const fileUrl = res.data;
        this.$emit('clearUploadValidate', fileUrl);
      }
    },
    handleRemove(file, fileList) {
      this.$emit('uploadValidate');
    }
  }
};
</script>
