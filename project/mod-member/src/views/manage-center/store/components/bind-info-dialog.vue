<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="30%">
    <el-form :model="form" :rules="rules" ref="Form" label-width="150px">
      <el-form-item prop="employee" label="选择导购">
        <el-select
          :loading="loading.list"
          v-model="form.employee"
          value-key="id"
          placeholder="请选择"
          style="width: 70%"
        >
          <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item"> </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmit" :loading="loading.submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/manage-store';

  export default {
    props: {
      visible: {},
      clientIds: {
        type: String,
        default: null,
      },
      storeId: {
        type: Number,
        default: null,
      },
      title: {
        type: String,
        default: '分配导购',
      },
      isRefresh: {
        type: Function,
      },
      eventId: {
        type: String,
        default: 'crm_corp_assign_clue',
      },
    },

    data() {
      return {
        options: [],
        loading: {
          submit: false,
          list: false,
        },
        form: {
          employee: null,
        },
        rules: {
          employee: [{ required: true, message: '请选择', trigger: 'change' }],
        },
      };
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

    watch: {
      storeId(val) {
        this.$refs.Form && this.$refs.Form.resetFields();
        this.getOptions();
      },
    },

    methods: {
      onSubmit() {
        this.$refs.Form.validate(valid => {
          if (!valid) return;
          this.doSubmit();
        });
      },

      doSubmit() {
        this.loading.submit = true;
        const params = {
          storeId: this.storeId,
          clientIds: this.clientIds,
          eventId: this.eventId,
          employeeId: this.form.employee.id,
        };
        api
          .bindInfo(params)
          .then(({ data }) => {
            this.$message({ message: `${this.title}成功`, type: 'success' });
            this.dialogVisible = false;
            this.isRefresh && this.isRefresh();
            this.$emit('successBind', this.form.employee);
          })
          .finally(_ => {
            this.loading.submit = false;
          });
      },

      getOptions() {
        this.loading.list = true;
        const params = {
          queryAll: true,
          storeId: this.storeId,
          positionIds: 'common_role_storeKeeper,common_role_sales',
        };
        api
          .queryGuideList(params)
          .then(({ data }) => {
            this.options = data || [];
          })
          .finally(() => {
            this.loading.list = false;
          });
      },
    },
  };
</script>
