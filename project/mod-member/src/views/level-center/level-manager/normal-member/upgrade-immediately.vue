<template>
  <el-dialog title="会员直升" :visible.sync="mShowDialog">
    <el-form label-width="auto" style="text-align: left" label-suffix="：">
      <el-form-item label="当前等级">
        <el-input :value="data.levelName" disabled style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="直升规则">
        单日累计
        <el-input type="number" class="input" min="0" v-model="singleDay"></el-input>
        成长值
      </el-form-item>
      <el-form-item>
        连续30天累计
        <el-input type="number" class="input" min="0" v-model="month"></el-input>
        成长值
      </el-form-item>
    </el-form>

    <template #footer>
      <div style="text-align: center">
        <el-button @click="mShowDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
  import DialogMixin from '@/dss-common/mixins/dialog-mixin';
  import memberApi from '@/mod-member/src/api/memberAPI';

  export default {
    mixins: [DialogMixin],
    props: {
      level: { type: Number, default: -1 },
    },
    data() {
      return {
        singleDay: '',
        month: '',
        data: {},
      };
    },
    watch: {
      mShowDialog(value) {
        value && this.getData();
      },
    },
    methods: {
      async getData() {
        const { data } = await memberApi.levelManager.levelDetail({ id: this.level });
        const { directUpgradeRule } = (this.data = data);
        this.singleDay = directUpgradeRule.singleDay || '';
        this.month = directUpgradeRule.month || '';
      },
      async onSubmit() {
        const directUpgradeRule = {
          singleDay: this.singleDay || null,
          month: this.month || null,
        };
        await memberApi.levelManager.updateLevel({ ...this.data, directUpgradeRule });

        this.mShowDialog = false;
        this.$message.success('保存成功');

        this.$emit('refresh');
      },
    },
  };
</script>

<style lang="less" scoped>
  .input {
    width: 80px;
    margin: 0 10px;
  }
</style>
