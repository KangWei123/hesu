<template>
  <div>
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/assets' }">资产管理</el-breadcrumb-item>
      <el-breadcrumb-item>充值</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form ref="rechargeform" :model="rechargeform" :rules="rules" class="assets-recharge" label-width="120px">
      <el-form-item label="可用余额：">
        <div class="assets-money">¥0.00</div>
      </el-form-item>

      <el-form-item label="充值方式：">
        <el-radio-group v-model="rechargeform.type">
          <el-radio :label="1">在线充值</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="充值平台：">
        <div class="assets-recharge-platform">
          <ul>
            <li>
              <a class="assets-recharge-btn" href="javascript:;" style="cursor: auto">
                <img src="../../../images/brand-setting/assets/icon04.png" width="28" alt="微信支付" />
                微信支付
              </a>
            </li>
            <!-- <li class="active">
               <a class="assets-recharge-btn" href="javascript:;">
                <img src="../../../images/brand-setting/assets/icon05.png" width="28" alt="支付宝支付">
                支付宝支付
              </a>
            </li> -->
          </ul>
        </div>
      </el-form-item>

      <el-form-item prop="otherMoney" label="充值金额：">
        <div class="assets-recharge-money">
          <ul>
            <li v-for="l in presetMoney" :class="rechargeform.curMoney === l ? 'active' : ''" :key="l">
              <a href="javascript:;" @click="handleSetMoney(l)"> {{ l }}元 </a>
            </li>
            <li :class="rechargeform.curMoney === 'other' ? 'active' : ''">
              <a href="javascript:;" @click="handleSetMoney('other')">
                <el-input v-model="rechargeform.otherMoney" maxlength="7" placeholder="其他金额"></el-input>
              </a>
            </li>
          </ul>
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('rechargeform')">确认充值</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import regexps from '@/dss-common/utils/regexps.js';

  export default {
    data() {
      const { money } = regexps;

      const validateMoney = (rule, value, callback) => {
        setTimeout(() => {
          if (this.rechargeform.curMoney === 'other') {
            if (!value) {
              callback(new Error('请输入其他金额'));
            } else {
              callback();
            }
          } else {
            callback();
          }
        }, 200);
      };

      return {
        presetMoney: [200, 500, 1000, 2000, 5000, 10000],
        rechargeform: {
          type: 1,
          curMoney: 200,
          otherMoney: '',
        },
        rules: {
          otherMoney: [
            { validator: validateMoney, trigger: 'blur' },
            { pattern: money.reg, message: money.msg },
          ],
        },
      };
    },
    mounted() {},

    methods: {
      handleSetMoney(money) {
        this.rechargeform.curMoney = money;
        if (money !== 'other') {
          this.rechargeform.otherMoney = '';
          this.$refs.rechargeform.resetFields();
        }
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  };
</script>
