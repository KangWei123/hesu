<template>
  <el-form inline :model="ipRange" :rules="ipRules" ref="ipRuleForm">
    <el-form-item style="width: 16%" prop="ip1">
      <el-input v-model="ipRange.ip1" :maxlength="3"></el-input>
    </el-form-item>
    <el-form-item>:</el-form-item>
    <el-form-item style="width: 16%" prop="ip2">
      <el-input v-model="ipRange.ip2" :maxlength="3"></el-input>
    </el-form-item>
    <el-form-item>:</el-form-item>
    <el-form-item style="width: 16%" prop="ip3">
      <el-input v-model="ipRange.ip3" :maxlength="3"></el-input>
    </el-form-item>
    <el-form-item>:</el-form-item>
    <el-form-item style="width: 16%" prop="ip4">
      <el-input v-model="ipRange.ip4" :maxlength="3"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    name: 'IpInput',
    inject: ['ipReactiveRange'],
    props: {
      flag: {
        type: String,
        default: '',
      },
    },
    data() {
      const ipChecking = (rule, value, callback) => {
        if (!this.flag === 'to' || value === '') return callback(new Error('请输入IP'));
        if (!/^[0-9]*$/.test(value)) return callback(new Error('IP错误'));
        if (parseInt(value) < 0 || parseInt(value) > 255) {
          callback(new Error('IP地址错误'));
        }
        callback();
      };
      return {
        ipRange: {
          ip1: '',
          ip2: '',
          ip3: '',
          ip4: '',
        },
        ipRules: {
          ip1: [{ validator: ipChecking, trigger: 'blur' }],
          ip2: [{ validator: ipChecking, trigger: 'blur' }],
          ip3: [{ validator: ipChecking, trigger: 'blur' }],
          ip4: [{ validator: ipChecking, trigger: 'blur' }],
        },
      };
    },
    methods: {
      initData() {
        if (this.flag === 'from') {
          if (this.ipReactiveRange().fromIp) {
            for (let i = 0; i < 4; i++) {
              this.ipRange[`ip${i + 1}`] = this.ipReactiveRange().fromIp.split('.')[i];
            }
          }
        } else {
          if (this.ipReactiveRange().toIp) {
            for (let i = 0; i < 4; i++) {
              this.ipRange[`ip${i + 1}`] = this.ipReactiveRange().toIp.split('.')[i];
            }
          }
        }
      },
      clear() {
        this.$refs.ipRuleForm.resetFields();
      },
      ipCheck() {
        let isCorrect;
        this.$refs.ipRuleForm.validate(valid => {
          if (valid) {
            isCorrect = true;
          } else {
            isCorrect = false;
          }
        });
        return isCorrect;
      },
    },
  };
</script>
<style lang="less" scoped>
  .el-input {
    width: 100%;
  }
</style>
