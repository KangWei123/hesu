<template>
  <el-dialog
    :title="form.id ? '编辑属性' : '新增属性'"
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="onClose"
  >
    <el-form :model="form" ref="form" label-width="150px" v-loading="loading">
      <el-form-item prop="attrName" label="组织属性名：" :rules="[{ required: true, message: '组织属性名不能为空' }]">
        <el-input
          v-model="form.attrName"
          placeholder="输入属性名"
          style="width: 200px; margin-right: 6px"
          maxlength="10"
        ></el-input>
        <span>{{ form.attrName.length }}/10</span>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button @click="onClose" :disabled="loading">取 消</el-button>
      <el-button type="primary" @click="onConfirm" :disabled="loading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { updateOrganizationAttr, addOrganizationAttr } from '@/mod-org/src/api/organizationFramework';

  export default {
    props: {
      activeItem: {
        type: Object,
        default: null,
      },
      visible: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        form: {
          id: '',
          attrName: '',
        },
        loading: false,
      };
    },
    watch: {
      activeItem(val) {
        this.form.id = (val && val.id) || '';
        this.form.attrName = (val && val.attrName) || '';
      },
    },
    computed: {
      dialogVisible: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    methods: {
      onClose() {
        this.dialogVisible = false;
        this.$refs.form.resetFields();
      },
      async onConfirm() {
        this.loading = true;
        try {
          await this.$refs.form.validate();
          const res = this.form.id
            ? await updateOrganizationAttr(this.form)
            : await addOrganizationAttr({ attrName: this.form.attrName });
          this.$message.success(`${this.form.id ? '编辑属性成功' : '新增属性成功'}`);
          this.$emit('confirm');
          this.onClose();
        } catch (err) {
          console.log(err);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style lang="less" scoped></style>
