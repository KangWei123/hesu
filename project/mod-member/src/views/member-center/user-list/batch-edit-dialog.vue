<template>
  <el-dialog
    class="dss-dialog"
    :visible.sync="visible"
    title="商家标签"
    width="480px"
    append-to-body
    destory-on-close
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      label-width="100px"
      label-suffix=":"
      style="padding: 0 26px 0 10px"
    >
      <div class="tip">已勾选 {{ selected.length }} 个会员</div>
      <el-form-item prop="type" label="执行操作">
        <el-select v-model="form.type" style="width: 100%">
          <el-option v-for="option of types" :key="option.value" :value="option.value" :label="option.name"></el-option>
        </el-select>
      </el-form-item>

      <template v-if="form.type === EDIT_TYPE.TAG">
        <el-form-item prop="tagId" label="选择标签">
          <tag-select
            v-model="form.tagId"
            style="width: 100%"
            :fetch-handler="fetchHandler"
            multiple
            placeholder="请选择标签"
          />
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">批量操作</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import TagSelect from '@/mod-member/src/components/tag-select';

  export const EDIT_TYPE = {
    TAG: 1,
  };

  const EDIT_TYPES = [
    {
      name: '添加商家印象标签',
      value: EDIT_TYPE.TAG,
    },
  ];

  /**
   * 批量操作
   */
  export default {
    name: 'BatchEditDialog',
    components: {
      TagSelect,
    },
    props: {
      fetchHandler: {
        // 用于拉取数据
        type: Function,
        required: true,
      },
    },
    data() {
      return {
        visible: false,
        types: EDIT_TYPES,
        EDIT_TYPE,
        rules: {
          type: [{ required: true, message: '请选择' }],
          tagId: [{ required: true, message: '请选择标签' }],
        },
        selected: [],
        form: {
          type: EDIT_TYPE.TAG,
          tagId: [],
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
      show({ type, selected, onConfirm }) {
        this.form.type = type;
        this.selected = selected;
        this.onConfirm = onConfirm;
        this.visible = true;
      },

      async handleConfirm() {
        if (!(await this.$refs.form.validate())) {
          return;
        }

        if ((await this.onConfirm(this.form)) !== false) {
          this.$message.success('添加成功');
          this.visible = false;
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  .tip {
    margin-left: 100px;
    margin-bottom: 6px;
    font-size: 12px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #717378;
    line-height: 22px;
  }
</style>
