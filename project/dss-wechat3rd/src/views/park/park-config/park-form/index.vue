<template>
  <form-page-layout :model="form" :rules="rules" label-width="150px" :title-visible="false" :submit-handler="onSubmit">
    <form-group>
      <template #title>基础设置</template>

      <!--停车场编号-->
      <el-form-item label="停车场编号" prop="code" class="card-label">
        <el-input
          placeholder="请输入停车场编号"
          v-model.trim="form.code"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--停车场名称-->
      <el-form-item label="停车场名称" prop="parkingLotName" class="card-label">
        <el-input
          placeholder="请输入停车场名称"
          v-model.trim="form.parkingLotName"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--停车位数量-->
      <el-form-item label="停车位数量" prop="parkingLotAmount" class="card-label">
        <el-input
          placeholder="请输入停车位数量"
          v-model="form.parkingLotAmount"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--车场地址-->
      <el-form-item label="车场地址" prop="parkingLotAddress" class="card-label">
        <el-input
          placeholder="请输入车场地址"
          v-model.trim="form.parkingLotAddress"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--联系电话-->
      <el-form-item label="联系电话" prop="externalPhone" class="card-label">
        <el-input
          placeholder="请输入联系电话"
          v-model="form.externalPhone"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--联系电话-->
      <el-form-item label="管理员手机号码" prop="adminPhone" class="card-label">
        <el-input
          placeholder="请输入管理员手机号码"
          v-model="form.adminPhone"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--缴费说明-->
      <el-form-item label="缴费说明" prop="payDesc" class="card-label">
        <el-input
          type="textarea"
          v-model="form.payDesc"
          :autosize="{ minRows: 8, maxRows: 8 }"
          placeholder=""
          class="card-describe"
        ></el-input>
      </el-form-item>
    </form-group>
    <form-group>
      <template #title>停车场配置（捷顺）</template>

      <!--商户号-->
      <el-form-item label="商户号" prop="businessCode" class="card-label">
        <el-input
          placeholder="请输入商户号"
          v-model.trim="form.businessCode"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <!--客户号-->
      <el-form-item label="客户号" prop="customerId" class="card-label">
        <el-input
          placeholder="请输入客户号"
          v-model.trim="form.customerId"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <el-form-item label="账号" prop="accountNum" class="card-label">
        <el-input
          type="input"
          v-model.trim="form.accountNum"
          placeholder="请输入账号"
          class="card-w300 primary-inputHeight"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password" class="card-label" v-if="!isEdit">
        <!-- 防止firfox,uc浏览器填充 -->
        <input type="password" style="display: none" />

        <el-input
          type="password"
          v-model="form.password"
          placeholder="请输入密码"
          class="card-w300 primary-inputHeight"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" class="card-label" v-else>
        <!-- 防止firfox,uc浏览器填充 -->
        <input type="password" style="display: none" />

        <el-input
          type="password"
          class="card-w300 primary-inputHeight"
          v-model="form.password"
          placeholder="*****"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>

      <!--singKey-->
      <el-form-item label="singKey" prop="signKey" class="card-label">
        <el-input placeholder="请输入singKey" v-model="form.signKey" class="card-w300 primary-inputHeight"></el-input>
      </el-form-item>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import './index.less';
  import regexps from '@/dss-common/utils/regexps';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';

  export default {
    name: 'ParkForm',
    components: { FormPageLayout, FormGroup, FormButton },
    data() {
      return {
        loading: false,
        isEdit: !!this.$route.query.id,
        form: {
          code: null,
          parkingLotName: null,
          parkingLotAmount: null,
          parkingLotAddress: null,
          externalPhone: null,
          businessCode: null,
          customerId: null,
          accountNum: null,
          password: null,
          signKey: null,
          payDesc: null,
          adminPhone: null,
        },
        rules: {
          code: [
            { required: true, message: '请输入停车场编号', trigger: 'blur' },
            {
              max: 20,
              message: '最多输入20个字符',
              trigger: 'blur',
            },
          ],
          parkingLotName: [
            { required: true, message: '请输入停车场名称', trigger: 'blur' },
            {
              max: 20,
              message: '最多输入20个字符',
              trigger: 'blur',
            },
          ],
          parkingLotAmount: [
            { required: true, message: '请输入停车位数量', trigger: 'blur' },
            {
              pattern: regexps.littleeIntNum.reg,
              message: regexps.littleeIntNum.msg,
              trigger: 'blur',
            },
          ],
          parkingLotAddress: [
            { required: true, message: '请输入车场地址', trigger: 'blur' },
            {
              max: 50,
              message: '最多输入50个字符',
              trigger: 'blur',
            },
          ],
          externalPhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            {
              pattern: regexps.tel.reg,
              message: regexps.tel.msg,
              trigger: 'blur',
            },
          ],
          adminPhone: [
            {
              required: true,
              message: '请输入管理员手机号码',
              trigger: 'blur',
            },
            {
              pattern: regexps.tel.reg,
              message: regexps.tel.msg,
              trigger: 'blur',
            },
          ],
          businessCode: [
            { required: true, message: '请输入商户号', trigger: 'blur' },
            {
              max: 50,
              message: '最多输入50个字符',
              trigger: 'blur',
            },
          ],
          customerId: [
            { required: true, message: '请输入客户号', trigger: 'blur' },
            {
              max: 50,
              message: '最多输入50个字符',
              trigger: 'blur',
            },
          ],
          accountNum: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            {
              max: 50,
              message: '最多输入50个字符',
              trigger: 'blur',
            },
          ],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          signKey: [
            { required: true, message: '请输入signKey', trigger: 'blur' },
            {
              max: 100,
              message: '最多输入100个字符',
              trigger: 'blur',
            },
          ],
          payDesc: [
            { required: true, message: '请输入缴费说明', trigger: 'blur' },
            {
              max: 450,
              message: '最多输入450个字符',
              trigger: 'blur',
            },
          ],
        },
      };
    },

    mounted() {
      if (this.$route.query.id) {
        this.getDetail();
      }
    },

    methods: {
      getDetail() {
        const params = { id: this.$route.query.id };
        parkApi
          .getById(params)
          .then(res => {
            this.form = res.data || {};
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.loading = false;
          });
      },

      async onSubmit() {
        this.loading = true;
        const params = {
          code: this.form.code,
          parkingLotName: this.form.parkingLotName,
          parkingLotAmount: this.form.parkingLotAmount,
          parkingLotAddress: this.form.parkingLotAddress,
          externalPhone: this.form.externalPhone,
          businessCode: this.form.businessCode,
          customerId: this.form.customerId,
          accountNum: this.form.accountNum,
          password: this.form.password,
          signKey: this.form.signKey,
          payDesc: this.form.payDesc,
          adminPhone: this.form.adminPhone,
        };

        let key = 'add';
        if (this.isEdit) {
          params.id = this.$route.query.id;
          key = 'update';
        }
        await parkApi[key](params);
      },
    },
  };
</script>
