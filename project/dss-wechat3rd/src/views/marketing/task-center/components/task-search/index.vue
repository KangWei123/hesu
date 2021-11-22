<template>
  <div class="device-search-box">
    <el-input
      :placeholder="placeholder"
      :style="`width:${inputWidth}px`"
      clearable
      @clear="onClear"
      v-model.trim="keyword"
      @input="onSearch"
      @keydown.native.enter="onSearch"
    ></el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    onSearch: {
      type: Function,
      default: () => {}
    },
    placeholder: {
      type: String,
      default: '请输入任务名称'
    },
    inputWidth: {
      type: Number,
      default: 250
    }
  },
  data() {
    return {
      keyword: ''
    };
  },
  watch: {
    keyword(val) {
      if (this.value === val) return;
      this.$emit('input', val);
    },
    value(val) {
      if (val === this.keyword) return;
      this.keyword = val;
    }
  },
  methods: {
    onClear() {
      this.onSearch('');
    }
  }
};
</script>

<style lang="less">
.device-search-box {
  font-size: 0;
  display: flex;
  align-items: center;
  .el-input__inner {
    border-radius: 4px 0 0 4px;
  }
  .device-search-button {
    border-radius: 0;
    padding: 0 15px;
    height: 30px;
    box-sizing: border-box;
    line-height: 30px;
  }
}
</style>
