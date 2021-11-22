<template>
  <el-dialog
    :title="title"
    class="add-app-dialog"
    @opened="onDialogOpen"
    @closed="onDialogClose"
    :visible.sync="dialogVisible"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="用户名" prop="adminName">
        <el-input class="inner-input" v-model.trim="form.adminName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="adminPhone">
        <el-input class="inner-input" v-model.trim="form.adminPhone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="账号密码"
        prop="adminPassword"
        :rules="[{ required: isEdit, message: '请输入账号密码', trigger: 'blur' }]"
      >
        <el-input
          class="inner-input"
          v-model="form.adminPassword"
          :placeholder="placeholder"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSetAdminAccount">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import regexps from '@/dss-common/utils/regexps';
  import { setAdmin } from '@/mod-org/src/api/appApi';
  /**
   * 添加应用
   * value: v-model
   * appInfo: 编辑的应用信息，如果是新增则置为null
   */
  export default {
    name: 'AddAppDialog',
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      appInfo: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        form: {
          id: null,
          adminName: '',
          adminPassword: null,
          adminPhone: null,
          accountType: 1,
        },
        rules: {
          adminName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
          ],
          adminPhone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: regexps.phone.reg,
              message: regexps.phone.msg,
              trigger: 'blur',
            },
          ],
          adminPassword: [
            { message: '请输入账号密码', trigger: 'blur' },
            {
              pattern: regexps.password.reg,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      title() {
        return '管理员设置';
      },
      placeholder() {
        return this.appInfo && this.appInfo.adminName ? '******' : '';
      },
      isEdit() {
        return !(this.appInfo && this.appInfo.adminName);
      },
    },
    watch: {
      value(newVal, oldVal) {
        this.dialogVisible = newVal;
      },
    },
    methods: {
      onDialogOpen() {
        this.initData();
      },
      onDialogClose() {
        this.$emit('input', false);
        this.$nextTick(() => {
          this.$refs.form.resetFields();
        });
      },
      initData() {
        if (this.appInfo) {
          Object.keys(this.form).forEach(key => {
            this.form[key] = this.appInfo[key];
          });
        } else if (this.form.id) {
          this.$refs.form.resetFields();
          this.form.id = null;
        }
      },
      handleSetAdminAccount() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.onSubmitAdminAccount();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      onSubmitAdminAccount() {
        const params = { ...this.form };
        params.appId = params.id;
        delete params.id;
        setAdmin(params).then(res => {
          this.dialogVisible = false;
          this.$emit('done');
        });
      },
    },
  };
</script>

<style lang="less">
  .add-app-dialog {
    .el-dialog {
      width: 400px;
    }

    .el-dialog__body {
      text-align: left;
    }

    .inner-input {
      display: inline-block;
      width: 206px;
    }
  }
</style>
