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
        <h3>01.长者基础信息</h3>
        <div>
          <el-form-item label="姓名" prop="name">
            <el-input v-model.trim="form.name" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <div>
              <el-radio v-model="form.gender" :label="1">男</el-radio>
              <el-radio v-model="form.gender" :label="2">女</el-radio>
            </div>
          </el-form-item>

          <el-form-item label="证件类型" prop="credentialType">
            <el-select v-model="form.credentialType" :disabled="isEdit" class="w220">
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
              :disabled="isEdit"
              maxlength="25"
              class="w220"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"> </el-date-picker>
          </el-form-item>

          <el-form-item label="国籍" prop="country">
            <el-input v-model="form.country" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="民族" prop="nation">
            <el-input v-model="form.nation" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="所在地" prop="area">
            <region-select
              ref="regionSelect"
              v-model="form.area"
              :check-strictly="false"
              class="w220"
              :class="{ 'has-value': !!form.areaName }"
              :placeholder="isEdit ? form.areaName : '请选择省-市-区'"
            />
          </el-form-item>

          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item label="联系电话" prop="mobile">
            <el-input v-model="form.mobile" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>
        </div>

        <h3>02.长者服务信息</h3>
        <div>
          <el-form-item label="服务项目">
            <span>{{ prjName }}</span>
          </el-form-item>
          <el-form-item label="房号" prop="roomNo">
            <el-input v-model="form.roomNo" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="床号" prop="bedNo">
            <el-input v-model="form.bedNo" maxlength="25" class="w220" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="护理等级" prop="nursingGrade">
            <el-select v-model="form.nursingGrade" class="w220">
              <el-option
                v-for="item of nursingGrades"
                :key="item.nursingGrade"
                :value="item.nursingGrade"
                :label="item.nursingGradeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否包房" prop="privateRoom">
            <div>
              <el-radio v-model="form.privateRoom" :label="true">是</el-radio>
              <el-radio v-model="form.privateRoom" :label="false">否</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="入住状态" prop="checkInState">
            <el-select v-model="form.checkInState" class="w220">
              <el-option
                v-for="item of checkInStates"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="入住时间" prop="checkInDate">
            <el-date-picker v-model="form.checkInDate" type="date" placeholder="选择日期"></el-date-picker>
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
  import { CheckInStates } from './constants';
  import { formatDateIfNeed } from '@/mod-kangyang/src/utils';

  const required = message => ({ required: true, message: message || '不能为空' });
  const rules = {
    name: [required('请输入姓名')],
    gender: [required('请选择性别')],
    credentialType: [required('请选择证件类型')],
    credentialNo: [required('请输入证件号码')],
    birthday: [required('请选择出生日期')],
    country: [required('请选择国籍')],
    address: [required('请输入详细地址')],
    mobile: [
      required('请输入联系电话'),
      { pattern: regexps.phone.reg, message: '请输入正确的联系电话', trigger: 'blur' },
    ],
    area: [required('请选择所在地')],
    isGuardian: [required('请输入活动详情')],
  };

  /**
   * 创建和编辑长者
   */
  export default {
    name: 'ElderFormPage',
    components: {
      FormPageLayout,
      FormGroup,
      RegionSelect,
    },
    data() {
      return {
        relationTypes: [],
        cardTypes: [],
        checkInStates: CheckInStates,
        rules,
        loading: false,
        loaded: false,
        form: {
          id: undefined,
          name: '',
          gender: 0,
          credentialType: undefined,
          credentialNo: undefined,
          birthday: undefined,
          country: undefined,
          nation: undefined, // 民族
          area: [],
          areaCode: undefined,
          areaName: undefined,
          address: undefined,
          mobile: undefined,

          roomNo: undefined,
          bedNo: undefined,
          nursingGrade: undefined,
          privateRoom: undefined,
          checkInState: undefined,
          checkInDate: undefined,
        },
        nursingGrades: [],
      };
    },
    computed: {
      elderId() {
        return this.$route.params.elderId;
      },
      isEdit() {
        return !!this.elderId;
      },
      prjName() {
        return this.$route.query.name;
      },
      prjId() {
        return this.$route.query.prjId;
      },
    },
    async mounted() {
      this.getRelationTypes();
      this.getTypes();
      this.getNursingGrades();
      if (this.isEdit) {
        const { data } = await elderApi.getDetail({ id: +this.elderId });
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
        const { elderPrjInfoList, areaCode, areaName, ...rest } = data;
        const normalized = rest;
        const prject = elderPrjInfoList.find(item => item.prjId == this.prjId);
        const { id, upateTime, createTime, ...prjRest } = prject || {};
        return {
          ...normalized,
          ...prjRest,
          area: [areaCode],
          areaCode,
          areaName,
        };
      },

      toPayload() {
        const { birthday, area, areaCode, areaName, checkInDate, ...others } = this.form;
        const { value, pathLabels } = this.$refs.regionSelect.getCheckedNodes();

        const payload = {
          ...others,
          areaCode: value || areaCode,
          areaName: pathLabels || areaName, // 如果修改时，没有重新选，则用从 API 返回的值
          prjId: +this.prjId,
          birthday: formatDateIfNeed(birthday),
          checkInDate: formatDateIfNeed(checkInDate),
        };

        if (this.isEdit) {
          payload.id = this.elderId;
        }

        return payload;
      },

      async getRelationTypes() {
        const { data } = await elderApi.getRelationTypes();
        this.relationTypes = data;
      },

      async getTypes() {
        const { data } = await elderApi.getCardTypes({});
        this.cardTypes = data;
      },

      async save() {
        const payload = this.toPayload();
        try {
          this.loading = true;
          await elderApi.addElder(payload);
          this.$message.success('保存成功');
          this.$router.go(-1);
        } finally {
          this.loading = false;
        }
      },

      async getNursingGrades() {
        const { data } = await elderApi.getNursingGrades();
        this.nursingGrades = data || [];
      },
    },
  };
</script>

<style lang="less" scoped>
  .page-content {
    background-color: #fff;
    padding-bottom: 60px;

    /deep/ .el-date-editor .el-input__inner {
      padding-left: 30px;
    }
  }

  .w220 {
    width: 220px;
  }
</style>
