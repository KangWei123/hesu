<template>
  <div class="contact-us-edit">
    <div class="content">
      <p class="title">填写需求</p>
      <img class="logo-draft"
           :src="require('@/dss-common/img/logo-draft.png')" />
      <el-form ref="form"
               :model="form"
               size="mini"
               :rules="rules"
               v-loading="loading">
        <el-form-item label="品牌名称："
                      prop="brandName">
          <el-input clear="brand-input"
                    placeholder="请输入品牌名称"
                    v-model.trim="form.brandName"></el-input>
        </el-form-item>
        <el-form-item label="联系人："
                      prop="contactName">
          <el-input clear="brand-input"
                    placeholder="请输入联系人"
                    v-model.trim="form.contactName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话："
                      prop="phone">
          <el-input clear="brand-input"
                    placeholder="请输入联系电话"
                    v-model.trim="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="验证码："
                      prop="checkCode"
                      class="code-content">
          <el-input clear="brand-input"
                    placeholder="请输入验证码"
                    class="code-input"
                    v-model.trim="form.checkCode">
          </el-input>
          <el-button type="primary"
                     class="btn-code"
                     :disabled="isDisabled"
                     @click="onGetSmsCode">{{btnText}}</el-button>
        </el-form-item>
        <el-form-item label="备注："
                      prop="remark">
          <el-input clear="brand-input"
                    placeholder="请输入备注"
                    v-model.trim="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button type="primary"
                   @click="onNext('form')">下一步
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import regexps from '@/dss-common/utils/regexps';
import services from '@/dss-common/utils/services';

export default {
  data() {
    return {
      loading: false,
      form: {
        brandName: null,
        contactName: null,
        phone: null,
        checkCode: null,
        remark: null
      },
      btnText: '获取验证码',
      isDisabled: false,

      rules: {
        brandName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '品牌名称字母、数字或汉字 组成', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '请输入正确的联系人', trigger: 'blur' },
          {
            min: 1,
            max: 8,
            message: '长度在 1 到 8 个字符',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: regexps.phone.reg, message: '请输入正确的联系电话', trigger: 'blur' }
        ],
        checkCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          {
            pattern: regexps.smsCode.reg,
            message: regexps.smsCode.msg,
            trigger: 'blur'
          }
        ],
        remark: [
          {
            min: 1,
            max: 100,
            message: '长度在 1 到 100 个字符',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  beforeDestroy() {
    if (this.taskId) {
      clearInterval(this.taskId);
    }
  },
  methods: {
    // 验证码倒数
    inputSmsCode() {
      if (this.taskId) {
        clearInterval(this.taskId);
        this.taskId = null;
        this.isDisabled = false;
      }
      let time = 60;
      this.btnText = `${time}s`;
      this.isDisabled = true;
      this.taskId = setInterval(() => {
        time--;
        if (time <= 0) {
          clearInterval(this.taskId);
          this.isDisabled = false;
          this.taskId = null;
          this.btnText = '获取验证码';
          return;
        }
        this.btnText = `${time}s`;
      }, 1000);
    },

    // 获取验证码
    onGetSmsCode() {
      if (!this.form.phone) {
        this.$message({
          showClose: true,
          type: 'error',
          duration: 3000,
          message: '请输入您的手机号'
        });
        return;
      } else if (!regexps.phone.reg.test(this.form.phone)) {
        return;
      }

      //开始定时器倒数
      this.inputSmsCode();

      // 获取验证码
      services
        .post(
          '/c/ordering/send_check_code',
          {
            phone: this.form.phone
          },
          {
            action: '获取验证码'
          }
        )
        .done(res => {
          if (!res.success || res.success === 'false' || res.data === false || res.data === 'false') {
            this.$message({
              showClose: true,
              type: 'error',
              duration: 2000,
              message: res.errorMessage || '获取验证码失败'
            });
            return;
          }
        });
    },

    // 点击下一步
    onNext(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          this.loading = true;

          const params = this.form;
          services
            .post('/c/ordering/add', params, {
              action: '添加联系我们'
            })
            .then(() => {
              //添加联系我们保存成功
              this.$emit('saved');
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

