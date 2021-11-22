<template>
  <el-dialog
    :visible.sync="visible"
    title="商家标签"
    width="480px"
    append-to-body
    destory-on-close
    :close-on-click-modal="false"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="60px" label-suffix=":" style="padding: 0 36px">
      <el-form-item prop="tagId" label="标签">
        <tag-select
          v-model="form.tagId"
          style="width: 100%"
          placeholder="请选择标签"
          :fetch-handler="fetchHandler"
          multiple
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 认</el-button>
    </template>
  </el-dialog>
</template>

<script>
  import TagSelect from '@/mod-member/src/components/tag-select/index.vue';

  /**
   * 批量操作
   */
  export default {
    name: 'AddTagDialog',
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
        rules: {
          tagId: [{ required: true, message: '请选择' }],
        },
        form: {
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
      show({ onConfirm }) {
        this.onConfirm = onConfirm;
        this.visible = true;
      },
      async handleConfirm() {
        if (!(await this.$refs.form.validate()) || !this.form.tagId) {
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
