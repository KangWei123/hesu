<template>
  <el-dialog
    :title="`开通${curServicer.deliveryName}申请`"
    :visible="true"
    :append-to-body="true"
    :show-close="false"
    center
    width="500px"
  >
    <el-form :model="servicerInfo" :rules="servicerRules" label-width="100px" ref="servicerForm">
      <el-form-item label="注册商户号" prop="mobile">
        <el-input
          placeholder="请输入手机号"
          :maxlength="11"
          style="width:300px"
          v-model="servicerInfo.mobile"
        ></el-input>

        <div class="servicer-form-tip">用于登录{{ curServicer.deliveryName }}商户平台</div>
      </el-form-item>

      <el-form-item label="商户城市名" prop="cityCode">
        <el-select
          v-model="servicerInfo.cityCode"
          filterable
          style="width:300px"
          ref="citySelect"
          placeholder="请选择城市"
        >
          <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityCode">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="企业全称" prop="enterpriseName">
        <el-input
          placeholder="请输入企业全称"
          style="width:300px"
          :maxlength="30"
          v-model="servicerInfo.enterpriseName"
        ></el-input>
      </el-form-item>

      <el-form-item label="企业地址" prop="enterpriseAddress">
        <el-input
          placeholder="请输入企业地址"
          style="width:300px"
          :maxlength="70"
          v-model="servicerInfo.enterpriseAddress"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系人姓名" prop="contactName">
        <el-input
          placeholder="请输入联系人姓名"
          style="width:300px"
          :maxlength="5"
          v-model="servicerInfo.contactName"
        ></el-input>
      </el-form-item>

      <el-form-item label="联系人手机" prop="contactPhone">
        <el-input
          placeholder="请输入联系人手机"
          style="width:300px"
          :maxlength="11"
          v-model="servicerInfo.contactPhone"
        ></el-input>
      </el-form-item>

      <el-form-item label="邮箱地址" prop="email">
        <el-input placeholder="请输入邮箱地址" style="width:300px" v-model="servicerInfo.email"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSure">确定开通 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import regexps from '@/dss-common/utils/regexps';
import api from '@/dss-setting/src/api';

export default {
  props: {
    brandInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    curServicer: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      cityList: [],
      servicerInfo: {
        mobile: '',
        cityCode: '',
        enterpriseName: '',
        enterpriseAddress: '',
        contactName: '',
        contactPhone: '',
        email: ''
      },
      servicerRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: regexps.phone.reg, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        cityCode: [{ required: true, message: '请选择商户城市名', trigger: 'blur' }],
        enterpriseName: [
          { required: true, message: '请输入企业全称', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '企业全称字母、数字或汉字 组成', trigger: 'blur' },
          {
            min: 1,
            max: 30,
            message: '长度在 1 到 30 个字符',
            trigger: 'blur'
          }
        ],
        enterpriseAddress: [{ required: true, message: '请输入企业地址', trigger: 'blur' }],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { pattern: regexps.simpleName.reg, message: '请输入正确的联系人姓名', trigger: 'blur' },
          {
            min: 1,
            max: 8,
            message: '长度在 1 到 8 个字符',
            trigger: 'blur'
          }
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机', trigger: 'blur' },
          { pattern: regexps.phone.reg, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { pattern: regexps.email.reg, message: regexps.email.msg, trigger: 'blur' }
        ]
      }
    };
  },

  mounted() {
    this.queryCityInfo();
    this.queryBrandInfo();
  },

  methods: {
    //取消
    handleCancel() {
      this.$emit('cancel');
    },

    //确定
    handleSure() {
      this.$refs.servicerForm.validate(valid => {
        if (!valid) {
          return false;
        }

        let params = { ...this.servicerInfo };

        params.cityName = this.$refs.citySelect.selectedLabel;
        this.$emit('done', params);
      });
    },

    queryCityInfo() {
      api.queryCityInfo({ deliveryType: this.curServicer.deliveryType }).then(res => {
        this.cityList = res.data || [];
      });
    },

    queryBrandInfo() {
      api.queryBrandInfo({}).then(res => {
        if (res.data) {
          this.servicerInfo = res.data;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.servicer-form-tip {
  line-height: normal;
  margin-top: 5px;
}
</style>
