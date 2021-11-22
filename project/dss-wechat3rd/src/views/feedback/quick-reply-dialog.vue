<template>
  <el-dialog
    :visible.sync="visible"
    :title="form.id ? '编辑' : '新增'"
    width="435px"
    append-to-body
    destory-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="90px" label-suffix=":">
      <el-form-item label="回复类型" prop="replyType">
        <el-input v-model.trim="form.replyType" maxlength="20" placeholder="不超过20个字"></el-input>
      </el-form-item>

      <el-form-item label="回复内容" prop="replyContant">
        <el-input
          type="textarea"
          v-model.trim="form.replyContant"
          maxlength="250"
          placeholder="不超过250个字"
          :rows="4"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import api from '@/dss-wechat3rd/src/api/feedback';

  export default {
    data() {
      return {
        visible: false,
        form: this.initForm(),
        rules: {
          replyType: [{ required: true, message: '请输入回复类型', trigger: 'blur' }],
          replyContant: [{ required: true, message: '请输入回复内容', trigger: 'blur' }],
        },
      };
    },
    methods: {
      initForm() {
        return {
          replyType: '',
          replyContant: '',
          // 意见反馈状态隔离
          typeStatus: 1,
        };
      },
      show(row) {
        this.form = this.initForm();
        if (row) {
          this.form = { ...row };
        }

        this.visible = true;
      },
      handleConfirm() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            const params = { ...this.form };
            let method = 'add';

            if (params.id) {
              method = 'edit';
            }

            await api[`${method}QuickFeedBack`](params);

            this.visible = false;
            this.$emit('update', params);
          }
        });
      },
    },
  };
</script>
