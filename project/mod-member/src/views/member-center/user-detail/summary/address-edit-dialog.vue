<template>
  <el-dialog :visible.sync="visible" title="地址信息" width="435px" append-to-body center destory-on-close>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" label-suffix=":">
      <el-form-item prop="type" label="地址类型">
        <address-type-select v-model="form.type" class="w250" placeholder="请选择地址" />
      </el-form-item>
      <el-form-item prop="area" label="区域">
        <region-select v-model="form.area" class="w250" placeholder="请选择省-市-区" />
      </el-form-item>
      <el-form-item prop="address" label="详细地址">
        <el-input v-model="form.address" maxlength="100" class="w250" placeholder="请输入详细地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import AddressTypeSelect from '@/mod-member/src/components/address-type-select';
  import RegionSelect from '@/business-common/components/region-select';
  import { AddressType } from '@/mod-member/src/enum';

  const INITIAL = {
    type: AddressType.Default,
    area: null,
    address: '',
  };

  /**
   * 批量操作
   */
  export default {
    name: 'AddressEditDialog',
    components: {
      AddressTypeSelect,
      RegionSelect,
    },
    data() {
      return {
        visible: false,
        rules: {
          area: { required: true, message: '请选择区域' },
        },
        form: { ...INITIAL },
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
      show({ onConfirm, form }) {
        this.onConfirm = onConfirm;
        this.visible = true;
        if (form) {
          Object.assign(this.form, form);
        } else {
          Object.assign(this.form, {
            ...INITIAL,
          });
        }
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
