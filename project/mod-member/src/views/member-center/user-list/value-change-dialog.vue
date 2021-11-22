<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="visible"
    :title="title"
    width="480px"
    append-to-body
    destory-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="110px" label-suffix=":" style="padding-right: 20px">
      <el-form-item :label="`当前${valueName}`"
        ><div style="text-align: left">{{ value }}</div></el-form-item
      >
      <el-form-item label="归属应用" prop="appId"
        ><app-select
          ref="appSelect"
          group-selectable
          v-model="form.appId"
          style="width: 100%"
          check-strictly
          placeholder="请选择归属应用"
        ></app-select
      ></el-form-item>
      <el-form-item label="数量" prop="value"
        ><el-input
          v-model.number="form.value"
          style="width: 100%"
          placeholder="填写正数为增加，填写负数为扣减"
        ></el-input
      ></el-form-item>
      <el-form-item label="原因" prop="reason"
        ><el-input
          v-model="form.reason"
          type="textarea"
          style="width: 100%"
          placeholder="备注原因"
          maxlength="100"
          show-word-limit
        ></el-input
      ></el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm" :loading="loading">保 存</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import AppSelect from '@/business-common/components/app-select';

  /**
   * 值增减模态框
   */
  export default {
    name: 'ValueChangeDialog',
    components: {
      AppSelect,
    },
    props: {},
    data() {
      return {
        visible: false,
        loading: false,
        valueName: '',
        value: '',
        rules: {
          appId: [{ required: true, message: '请选择归属应用' }],
          value: [
            { required: true, message: '请输入数量' },
            { type: 'integer', message: '必须为整数' },
            {
              validator: (rule, value, callback) => {
                if (value == null || typeof value !== 'number' || value === 0) {
                  callback(new Error('请输入数量'));
                } else if (value < 0 && -value > this.value) {
                  callback(new Error('扣减数量不能大于当前值'));
                } else {
                  callback();
                }
              },
            },
          ],
          // reason: [{ required: true, message: '请输入原因' }],
        },
        form: {
          appId: null,
          value: '',
          reason: '',
        },
      };
    },
    computed: {
      title() {
        return `增减${this.valueName}`;
      },
    },
    watch: {
      visible(value) {
        if (value && this.$refs.form) {
          this.$refs.form.resetFields();
        }
      },
    },
    methods: {
      /**
       * @param {{valueName: string, value: any, onConfirm: (form: any) => Promise<any> }} params
       */
      show(params) {
        this.valueName = params.valueName;
        this.value = params.value;
        this.onConfirm = params.onConfirm;
        this.form = {
          appId: null,
          value: '',
          reason: '',
        };
        this.visible = true;
      },
      async handleConfirm() {
        if (!(await this.$refs.form.validate())) {
          return;
        }

        const { reason, ...other } = this.form;
        const [{ appName }] = this.$refs.appSelect.getSelected();

        Object.assign(other, { desc: reason, appName });

        try {
          this.loading = true;
          await this.onConfirm(other);
          this.$message.success('操作成功');
          this.visible = false;
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .w250 {
    width: 250px;
  }
</style>
