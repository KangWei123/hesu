<template>
  <el-dialog title="修改名称" :visible.sync="dialogShow" class="edit-qrCode" @close="close">
    <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent>
      <el-form-item label="名称" label-width="80px" prop="qrName">
        <el-input v-model.trim="form.qrName" :maxlength="14"></el-input>
        <span class="maxLen">{{form.qrName ? form.qrName.length : 0}}/14</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="subimt" :loading='loading'>确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';
export default {
  mixins: [AdapterIfr.AdapterMixins],
  data() {
    return {
      loading: false,
      form: {
        qrName: ''
      },
      qrValue: {},
      dialogShow: false,
      rules: {
        qrName: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      }
    };
  },
  methods: {
    subimt() {
      this.$refs.form.validate(success => {
        if (!success) return false;
        this.loading = true;
        qrCodeApi
          .updated({
            id: this.qrValue.id,
            qrName: this.form.qrName
          })
          .done(res => {
            this.dialogShow = false;
            this.adapterIfmMask(false);
            this.qrValue.qrName = this.form.qrName;
          })
          .always(_ => {
            this.loading = false;
          });
      });
    },
    show(data) {
      this.dialogShow = true;
      this.adapterIfmMask(true);
      this.form.qrName = data && data.qrName;
      this.qrValue = data;
    },
    close() {
      this.dialogShow = false;
      this.adapterIfmMask(false);
    }
  }
};
</script>

<style lang="less">
.edit-qrCode {
  .el-form-item {
    position: relative;
    .maxLen {
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      position: absolute;
    }
  }
}
</style>
