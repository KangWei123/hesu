<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <i class="icon dialogIcon" :class="iconClass"></i>
      <span class="title">{{ tipTitle }}</span>
      <span class="content">{{ tipContent }}</span>    
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>     
        <el-button type="primary" @click="Sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: {
      dialogVisible: {
        type: Boolean,
        default: false,
      },
      tipTitle: {
        type: String,
        default: '',
      },
      tipContent: {
        type: String,
        default: '',
      },
      iconClass: {
        type: String,
        default: '',
      },
      iconColor: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        obj: '',
      };
    },
    watch: {
      iconColor(newVal) {
        if (newVal) {
          this.changeColor();
        }
      },
    },
    methods: {
      Sure() {
        this.$emit('DialogSure');
      },
      cancel() {
        this.$emit('DialogCancel');
      },
      handleClose(done) {
        this.$emit('DialogCancel');
      },
      async changeColor() {
        this.obj = await document.getElementsByClassName('dialogIcon');
        this.obj[0].style.color = this.iconColor;
      },
    },
  };
</script>

<style lang="less" scoped></style>
