export default {
  data() {
    return {
      uploadProps: {
        'show-file-list': false,
        'on-progress': this.uploadProgress,
        disabled: false
      },
      isUpload: false
    };
  },
  methods: {
    uploadProgress(e) {
      this.uploadProps.disabled = true;
      console.log('啦啦啦啦');
      if (this.isUpload) return;
      this.$message({
        type: 'info',
        message: '上传中...',
        duration: 0
      });
      this.isUpload = true;
    },
    uploadSuccess(e) {
      this.uploadProps.disabled = false;
      this.$message.closeAll();
      this.isUpload = false;
      this.$message({
        type: 'success',
        message: '上传成功'
      });
      this.fetchData && this.fetchData();
    },
    catchUploadError(e) {
      this.isUpload = false;
      this.uploadProps.disabled = false;
      this.$message.closeAll();
      this.$message({
        type: 'error',
        message: e
      });
    }
  }
};
