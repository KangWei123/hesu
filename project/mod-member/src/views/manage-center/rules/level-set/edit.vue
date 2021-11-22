<template>
  <div class="level-set-edit">
    <el-form
      class="form"
      label-width="120px"
      @submit.native.prevent
      ref="form"
      :rules="rules"
      :model="form"
      v-loading="loading"
    >
      <el-form-item label="客户阶段名称:" prop="stageName">
        <el-input v-model.trim="form.stageName" placeholder="输入客户阶段名称" />
      </el-form-item>
      <el-form-item label="客户阶段描述:" prop="stageDesc">
        <el-input
          type="textarea"
          rows="4"
          maxlength="100"
          v-model.trim="form.stageDesc"
          placeholder="输入客户阶段描述"
        />
        <span style="color: #999; padding-left: 10px">{{ (form.stageDesc && form.stageDesc.length) || 0 }}/100</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSave" :loading="loading">保存</el-button>
        <el-button @click="onCancel" :disabled="loading">取消</el-button>
      </el-form-item>
    </el-form>
    <img-material
      v-if="showImageDialog"
      @cancel="onCanclePickImg"
      @picked="onPickedImg"
      :is-wx-source="false"
      :multiple="false"
    />
  </div>
</template>

<script>
  import manageApi from '@/mod-member/src/api/manage.js';
  export default {
    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请添加阶段图标'));
        } else {
          callback();
        }
      };
      return {
        id: '',
        loading: false,
        showImageDialog: false,
        form: {
          id: this.$route.query.id,
          stageId: this.$route.query.stageId,
          stageName: this.$route.query.stageName,
          stageDesc: this.$route.query.stageDesc,
        },
        rules: {
          stageName: [{ required: true, message: '请输入阶段名称', trigger: 'blur' }],
          stageDesc: [{ required: true, message: '请输入客户描述', trigger: 'blur' }],
        },
      };
    },
    methods: {
      onSave() {
        this.$refs.form
          .validate()
          .then(valid => {
            this.loading = true;
            return manageApi.updateClientStageName({
              judgeType: this.id ? null : 2,
              ...this.form,
            });
          })
          .then(res => {
            this.$message.success(`${this.form.id ? '修改' : '添加'}客户阶段成功！`);
            this.$router.push('/manage/rules/level-set');
          })
          .finally(_ => {
            this.loading = false;
          });
      },
      onCancel() {
        this.$router.push('/manage/rules/level-set');
      },
    },
    mounted() {
      this.id = this.$route.query.id || '';
    },
  };
</script>

<style scoped lang="less">
  /deep/.el-input {
    width: 300px;
  }
  /deep/.el-textarea {
    width: 300px !important;
  }
  .level-set-edit {
    margin: 30px 20px;
  }
  .stage-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
    line-height: 80px;
    font-size: 20px;
    border: 1px solid #eee;
    cursor: pointer;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }
  }
</style>
