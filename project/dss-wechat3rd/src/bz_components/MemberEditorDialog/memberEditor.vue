<template>
  <el-form class="member-editor-form" :model="memberForm" :rules="rules" ref="memberForm" label-width="100px">
    <el-form-item label="会员头像：" class="member-upload">
      <el-upload
        class="avatar-uploader"
        action="/wp/materials/addLocal"
        :data="params"
        :show-file-list="false"
        :accept="accept"
        name="files"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="memberForm.avatar" :src="memberForm.avatar" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="会员编号：" prop="userNum">
      <el-input v-model="memberForm.userNum" clearable placeholder="可自定义编号，或者系统自动分配"></el-input>
    </el-form-item>

    <el-form-item label="会员等级：" prop="levelName">
      <el-select v-model="memberForm.levelName">
        <el-option v-for="item in levelList" :key="item.id" :label="item.levelName" :value="item.levelName">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="会员姓名：" prop="realName">
      <el-input v-model="memberForm.realName" clearable></el-input>
    </el-form-item>
    <el-form-item label="联系电话：" prop="phone">
      <el-input v-model="memberForm.phone" clearable maxlength="11"></el-input>
      <div v-if="isEdit" class="member-desc">请谨慎修改，该电话是用户的会员标识</div>
    </el-form-item>

    <el-form-item label="性别：" prop="gender">
      <el-radio v-model="memberForm.gender" label="男">男</el-radio>
      <el-radio v-model="memberForm.gender" label="女">女</el-radio>
    </el-form-item>
    <el-form-item label="生日：" prop="birthday">
      <el-date-picker v-model="memberForm.birthday" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="来源门店：" v-if="!isEdit">
      <span v-if="curStore.id">{{ storeName }}</span>
      <el-select v-else class="member-selsect" v-model="store" placeholder="请选择门店">
        <el-option v-for="item in allList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button class="dss-btn-primary dss-btn-middle" type="primary" @click="save('memberForm')">保存 </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import regexps from '@/dss-common/utils/regexps';
  import MaterialsConfig from '@/dss-wechat3rd/src/constants/MaterialsConfig';
  import memberApi from './api.js';
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
      // userId
      userId: {
        type: Number,
        default: -1,
      },
      // storeId
      storeId: {
        type: Number,
        default: 0,
      },
      // 关闭弹窗函数
      closeHandler: {
        type: Function,
      },
    },
    data() {
      const { name, phone } = regexps;
      return {
        currentLevelId: null,
        storeName: null,
        memberForm: {
          avatar: null,
          realName: null,
          phone: null,
          gender: '女',
          birthday: null,
          userNum: null,
          levelName: null,
        },

        rules: {
          userNum: [
            {
              min: 1,
              max: 20,
              message: '编码长度 1 到 20 个字符',
              trigger: 'blur',
            },
          ],
          realName: [
            { required: true, message: '请输入会员姓名', trigger: 'blur' },
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
          levelName: [{ required: true, message: '请选择会员等级', trigger: 'blur' }],
        },
        params: {
          type: 1,
        },
        accept: MaterialsConfig.FILE_ACCEPT[MaterialsConfig.FILE_TYPES.THUMB],
        store: null,
        levelList: [],
        allList: [],
      };
    },
    computed: {
      ...mapState({
        allStoreList: 'storeList',
        curStore: 'curStore',
      }),
    },

    methods: {
      setCurrentLevelId() {
        if (this.levelList) {
          this.levelList.forEach(level => {
            if (level.levelName === this.memberForm.levelName) {
              this.currentLevelId = level.id;
            }
          });
        }
      },

      save(data) {
        this.$refs[data]
          .validate()
          .then(valid => {
            if (!valid) {
              return;
            }

            const storeIdStr = this.store;
            this.setCurrentLevelId();
            const params = {
              ...this.memberForm,
              storeIds: storeIdStr,
              levelId: this.currentLevelId,
            };

            let keyMethod = 'newMember';
            //  如果是更新
            if (this.isEdit) {
              params.userId = this.userId;
              keyMethod = 'updateMember';
            }

            memberApi[keyMethod](params).done(res => {
              this.closeHandler(res);
            });
          })
          .catch(res => {
            return false;
          });
      },

      handleAvatarSuccess(res, file) {
        this.memberForm.avatar = res.data;
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
    },

    mounted: function () {
      // 获取等级列表
      memberApi
        .getLevelSimplyList()
        .then(res => {
          console.log(res.data);
          this.levelList = res.data || [];
        })
        .catch(err => {
          console.error(err);
        });

      if (this.isEdit) {
        // 会员详情
        memberApi
          .detail({ userId: this.userId })
          .then(res => {
            this.memberForm = res.data || {};
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        // 新增时加上默认当前门店
        this.store = this.curStore.id;
        const items = [];
        this.allStoreList.forEach(item => {
          if (item.id) {
            items.push(item);
          }
          if (item.id === this.curStore.id) {
            this.storeName = item.name;
          }
        });
        if (!this.store) {
          this.store = items[0].id;
        }
        this.allList = items;
      }
    },
  };
</script>

<style lang="less" scoped>
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
</style>
