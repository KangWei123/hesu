<template>
  <el-dialog :visible.sync="visible" title="生命周期" width="435px" append-to-body center destory-on-close>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-suffix=":">
      <el-form-item prop="lifecycleId" label="会员生命周期">
        <lifecycle-select
          v-model="form.lifecycleId"
          :type="LifeCycleDetectType.Manual"
          class="w250"
          placeholder="请选择生命周期"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import LifecycleSelect from '@/mod-member/src/components/lifecycle-select';
  import { LifeCycleDetectType } from '@/mod-member/src/enum/index';

  /**
   * 批量操作
   */
  export default {
    name: 'AddLifeCycleDialog',
    components: {
      LifecycleSelect,
    },
    data() {
      return {
        visible: false,
        LifeCycleDetectType,
        rules: {
          lifecycleId: { required: true, message: '请选择会员生命周期' },
        },
        form: {
          lifecycleId: null,
          type: LifeCycleDetectType.Manual,
        },
      };
    },
    watch: {
      visible(v) {
        if (!v && this.$refs.form) {
          this.$refs.form.resetFields();
        }
      },
    },
    methods: {
      show({ onConfirm }) {
        this.onConfirm = onConfirm;
        this.visible = true;
      },
      async handleConfirm() {
        if (!(await this.$refs.form.validate())) {
          return;
        }

        await this.onConfirm(this.form);
        this.visible = false;
      },
    },
  };
</script>

<style scoped>
  .w250 {
    width: 250px;
  }
</style>
