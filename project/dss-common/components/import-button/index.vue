<template>
  <el-button v-bind="$props" @click="handleUpload">
    <slot></slot>
    <upload
      v-bind="$props"
      :visible.sync="visible"
      :template-down-url="templateUrl"
      :need-template="!!templateUrl"
      :upload-server-url="action"
      :limit="1"
      @upload-success="handleSuccess"
    ></upload>
  </el-button>
</template>

<script>
  import omit from 'lodash/omit';
  import upload from '../upload/index.vue';
  import { Button } from 'element-ui';

  /**
   * 导出按钮
   */
  export default {
    name: 'ImportButton',
    components: {
      upload,
    },
    props: {
      ...omit(Button.props, ['loading']),
      ...omit(upload.props, ['visible', 'templateDownUrl', 'needTemplate', 'uploadServerUrl']),
      // 模版下载地址
      templateUrl: {
        type: String,
        default: '',
      },
      action: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      handleUpload() {
        this.visible = true;
      },
      handleSuccess() {
        this.$emit('success');
      },
    },
  };
</script>

<style></style>
