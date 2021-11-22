<template>
  <el-dialog :visible.sync="visible" title="会员信息" width="435px" append-to-body center destory-on-close>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-suffix=":">
      <el-form-item prop="cardNumber" label="会员卡号">
        <el-input v-model="form.cardNumber" class="w250" placeholder="请输入会员卡号" />
      </el-form-item>

      <el-form-item prop="freeze" label="会员状态">
        <el-switch v-model="form.freeze"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  /**
   * 批量操作
   */
  export default {
    name: 'UserEditDialog',
    components: {},
    data() {
      return {
        visible: false,
        rules: {},
        form: {
          cardNumber: '',
          freeze: false,
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

        if ((await this.onConfirm(this.form)) !== false) {
          this.visible = false;
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
