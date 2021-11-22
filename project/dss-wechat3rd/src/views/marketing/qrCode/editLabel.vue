<template>
  <el-dialog :title="title" :visible.sync="dialogShow" class="edit-label">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item :label="desc" label-width="80px" prop="name">
        <el-input v-model.trim="form.name" :maxlength="14"></el-input>
        <span class="maxLen">{{form.name ? form.name.length : 0}}/14</span>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="subimt" :loading="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
export default {
  data() {
    return {
      loading: false,
      form: {
        name: ''
      },
      labelValue: {},
      edit: false,
      desc: '',
      title: '',
      type: '',
      dialogShow: false,
      rules: {
        name: [{ required: true, message: '请填写', trigger: 'blur' }]
      }
    };
  },
  methods: {
    subimt() {
      this.$refs.form.validate(success => {
        if (!success) return false;
        this.loading = true;
        if (!this.edit && this.type === 'main') {
          // 添加类型
          qrCodeApi
            .addTagType({
              categoryName: this.form.name
            })
            .done(res => {
              this.$emit('addSuccess');
              this.close();
            })
            .always(_ => {
              this.loading = false;
            });
        }
        if (!this.edit && this.type === 'sub') {
          // 添加标签
          qrCodeApi
            .addTag({
              tag: this.form.name,
              categoryId: this.labelValue.id
            })
            .done(res => {
              this.$emit('addSuccess');
              this.close();
            })
            .always(_ => {
              this.loading = false;
            });
        }
        if (this.edit && this.type === 'main') {
          // 编辑类型
          qrCodeApi
            .editTagType({
              categoryName: this.form.name,
              id: this.labelValue.id
            })
            .done(res => {
              this.labelValue.title = this.form.name;
              this.close();
            })
            .always(_ => {
              this.loading = false;
            });
        }
        if (this.edit && this.type === 'sub') {
          // 编辑标签
          qrCodeApi
            .editTagName({
              categoryName: this.form.name,
              id: this.labelValue.subId
            })
            .done(res => {
              this.labelValue.title = this.form.name;
              this.close();
            })
            .always(_ => {
              this.loading = false;
            });
        }
      });
    },
    show(params) {
      this.dialogShow = true;
      this.edit = params.edit;
      this.type = params.type;
      this.desc = params.type === 'main' ? '标签类型' : '标签';
      this.title = params.edit ? '编辑' + this.desc : '添加' + this.desc;
      if (params.edit) {
        this.labelValue = params.data;
        this.form.name = params.data.title;
      } else {
        this.form.name = '';
        console.log(params.data);
        this.labelValue = params.data ? params.data : {};
      }
    },
    close() {
      this.dialogShow = false;
    }
  }
};
</script>

<style lang="less">
.edit-label {
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
