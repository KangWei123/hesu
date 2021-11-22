<template>
  <div>
    <el-form
      ref="byteDanceForm"
      key="byteDanceForm"
      :model="byteDanceForm"
      :rules="byteDanceRules"
      label-width="210px"
      label-suffix=":"
      class="dss-form"
    >
      <el-form-item label="字节appId" prop="bdAppId">
        <el-input type="input" v-model="byteDanceForm.bdAppId" placeholder="请输入字节appId"></el-input>
      </el-form-item>
      <el-form-item label="字节secret" prop="bdAppSecret">
        <el-input type="input" v-model="byteDanceForm.bdAppSecret" placeholder="请输入字节secret"></el-input>
      </el-form-item>
      <el-form-item label="字节支付salt" prop="bdPaySalt">
        <el-input type="input" v-model="byteDanceForm.bdPaySalt" placeholder="请输入字节支付salt"></el-input>
      </el-form-item>
      <el-form-item label="字节支付token" prop="bdPayToken">
        <el-input type="input" v-model="byteDanceForm.bdPayToken" placeholder="请输入字节支付token"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import settingsApi from '@/mod-console/src/api/settings';

  function initByteDanceForm() {
    return {
      bdAppId: '',
      bdAppSecret: '',
      bdPayToken: '',
      bdPaySalt: '',
    };
  }
  const Error = '不能为空';
  export default {
    name: 'TTForm',
    data() {
      return {
        byteDanceForm: initByteDanceForm(),
        byteDanceRules: {
          bdAppId: [{ required: true, message: Error, trigger: 'blur' }],
          bdAppSecret: [{ required: true, message: Error, trigger: 'blur' }],
          bdPayToken: [{ required: true, message: Error, trigger: 'blur' }],
          bdPaySalt: [{ required: true, message: Error, trigger: 'blur' }],
        },
      };
    },
    mounted() {
      this.getPaySettings();
    },
    methods: {
      getPaySettings() {
        settingsApi
          .getTTPaySetting()
          .then(res => {
            this.byteDanceForm = res.data;
          })
          .always(() => {
            this.$emit('finished');
          });
      },
      async clickSave() {
        this.$refs.byteDanceForm.validate(valid => {
          if (valid) {
            try {
              this.$emit('load');
              settingsApi.updateTTPaySetting({ ...this.byteDanceForm });
              this.$message({ message: '保存成功', type: 'success' });
            } catch (error) {
            } finally {
              this.$emit('finished');
            }
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .wx-setting-pay .dss-form {
    width: 430px;
    padding-top: 18px;
  }

  .wx-setting-pay .el-form-item__label {
    color: #717378;
  }
</style>
