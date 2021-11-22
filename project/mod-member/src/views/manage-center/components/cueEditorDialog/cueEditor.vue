<template>
  <el-form
    class="dss-member-editor-form"
    :model="form"
    :rules="rules"
    ref="form"
    label-width="100px"
    v-loading="isLoading"
  >
    <!--<el-form-item label="客户头像："-->
    <!--class="member-upload">-->
    <!--<el-upload class="avatar-uploader"-->
    <!--action="/wp/materials/addLocal"-->
    <!--:data="params"-->
    <!--:show-file-list="false"-->
    <!--:auto-upload="false"-->
    <!--name='files'-->
    <!--:on-change="beforeAvatarUpload">-->
    <!--<img v-if="form.avatar"-->
    <!--:src="form.avatar"-->
    <!--class="avatar">-->
    <!--<i v-else-->
    <!--class="el-icon-plus avatar-uploader-icon"></i>-->
    <!--</el-upload>-->
    <!--</el-form-item>-->
    <el-form-item label="姓名：" prop="realName">
      <el-input v-model="form.realName" style="width: 280px" clearable></el-input>
    </el-form-item>
    <el-form-item label="联系电话：" prop="phone">
      <el-input v-model="form.phone" style="width: 280px" clearable maxlength="11"></el-input>
      <div v-if="isEdit" class="member-desc">请谨慎修改，该手机号是用户的会员标识</div>
    </el-form-item>
    <el-form-item label="性别：" prop="gender">
      <el-radio v-model="form.gender" :label="commonEnum.SEX.Male">男 </el-radio>
      <el-radio v-model="form.gender" :label="commonEnum.SEX.Female">女 </el-radio>
    </el-form-item>
    <el-form-item label="来源门店:" prop="storeId">
      <el-select
        style="width: 280px"
        placeholder="请选择"
        size="mini"
        @change="onFilterStore"
        default-first-option
        v-model="form.storeId"
        filterable
        clearable
      >
        <el-option v-for="item in storeList" :key="item.value" :label="item.name" :value="item.value"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="出生年月：" prop="birthday">
      <el-date-picker
        v-model="form.birthday"
        style="width: 280px"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      >
      </el-date-picker>
    </el-form-item>

    <el-form-item style="margin-top: 25px">
      <el-button class="dss-btn-primary dss-btn-middle" type="primary" @click="save('form')">保存 </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import regexps from '@/dss-common/utils/regexps';
  import { constants } from '@/register/material';
  // import MaterialsConfig from '../../constants/MaterialsConfig';
  import { commonEnum } from '@/business-common/constants';
  import api from '@/mod-member/src/api/manage';
  import { mapState } from 'vuex';
  import './index.less';

  export default {
    name: 'MemberEditor',
    props: {
      // 是否为编辑
      isEdit: {
        type: Boolean,
        default: false,
      },
      // 用户id
      id: {
        type: Number,
        default: -1,
      },
      // 关闭弹窗函数
      closeHandler: {
        type: Function,
      },
      close: {
        type: Function,
      },
      isRefresh: {
        type: Function,
      },
    },
    data() {
      const { name, phone } = regexps;
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        commonEnum,
        isChange: false,
        realName: null,
        form: {
          avatar: null,
          realName: null,
          phone: null,
          gender: commonEnum.SEX.Male,
          birthday: null,
          storeId: null,
          customerSource: null,
        },
        rules: {
          realName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            {
              min: 1,
              max: 20,
              message: '长度在 1 到 20 个字符',
              trigger: 'blur',
            },
            { pattern: name.reg, message: name.msg },
          ],
          phone: [
            { required: true, message: '请输入您的手机号码', trigger: 'blur' },
            { pattern: phone.reg, message: phone.msg, trigger: 'blur' },
          ],
          gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
          storeId: [{ required: true, message: '请选择门店', trigger: 'change' }],
          // customerSource: [{ required: true, message: '请选择渠道', trigger: 'change' }],
        },

        storeList: [],
        params: {
          type: 1,
        },
        accept: constants.FILE_ACCEPT[constants.FILE_TYPES.THUMB],

        store: null,
        allList: [],
        isLoading: false,
      };
    },
    computed: {
      ...mapState({
        allStoreList: 'storeList',
        userInfo: 'userInfo',
      }),
    },

    methods: {
      getStores() {
        api
          .queryList()
          .then(res => {
            res.data.forEach(item => {
              this.storeList.push({
                value: item.id,
                name: item.name,
              });
            });
          })
          .catch(err => {});
      },
      onFilterStore(item) {
        this.form.storeId = item;
      },
      onFilterSource(item) {
        this.form.source = item;
      },
      save(data) {
        this.isSaving = true;
        this.$refs[data]
          .validate()
          .then(valid => {
            if (!valid) {
              return;
            }
            const params = {
              ...this.form,
            };
            let keyMethod = 'add';
            //  如果是编辑
            if (this.isEdit) {
              params.id = this.id;
              keyMethod = 'update';
              // 如果人脸头像没修改过，不传avatar给后端
              if (!this.isChange) {
                const key = 'avatar';
                delete params[key];
              }
            } else {
              params.source = 12; // 新增默认来源-手工导入
            }
            api[keyMethod](params).done(res => {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.isRefresh();
              this.close();
              /* this.closeHandler(res) */
            });
          })
          .catch(res => {
            return false;
          });
      },

      beforeAvatarUpload(file) {
        const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/jpg';
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!');
          return false;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = e => {
          this.form.avatar = e.target.result; // 图片的base64数据
        };
        this.isChange = true;
        return isJPG && isLt2M;
      },
    },

    mounted: function () {
      this.getStores();
      if (this.isEdit) {
        this.isLoading = true;
        // 会员详情
        api
          .getClient({ id: this.id })
          .then(res => {
            const detail = res.data || {};
            const avatar = detail.avatar ? '' + detail.avatar : null;
            this.form = {
              realName: detail.realName,
              gender: detail.gender,
              birthday: detail.birthday,
              phone: detail.phone,
              storeId: detail.storeId,
            };
          })
          .catch(err => {})
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
  };
</script>

<style></style>
