<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="15%"
    center
    :before-close="handleClose">
    <p>{{content}}</p>
    <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="confirm">{{btnContent}}</el-button>
  </span>
  </el-dialog>
</template>

<script>
    export default {
      name: 'index.vue',
      data() {
        return {
          dialogVisible: false,
          content: '',
          btnContent: ''
        };
      },
      methods: {
        open(content, btnContent) {
          this.dialogVisible = true;
          this.content = content;
          this.btnContent = btnContent;
        },
        close() {
          this.dialogVisible = false;
        },
        handleClose() {
          this.close();
        },
        confirm() {
          this.$router.push({
            path: '/setting/wx/mp/user_deal'
          });
        }
      }
    };
</script>

<style scoped lang="less">
  p {
    text-align: center;
  }
</style>
