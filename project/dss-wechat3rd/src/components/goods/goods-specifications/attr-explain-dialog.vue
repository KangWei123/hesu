<template>
  <el-dialog
    title="添加说明"
    :visible.sync="visible"
    width="300"
    @closed="close">
    <el-input
      type="textarea"
      :rows="2"
      placeholder="请输入说明内容"
      v-model="textarea">
    </el-input>

     <div slot="footer" style="text-align: center;">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
     </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-explain-dialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    attItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      textarea: ''
    };
  },
  computed: {
    visible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      }
    }
  },
  watch: {
    attItem: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          this.textarea = this.attItem.skuExplain;
        });
      }
    }
  },
  methods: {
    cancel() {
      this.visible = false;
    },
    save() {
      this.$emit('save', this.textarea);
      this.visible = false;
    },
    close() {
      this.textarea = '';
    }
  }
};
</script>