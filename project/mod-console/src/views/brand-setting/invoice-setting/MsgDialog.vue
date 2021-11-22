<template>
  <el-dialog :title="title" :visible.sync="show" width="30%">
    <span>{{ msg }}</span>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      msg: {
        type: String,
        default: '',
      },
      title: {
        type: String,
        default: '提示',
      },
    },
    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    methods: {
      handleConfirm() {
        this.$emit('handleConfirm');
      },
    },
  };
</script>
