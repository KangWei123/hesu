<template>
  <form-page-layout
    class="coupon-container"
    :model="form"
    :rules="rules"
    label-width="110px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>账号信息</template>
      <el-form-item class="flex-row" label="所属项目">
        <!-- <el-form-item prop="appId">
          <app-select style="margin-right: 16px" placeholder="请选择应用" v-model="form.appId" clearable class="w220" />
        </el-form-item> -->
        <el-form-item prop="storeId" v-if="form.appId || accountNo">
          <project-select
            style="margin-right: 16px"
            placeholder="请选择项目"
            v-model="form.storeId"
            clearable
            class="w220"
          />
        </el-form-item>
        <el-form-item v-if="form.storeId">
          <merchant-select
            :store-id="form.storeId"
            placeholder="请选择商户"
            v-model="form.subStoreId"
            clearable
            class="w220"
            @onselect="onselect"
          />
        </el-form-item>
      </el-form-item>

      <el-form-item label="账号" prop="accountNo">
        <el-input
          :disabled="!!accountNo"
          autocomplete="off"
          placeholder="请输入 11 位手机号作为账号"
          v-model.trim="form.accountNo"
          class="w220"
        />
      </el-form-item>

      <el-form-item
        label="密码"
        prop="accountPassword"
        v-if="!accountNo"
        autocomplete="off"
        :rules="[
          {
            required: true,
            message: '请输入您的密码',
            trigger: 'blur',
          },
          ...rules.accountPassword,
        ]"
      >
        <el-input
          id="account_pass"
          type="text"
          placeholder="请输入您的密码"
          v-model="form.accountPassword"
          class="w220"
        />
      </el-form-item>

      <el-form-item label="密码" prop="accountPassword" v-else>
        <el-input id="account_pass" type="text" placeholder="******" v-model="form.accountPassword" class="w220" />
      </el-form-item>

      <el-form-item label="用户名" prop="accountName">
        <el-input placeholder="请输入您的用户名" v-model.trim="form.accountName" class="w220" />
      </el-form-item>

      <el-form-item label="性别">
        <el-radio-group v-model="form.sex">
          <el-radio v-for="item in options" :key="item.key" :label="item.key">{{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="类型" v-if="accountNo">
        {{ typeName[form.accountType] }}
      </el-form-item>

      <el-form-item label="状态">
        <el-switch
          class="switch-style"
          v-model="form.accountStatus"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          active-text="启用"
          inactive-color="#ff4949"
          inactive-text="禁用"
        >
        </el-switch>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark" class="w220" maxlength="120" show-word-limit></el-input>
      </el-form-item>
    </form-group>

    <form-group>
      <template #title>账号权限</template>
      <el-form-item label="发券宝权限" prop="menuIdList">
        <permission v-model="form.menuIdList" />
      </el-form-item>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import { mapState } from 'vuex';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import regexps from '@/dss-common/utils/regexps';
  // import AppSelect from '@/business-common/components/app-select';
  import MerchantSelect from '@/business-common/components/merchant-select/index.vue';
  import ProjectSelect from '@/business-common/components/project-select';
  import Permission from '../../components/Permission.vue';
  import { Type, typeName, SEX_OPTIONS } from '../../enum';
  import { addAccount, detailAccount, editAccount } from '@/dss-wechat3rd/src/api/account-coupon';

  export default {
    components: { FormPageLayout, FormGroup, FormButton, /* AppSelect, */ MerchantSelect, ProjectSelect, Permission },
    data() {
      const { phone, password } = regexps;
      return {
        form: {
          appId: '',
          storeId: '',
          subStoreId: '',
          subStoreName: '',
          menuIdList: [],
          accountStatus: 0,
          accountType: Type.Out,
          accountNo: '',
          accountPassword: '',
          accountName: '',
          sex: 2,
          remark: '',
        },
        rules: {
          appId: [{ required: true, message: '请选择应用', trigger: 'blur' }],
          storeId: [{ required: true, message: '请选择项目', trigger: 'blur' }],
          accountNo: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { pattern: phone.reg, message: phone.msg, trigger: 'blur' },
          ],
          accountName: [
            { required: true, message: '请输入您的用户名', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' },
          ],
          accountPassword: [
            {
              pattern: password.reg,
              message: '6~16字符，字母、数字、符号中至少2种，不能有空格',
              trigger: 'blur',
            },
          ],
          menuIdList: [{ required: true, message: '请选择发券宝权限', trigger: 'change' }],
        },
        options: SEX_OPTIONS,
        typeName,
      };
    },
    computed: {
      ...mapState({
        userInfo: state => state.userInfo,
      }),
      accountNo() {
        const { query } = this.$route;
        return query.accountNo;
      },
    },
    mounted() {
      this.accountNo && this.getDetail();
      this.form.appId = this.userInfo.appInfo.id;
    },
    methods: {
      onselect(val) {
        this.form.subStoreName = val;
      },
      async getDetail() {
        const { data } = await detailAccount({ accountNo: this.accountNo });
        for (const key in data) {
          this.form[key] = data[key];
        }
      },
      async handleSubmit() {
        const params = { ...this.form };

        if (!params.subStoreId) {
          params.subStoreName = '';
        }

        if (!this.accountNo) {
          await addAccount(params);
        } else {
          await editAccount(params);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-container {
    @font-face {
      font-family: 'password';
      src: url('../../../font/password.ttf');
    }

    /deep/ #account_pass {
      font-family: 'password';
    }

    /deep/ .flex-row .el-form-item__content {
      display: flex;
    }

    /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #333;
    }

    .switch-style {
      .el-switch__label {
        position: absolute;
        color: #fff !important;
        z-index: 1;
        display: none;
      }

      .is-active {
        display: block;
      }

      .el-switch__label--left span {
        margin-left: 20px;
      }
    }
  }
</style>
