<template>
  <el-dialog :visible.sync="showPopup" title="是否审核通过" width="560px">
    <el-form ref="form" :model="form" :rules="rules" label-width="70px">
      <el-form-item label=" ">
        <el-radio-group v-model="form.approveStatus">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.approveStatus" label="原因" prop="refuseReason">
        <el-input v-model="form.refuseReason" type="textarea" placeholder="请输入" :autosize="{ minRows: 4 }" />
      </el-form-item>
    </el-form>
    <div style="text-align: center">
      <el-button style="width: 92px" @click="close">取消</el-button>
      <el-button v-loading="loading" type="primary" style="width: 92px" @click="confirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { relativeVerifyApi } from '@/mod-kangyang/src/api';

  export default {
    props: {
      value: {
        type: Boolean,
        required: true,
      },
      id: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        loading: false,
        form: {
          id: null,
          approveStatus: true,
          refuseReason: '',
        },
        rules: {
          refuseReason: [{ required: true, message: '请输入原因', trigger: 'change' }],
        },
      };
    },
    computed: {
      // 计算属性-是否显示弹窗
      showPopup: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        },
      },
    },
    methods: {
      close() {
        this.$emit('input', false);
      },
      confirm() {
        this.$refs.form.validate(async valid => {
          if (valid) {
            try {
              this.loading = true;
              await relativeVerifyApi.approve({
                ...this.form,
                id: this.id,
              });
              this.close();
              this.$emit('refresh');
            } finally {
              this.loading = false;
            }
          }
        });
      },
    },
  };
</script>
