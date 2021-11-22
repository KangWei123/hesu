<template>
  <el-dialog title="新增咨询人" :visible.sync="dialogVisible" width="450px" :close-on-click-modal="false">
    <list-page-layout>
      <template #filters>
        <div class="filter">
          <el-form ref="form" :model="form" :rules="rules" @submit.prevent.native="onConfirm" label-width="120">
            <el-form-item label="咨询人姓名" prop="name">
              <el-input style="width: 160px" v-model="form.name" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="咨询人电话" prop="phone">
              <el-input style="width: 160px" v-model="form.phone" clearable placeholder="请输入"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </list-page-layout>

    <div slot="footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button type="primary" @click="onConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import regexps from '@/dss-common/utils/regexps';
  import { ListPageLayout } from '@/dss-common/components/list-page/index';

  const required = message => ({ required: true, message: message || '不能为空' });
  const RULES = {
    name: required('请输入咨询人姓名'),
    phone: [
      required('请输入咨询人电话'),
      { pattern: regexps.servicePhone.reg, message: '请输入正确的联系电话', trigger: 'blur' },
    ],
  };
  export default {
    name: 'ConsulantFormDialog',
    components: {
      ListPageLayout,
    },
    data() {
      return {
        dialogVisible: false,
        form: {
          name: '',
          phone: '',
        },
        rules: RULES,
      };
    },
    methods: {
      open() {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
      },
      onCancel() {
        this.close();
      },
      async onConfirm() {
        if (!(await this.$refs.form.validate())) {
          return;
        }
        this.$emit('add', { name: this.form.name, phone: this.form.phone });
        this.dialogVisible = false;
        this.$refs.form.resetFields();
      },
    },
  };
</script>
