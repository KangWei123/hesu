<template>
  <el-dialog
    class="dialog-container"
    :visible.sync="visible"
    :title="supplement ? '补充备注' : '撤销录入'"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    destory-on-close
  >
    <el-form :model="form" ref="form" :rules="rules" label-width="60px" v-loading="loading">
      <el-form-item label="备注" prop="reason">
        <el-input
          class="dialog_input"
          type="textarea"
          maxlength="100"
          resize="none"
          placeholder="请输入备注"
          v-model.trim="form.reason"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script>
  import api from '../../../api/large-mem-score';

  export default {
    name: 'RevokeDialog',
    data() {
      return {
        form: {
          reason: '',
        },
        row: null,
        loading: false,
        visible: false,
        supplement: false,
        rules: {
          reason: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        },
      };
    },
    methods: {
      show(row, supplement) {
        this.visible = true;
        this.supplement = !!supplement;
        this.row = { ...row };
        if (row) {
          this.form.reason = row.reason || '';
        }
      },
      handleCancel() {
        this.visible = false;
        this.$refs.form.resetFields();
      },
      async handleSubmit() {
        if (this.loading && !this.row) {
          return;
        }
        const params = {
          id: this.row.id,
          reason: this.form.reason,
          uniqueAccountId: this.row.uniqueAccountId,
        };
        try {
          const valid = await this.$refs.form.validate();
          if (valid) {
            this.loading = true;
            const method = this.supplement ? 'supplement' : 'revoke';
            await api.customer[method](params);
            this.$message.success('操作成功');
            this.visible = false;
            this.$emit('revoked');
          }
        } catch (error) {
          console.error(error);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .dialog-container {
    .el-dialog__title {
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
    }

    .el-dialog__body {
      text-align: left;
    }

    /deep/.el-textarea__inner {
      height: 100%;
    }

    .el-form-item {
      margin-bottom: 20px !important;
    }
  }
</style>
