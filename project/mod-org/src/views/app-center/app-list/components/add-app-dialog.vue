<template>
  <el-dialog
    :title="title"
    class="add-app-dialog"
    @opened="onDialogOpen"
    @closed="onDialogClose"
    :visible.sync="dialogVisible"
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="应用图标" prop="logo">
        <single-image-picker v-model="form.logo" :width="80" :height="80"></single-image-picker>
      </el-form-item>
      <el-form-item label="应用名称" prop="appName">
        <el-input class="w200" v-model.trim="form.appName" placeholder="请输入应用名称" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="对应业态" prop="industryId">
        <industry-select
          class="w200"
          v-model="form.industryId"
          :show-ump="!!form.id"
          :clearable="false"
          :disabled="isDisabled"
        ></industry-select>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input class="w200" type="textarea" v-model.trim="form.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleAddOrUpdateApp">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import IndustrySelect from '@/business-common/components/industry-select/index';
  import { SingleImagePicker } from '@/mod-org/ref/components';
  import { addOrUpdateApp } from '@/mod-org/src/api/appApi';
  /**
   * 添加应用
   * value: v-model
   * appInfo: 编辑的应用信息，如果是新增则置为null
   */
  export default {
    name: 'AddAppDialog',
    components: { IndustrySelect, SingleImagePicker },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      appInfo: {
        type: Object,
        default: function () {
          return null;
        },
      },
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        form: {
          id: null,
          logo: 'https://' + process.env.VUE_APP_CDN_DOMAIN + '/resources/dss-web-portal/cdn/web/app/app_112.png',
          appName: null,
          industryId: null,
          desc: '',
        },
        rules: {
          logo: [{ required: true, message: '请上传应用logo', trigger: 'change' }],
          appName: [
            { required: true, message: '请输入应用名称', trigger: 'blur' },
            { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' },
          ],
          industryId: [{ required: true, message: '请选择对应业态', trigger: 'change' }],
          desc: [{ min: 0, max: 28, message: '长度在 0 到 28 个字符', trigger: 'blur' }],
        },
      };
    },
    computed: {
      title() {
        return this.form.id ? '编辑应用' : '新增应用';
      },
      isDisabled() {
        return !!this.form.id;
      },
    },
    watch: {
      value(newVal, oldVal) {
        this.dialogVisible = newVal;
      },
      'form.industryId': {
        handler: function (val) {
          if (!this.form.logo || (this.form.logo && this.form.logo.indexOf('app/app_') > 0)) {
            this.form.logo =
              'https://' + process.env.VUE_APP_CDN_DOMAIN + `/resources/dss-web-portal/cdn/web/app/app_${val}.png`;
          }
        },
      },
    },
    methods: {
      onDialogOpen() {
        this.initData();
      },
      onDialogClose() {
        this.$emit('input', false);
      },
      initData() {
        if (this.appInfo) {
          const { packageId: industryId, ...other } = this.appInfo;
          this.form = { ...other, industryId };
        } else if (this.form.id) {
          this.$refs.form.resetFields();
          this.form.id = null;
          this.form.logo = null;
          this.form.industryId = null;
        } else {
          this.$refs.form.resetFields();
          this.form.id = null;
          this.form.logo = null;
          this.form.industryId = null;
        }
      },
      handleAddOrUpdateApp() {
        this.$refs.form.validate(valid => {
          if (valid) {
            addOrUpdateApp({ ...this.form }).then(res => {
              this.dialogVisible = false;
              this.$emit('done');
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    },
  };
</script>

<style lang="less">
  .add-app-dialog {
    .el-dialog {
      width: 400px;
    }

    .el-dialog__body {
      text-align: left;
    }

    textarea {
      resize: none;
    }
  }
</style>
