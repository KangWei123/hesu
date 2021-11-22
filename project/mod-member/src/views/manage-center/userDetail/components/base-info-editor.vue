<template>
  <el-dialog title="编辑客户基本信息" :visible.sync="dialogVisible" width="30%">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" v-loading="loading">
      <el-form-item label="客户姓名：" prop="realName">
        <el-input v-model="form.realName" style="width: 280px" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input v-model="form.phone" style="width: 280px" clearable maxlength="11"></el-input>
        <div class="member-desc">请谨慎修改，该手机号是用户的会员标识</div>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-radio v-model="form.gender" :label="commonEnum.SEX.Male">男</el-radio>
        <el-radio v-model="form.gender" :label="commonEnum.SEX.Female">女 </el-radio>
      </el-form-item>
      <el-form-item label="出生年月：" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          style="width: 280px"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注：" prop="description">
        <el-input v-model="form.description" style="width: 280px" placeholder="输入备注" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="dialogVisible = false" :disabled="loading">取 消</el-button>
        <el-button type="primary" @click="onCommit" :disabled="loading">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import regexps from '@/dss-common/utils/regexps';
  import { commonEnum } from '@/business-common/constants';
  import api from '@/mod-member/src/api/manage.js';

  export default {
    name: 'BaseInfoEditor',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      initData: {
        type: Object,
        default() {
          return null;
        },
      },
    },
    data() {
      const { name, phone } = regexps;
      return {
        commonEnum,
        dialogVisible: false,
        loading: false,
        form: {
          id: '',
          realName: '',
          phone: '',
          gender: '',
          birthday: '',
          description: '',
        },
        rules: {
          realName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' },
          ],
          phone: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { pattern: phone.reg, message: phone.msg, trigger: 'blur' },
          ],
          gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
      };
    },
    watch: {
      value(val) {
        this.dialogVisible = val;
      },
      dialogVisible(val) {
        if (val) {
          this.form = { ...this.initData };
        }
        this.$emit('input', val);
      },
      initData(val) {
        this.form = { ...val };
      },
    },
    methods: {
      onCommit() {
        this.loading = true;
        this.$refs.form
          .validate()
          .then(valid => {
            return api.update({
              ...this.form,
            });
          })
          .then(res => {
            this.$message.success('编辑客户信息成功');
            this.$emit('success', this.form);
            this.dialogVisible = false;
          })
          .finally(() => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less"></style>
