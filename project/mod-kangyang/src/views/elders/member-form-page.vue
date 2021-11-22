<template>
  <form-page-layout :title-visible="false">
    <div class="page-content">
      <el-form
        ref="form"
        v-loading="loading"
        :model="form"
        :rules="rules"
        label-width="140px"
        @submit.native.prevent="handleSave"
      >
        <div>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <div>
              <el-radio v-model="form.gender" :label="1">男</el-radio>
              <el-radio v-model="form.gender" :label="2">女</el-radio>
            </div>
          </el-form-item>

          <el-form-item label="与长者关系" prop="relationshipType">
            <el-select v-model="form.relationshipType" class="w220">
              <el-option
                v-for="item of relationTypes"
                :key="item.relationType"
                :value="item.relationType"
                :label="item.relationTypeName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="证件类型" prop="credentialType">
            <el-select v-model="form.credentialType" class="w220" :disabled="isEdit">
              <el-option
                v-for="item of cardTypes"
                :key="item.credentialType"
                :value="item.credentialType"
                :label="item.credentialTypeName"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="证件号码" prop="credentialNo">
            <el-input
              v-model="form.credentialNo"
              maxlength="25"
              class="w220"
              placeholder="请输入"
              :disabled="isEdit"
            ></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="所在地" prop="area">
            <region-select
              ref="regionSelect"
              v-model="form.area"
              :check-strictly="false"
              class="w250"
              :placeholder="form.areaName || '请选择省-市-区'"
            />
          </el-form-item>

          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="是否长者监护人" prop="isGuardian">
            <div>
              <el-radio v-model="form.isGuardian" :label="true">是</el-radio>
              <el-radio v-model="form.isGuardian" :label="false">否</el-radio>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="$router.go(-1)">取消</el-button>

      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </form-page-layout>
</template>

<script>
  import { elderApi } from '@/mod-kangyang/src/api';
  import regexps from '@/dss-common/utils/regexps';
  import { FormPageLayout, FormGroup } from '@/dss-common/components/form-page';
  import RegionSelect from './components/region-select';

  const required = message => ({ required: true, message: message || '不能为空' });
  const rules = {
    name: [required('请输入姓名')],
    gender: [required('请选择性别')],
    relationshipType: [required('请选择与长者关系')],
    credentialType: [required('请选择证件类型')],
    credentialNo: [required('请输入证件号码')],
    mobile: [
      required('请输入联系电话'),
      { pattern: regexps.phone.reg, message: '请输入正确的联系电话', trigger: 'blur' },
    ],
    address: [required('请输入详细地址')],
    area: [required('请选择所在地')],
    isGuardian: [required('请输入活动详情')],
  };

  /**
   * 创建和编辑亲友
   */
  export default {
    name: 'MemberFormPage',
    components: {
      FormPageLayout,
      FormGroup,
      RegionSelect,
    },
    data() {
      return {
        relationTypes: [],
        cardTypes: [],
        rules,
        loading: false,
        loaded: false,
        form: {
          id: undefined,
          name: '',
          gender: 0,
          relationshipType: undefined,
          credentialType: undefined,
          credentialNo: undefined,
          mobile: undefined,
          area: undefined,
          areaName: '',
          address: undefined,
          isGuardian: undefined,
        },
      };
    },
    computed: {
      elderId() {
        return this.$route.params.elderId;
      },
      id() {
        return this.$route.params.id;
      },
      isEdit() {
        return !!this.id;
      },
    },
    async mounted() {
      this.getRelationTypes();
      this.getTypes();
      if (this.isEdit) {
        const { data } = await elderApi.getElderMemberDetail({ elderId: this.elderId, id: this.id });
        this.origin = data;
        const normalized = this.fromPayload(data);
        Object.assign(this.form, normalized);
      }
      this.loaded = true;
    },

    methods: {
      handleSave() {
        this.$refs.form
          .validate()
          .then(res => {
            this.save();
          })
          .catch(err => {
            console.log('检验失败', err);
          });
      },

      fromPayload(data) {
        const { appId, createTime, areaName, areaCode, ...rest } = data || {};
        return {
          ...rest,
          area: [areaCode],
          areaName,
        };
      },

      toPayload() {
        const { value, pathLabels } = this.$refs.regionSelect.getCheckedNodes();
        const { area, areaName, ...others } = this.form;
        const areaCode = area[area.length - 1];

        const payload = {
          ...others,
          areaCode: value || areaCode,
          areaName: pathLabels || areaName,
          elderId: +this.elderId,
        };

        return payload;
      },

      async getRelationTypes() {
        const { data } = await elderApi.getRelationTypes();
        this.relationTypes = data;
      },

      async getTypes() {
        const { data } = await elderApi.getCardTypes();
        this.cardTypes = data;
      },

      async save() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          if (this.isEdit) {
            payload.id = +this.id;
          }
          await elderApi.saveElderMember(payload);
          this.$message.success('保存成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .page-content {
    background-color: #fff;
    padding-bottom: 60px;
    position: relative;

    /deep/ .el-input-number .el-input__inner {
      text-align: left;
    }
  }

  .w220 {
    width: 220px;
  }
</style>
