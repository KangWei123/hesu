<template>
  <el-dialog
    class="create-member-dialog"
    :visible.sync="visible"
    title="快速新增会员"
    append-to-body
    width="500px"
    :close-on-click-modal="false"
    destory-on-close
  >
    <el-form
      :model="inputForm"
      ref="createForm"
      label-width="100px"
      :rules="rules"
      v-loading="loading"
      label-suffix=":"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input
          placeholder="请输入手机号"
          v-model.trim="inputForm.phone"
          style="width: 300px"
          autocomplete="off"
          maxlength="11"
        ></el-input>
      </el-form-item>

      <el-form-item label="姓名" prop="realName">
        <el-input
          placeholder="请输入姓名"
          v-model.trim="inputForm.realName"
          style="width: 300px"
          autocomplete="off"
          maxlength="20"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script>
  import regexps from '@/dss-common/utils/regexps';
  import api from '../../../api/large-mem-score';

  export default {
    name: 'CreateMemberDialog',
    data() {
      return {
        inputForm: {
          phone: '',
          realName: '',
          gender: '未知',
        },
        loading: false,
        visible: false,
        rules: {
          phone: [
            { required: true, message: '请输入您的手机号', trigger: 'blur' },
            {
              pattern: regexps.phone.reg,
              message: regexps.phone.msg,
              trigger: 'blur',
            },
          ],
          realName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        },
      };
    },
    methods: {
      show() {
        this.visible = true;
      },
      handleCancel() {
        this.$refs.createForm.resetFields();
        this.visible = false;
      },
      async handleSubmit() {
        const valid = await this.$refs.createForm.validate();
        if (valid) {
          try {
            this.loading = true;
            await api.customer.createMember(this.inputForm);
            this.$message.success('添加成功');
            this.visible = false;
          } catch (error) {
            console.error(error);
          } finally {
            this.loading = false;
          }
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .create-member-dialog {
    .el-dialog__title {
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
    }

    .el-dialog__body {
      text-align: left;
    }
  }

  /deep/.el-textarea__inner {
    height: 100%;
  }

  .el-form-item {
    margin-bottom: 20px !important;
  }
</style>
