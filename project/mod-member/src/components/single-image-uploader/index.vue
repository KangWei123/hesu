<template>
  <div>
    <el-upload action="" :show-file-list="false" :on-success="onSuccess" :before-upload="beforeUpload">
      <img v-if="imageUrl" :src="imageUrl" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>
<script>
  export default {
    name: 'SingleImageUploader',
    data() {
      return {
        imageUrl: '',
      };
    },
    methods: {
      onSuccess() {},
      beforeUpload() {},
    },
  };
</script>
