<template>
  <div class="dynamic-label">
    <el-tag
      :key="index"
      v-for="(tag, index) in value"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >{{tag}}</el-tag>
    <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      :maxlength="14"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    ></el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">新增标签</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: ''
    };
  },
  props: {
    value: {
      type: Array,
      default: _ => []
    }
  },
  methods: {
    handleClose(tag) {
      let value = this.value.slice();
      value.splice(value.indexOf(tag), 1);
      this.input(value);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        let value = this.value.slice();
        value.push(inputValue);
        this.input(value);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    input(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style lang='less'>
.dynamic-label {
  margin-left: -10px;
  overflow: hidden;
  .el-tag {
    margin: 0 0 10px 10px;
  }
  .button-new-tag {
    margin: 0 0 10px 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin: 0 0 10px 10px;
  }
}
</style>
