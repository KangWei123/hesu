<template>
  <el-dialog
    class="avatar-dialog"
    :visible.sync="showAvatar"
    width="510px"
    append-to-body>
    <img class="avatar-dialog-img" :src="'data:image/jpeg;base64,' + avatar">
  </el-dialog>
</template>
<script>
export default {
  name: 'avatarDialog',
  components: {},
  props: {
    avatar: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    showAvatar: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
        return val;
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less">
.avatar-dialog.el-dialog__wrapper {
  .el-dialog {
    background-color: transparent;
    box-shadow: none;

    .el-dialog__header {
      .el-dialog__headerbtn {
        .el-dialog__close.el-icon.el-icon-close {
          color: #ffffff;
          font-size: 20px;
        }

      }
    }

    .avatar-dialog-img {
      display: block;
      width: 470px;
      height: 470px;
    }
  }
}
</style>
