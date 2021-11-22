<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="550px"
    @opened="dialogOpen"
    @closed="closeAddRuleDialog"
    center
  >
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="规则名称：" prop="ruleName">
        <el-input v-model.trim="form.ruleName" style="width: 80%" :maxlength="35"></el-input>
      </el-form-item>
      <el-form-item label="IP段：" style="margin-bottom: 10px">
        <ip-input ref="fromIpInput" flag="from"></ip-input>
      </el-form-item>
      <el-form-item style="margin: 0">至</el-form-item>
      <el-form-item style="margin: 0">
        <ip-input ref="toIpInput" flag="to"></ip-input>
      </el-form-item>
      <el-form-item style="margin-top: 10px">
        <span style="color: #ccc"> 1个IP则只填写第一个框 </span>
      </el-form-item>
      <el-form-item label="启用状态：" prop="ipStatus">
        <el-radio v-model="form.ipStatus" :label="1">启用</el-radio>
        <el-radio v-model="form.ipStatus" :label="0">禁用</el-radio>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateRule" style="width: 150px">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import ipInput from './ip-input.vue';
  import * as whiteSettingApi from '../../../api/whiteSettingApi';

  export default {
    name: 'AddIpDialog',
    components: {
      ipInput,
    },
    props: {
      addRuleDialogVisible: {
        type: Boolean,
        default: false,
      },
      dialogTitle: {
        type: String,
        default: '',
      },
      dialogForm: {
        type: Object,
        default: null,
      },
      ipType: {
        type: String,
        default: '',
      },
      handleFlag: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        dialogVisible: false,
        form: {
          fromIp: '',
          toIp: '',
          id: '',
          ipType: '',
          modifiedBy: '',
          ipStatus: 1,
          ruleName: '',
        },
        rules: {
          ruleName: [{ required: true, message: '请输入新增规则名称', trigger: 'blur' }],
        },
        fromIp: '',
        toIp: '',
      };
    },
    watch: {
      addRuleDialogVisible(newVal) {
        this.dialogVisible = newVal;
      },
      dialogForm(newVal) {
        if (newVal) this.form = newVal;
      },
    },
    methods: {
      closeAddRuleDialog() {
        this.dialogVisible = false;
        this.$refs.form.resetFields();
        for (const key in this.form) {
          this.form[key] = key === 'ipStatus' ? 1 : '';
        }
        this.$emit('update:dialogForm', { ...this.form });
        this.$emit('update:addRuleDialogVisible', false);
        this.$refs.fromIpInput.clear();
        this.$refs.toIpInput.clear();
      },

      dialogOpen() {
        this.$refs.fromIpInput.initData();
        this.$refs.toIpInput.initData();
      },

      checkBeforeUpdate() {
        this.$refs.form.validate(valid => {
          if (valid) {
            if (this.$refs.fromIpInput.ipCheck()) {
              const updateFromIp = Object.values(this.$refs.fromIpInput.ipRange);
              const updateToIp = Object.values(this.$refs.toIpInput.ipRange);
              const length = updateToIp.filter(o => !!o).length;
              this.fromIp = updateFromIp.join('.');
              this.toIp = length ? updateToIp.join('.') : null;
            }
          }
        });
      },

      async updateRule() {
        this.checkBeforeUpdate();

        if (this.fromIp !== '' && this.toIp !== '') {
          const { fromIp, toIp } = this.$data;
          const reqFlag = this.handleFlag === 0 ? 'ipAdd' : 'ipUpdate';
          const reqParam = {
            fromIp,
            toIp,
            id: this.form.id,
            modifiedBy: this.$store.state.global_info.userName,
            ipStatus: this.form.ipStatus,
            ruleName: this.form.ruleName,
            ipType: this.ipType === 'white' ? 1 : 0,
          };

          if (this.dialogTitle === '新增IP规则') reqParam.ipType = this.ipType === 'white' ? 1 : 0;
          try {
            await whiteSettingApi[reqFlag](reqParam);
            this.fromIp = '';
            this.toIp = '';
            this.$emit('done');
            this.dialogVisible = false;
          } catch (error) {
            console.log('error', error);
          }
        }
      },
    },
  };
</script>
<style lang="less" scoped></style>
