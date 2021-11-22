<template>
  <el-dialog
    :title="type === 'info' ? '' : tipTitle"
    :visible.sync="dialogVisible"
    :width="width"
    :before-close="handleClose"
    :close-on-click-modal="closeOnClickModal"
  >
    <i v-if="type === 'info'" class="icon dialogIcon el-icon-warning"></i>
    <div v-if="type === 'info'" class="title">{{ tipTitle }}</div>
    <slot name="content" class="content" />
    <div v-if="$slots.footer" class="dialog-footer">
      <slot name="footer" />
    </div>
    <div v-else class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>   
      <el-button type="primary" @click="handleSubmit">确 认</el-button>  
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      width: {
        type: String,
        default: '30%',
      },
      type: {
        type: String,
        default: 'info',
      },
      tipTitle: {
        type: String,
        default: '提示',
      },
      closeOnClickModal: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        dialogVisible: false,
        params: null,
      };
    },
    methods: {
      handleSubmit() {
        this.$emit('submit', this.params);
        this.dialogVisible = false;
      },
      handleClose(done) {
        this.$emit('before-close', this.params);
        this.dialogVisible = false;
      },
      show(params) {
        this.params = params;
        this.dialogVisible = true;
      },
      hide() {
        this.dialogVisible = false;
      },
    },
  };
</script>

<style lang="less" scoped>
  .dialog-footer {
    padding-top: 10px;
  }

  .el-icon-warning {
    color: #3591ff;
  }
</style>
