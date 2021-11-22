<template>
  <el-dialog
    :title="item && item.id ? '编辑客户来源' : '新增客户来源'"
    width="40%"
    class="client-source-dialog"
    :visible.sync="dialogVisible"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="来源名称">
        <el-input v-model.trim="form.name" :maxlength="15" placeholder="输入不超过15字符长度的名称"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onCommit" :loading="isLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import api from '@/mod-member/src/api/manage';

  export default {
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      item: {
        type: Object,
        default() {
          return null;
        },
      },
    },
    watch: {
      value(val) {
        this.dialogVisible = val;
      },
      dialogVisible(val) {
        if (val) {
          this.init();
        }
        this.$emit('input', val);
      },
    },
    data() {
      return {
        isLoading: false,
        dialogVisible: false,
        form: {
          name: '',
        },
        rules: {
          name: [{ required: true, message: '来源名称不能为空', trigger: 'blur' }],
        },
      };
    },
    methods: {
      init() {
        this.form = {
          id: this.item ? this.item.id : '',
          name: this.item ? this.item.name : '',
        };
      },
      onCommit() {
        this.$refs.form.validate().then(valid => {
          if (this.form.id) {
            this.onUpdate();
          } else {
            this.onAdd();
          }
        });
      },
      onUpdate() {
        this.isLoading = true;
        api
          .updateClientSource({
            id: this.form.id,
            name: this.form.name,
          })
          .then(res => {
            this.$message.success('更新客户来源成功！');
            this.$emit('success', this.form);
            this.dialogVisible = false;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
      onAdd() {
        this.isLoading = true;
        api
          .addClientSource({
            name: this.form.name,
          })
          .then(res => {
            this.$message.success('新增客户来源成功！');
            this.$emit('success');
            this.dialogVisible = false;
          })
          .finally(() => {
            this.isLoading = false;
          });
      },
    },
    mounted() {
      this.dialogVisible = this.value;
    },
  };
</script>
<style lang="less" scoped>
  /deep/.dialog-footer {
    justify-content: flex-end;
  }
</style>
