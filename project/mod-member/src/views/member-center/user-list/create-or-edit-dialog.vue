<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="visible"
    :title="isEdit ? '编辑会员' : '新增会员'"
    append-to-body
    width="660px"
    :close-on-click-modal="false"
    destory-on-close
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      @submit.native.prevent="handleConfirm"
      label-width="100px"
      label-suffix=":"
      style="padding: 0 154px 0 100px"
    >
      <el-form-item style="margin-left: -85px; text-align: center" prop="avatar">
        <avatar-picker
          class="avatar-item"
          v-model="form.avatar"
          :params="{ type: constants.FILE_TYPES.IMAGE }"
        ></avatar-picker>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model.trim="form.realName" class="w100" placeholder="请输入真实姓名" maxlength="10" />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="form.phone" class="w100" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item label="来源应用" prop="appId">
        <app-select
          :disabled="isEdit"
          ref="appSelect"
          v-model="form.appId"
          group-selectable
          class="w100"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="生日" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          class="w100"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd"
          :picker-options="datePickerOptions"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <sex-select in-label v-model="form.gender" class="w100" placeholder="请选择性别"> </sex-select>
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <region-select v-model="form.area" class="w100" placeholder="请选择地区" check-strictly></region-select>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" type="email" class="w100" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="idCard">
        <el-input v-model.trim="form.idCard" class="w100" placeholder="请输入身份证"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import SexSelect from '@/dss-common/components/sex-select';
  import RegionSelect from '@/business-common/components/region-select';
  import { SEX_NAME } from '@/business-common/constants/commonEnum';
  import AppSelect from '@/business-common/components/app-select';
  import { AvatarPicker, constants } from '@/register/material';

  import regexps from '@/dss-common/utils/regexps';
  import idNumberValidate from '@/dss-common/utils/idnumber-validate';
  import api from '@/mod-member/src/api/memberAPI';
  import { ChannelType } from '@/mod-member/src/enum/index';

  const now = new Date();
  now.setHours(0, 0, 0);

  /**
   * 创建和编辑会员
   * @event update(data) 新增或编辑成功
   * @method show(data) 显示，如果传递 data 就是 编辑
   */
  export default {
    name: 'CreateOrEditDialog',
    components: {
      SexSelect,
      AvatarPicker,
      AppSelect,
      RegionSelect,
    },
    props: {},
    data() {
      return {
        constants,
        visible: false,
        form: this.initialForm(),
        datePickerOptions: {
          disabledDate(date) {
            if (date.getTime() > now.getTime()) {
              return true;
            }
            return false;
          },
        },
        rules: {
          realName: {
            required: true,
            message: '请输入真实姓名',
          },
          phone: [
            {
              required: true,
              message: '请输入手机号码',
            },
            {
              pattern: regexps.phone.reg,
              message: '请输入正确的联系电话',
              trigger: 'blur',
            },
          ],
          appId: {
            required: true,
            message: '请输入业态',
            trigger: 'blur',
          },
          email: {
            pattern: regexps.email.reg,
            message: regexps.email.msg,
            trigger: 'blur',
          },
          idCard: {
            trigger: 'blur',
            validator(rule, value, callback) {
              if (!value) {
                callback();
                return;
              }
              if (!idNumberValidate.checkIdCardNo(value)) {
                callback(new Error('请输入正确身份证号码'));
              } else {
                callback();
              }
            },
          },
        },
      };
    },
    computed: {
      isEdit() {
        return !!this.form.userId;
      },
    },
    watch: {
      visible(val) {
        if (val && this.$refs.form) {
          this.$refs.form.resetFields();
        }
      },
    },
    methods: {
      initialForm() {
        return {
          avatar: '',
          realName: '',
          phone: '',
          appId: null,
          birthday: null,
          gender: '男',
          area: null,
          email: '',
          idCard: '',
          accountType: 1,
        };
      },
      show(value) {
        if (value) {
          const {
            avatarImgUrl,
            realname,
            gender,
            province,
            city,
            district,
            appId,
            phone,
            birthday,
            email,
            idCard,
            id,
          } = value;
          this.form = {
            phone,
            birthday,
            email,
            idCard,
            appId,
            userId: id,
            avatar: avatarImgUrl,
            realName: realname,
            gender: SEX_NAME[gender],
            area: [province, city, district].filter(Boolean),
          };
        } else {
          this.form = this.initialForm();
        }
        this.visible = true;
      },
      async handleConfirm() {
        if (!(await this.$refs.form.validate())) {
          return;
        }

        const { area, appId, ...params } = this.form;
        const [province, city, district] = area || [];
        const [{ appName }] = this.$refs.appSelect.getSelected();

        const memberChannel = {
          appId,
          appName,
          epId: this.globalEpId,
          epName: this.globalEpName || '集团',
          channelType: ChannelType.AdminCreate,
          channelName: '后台录入',
        };

        Object.assign(params, { country: '中国', province, city, district, ...memberChannel });

        if (!this.isEdit) {
          Object.assign(params, { memberChannel });
        }

        if (!this.isEdit) {
          await api.memberCenter.create(params);
        } else {
          await api.memberCenter.update(params);
        }

        this.$message.success('保存成功');

        this.visible = false;
        this.$emit('update', params);
      },
    },
  };
</script>

<style lang="less" scoped>
  .w100 {
    width: 100%;
  }

  .avatar-item {
    width: 86px;
    height: 86px;
    background: #f1f1f1;
    border: 0;
  }

  /deep/ .avatar-picker__add {
    font-size: 26px;
    color: #717378;
  }
</style>
