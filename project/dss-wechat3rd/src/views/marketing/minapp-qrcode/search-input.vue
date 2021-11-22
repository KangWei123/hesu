<template>
  <div class="search-input-wrap">
    <el-input
      class="search-input"
      :placeholder="placeholder"
      v-model="keyword"
      clearable
    >
      <el-button slot="append" icon="el-icon-search" class="search-button" size="medium" type="primary" @click="handleSearch" :loading="loading">
        <span>搜索</span>
      </el-button>
    </el-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入标题'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  methods: {
    handleSearch() {
      this.$emit('search', this.keyword);
    }
  },

  computed: {
    keyword: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search-input-wrap {
  font-size: 0;
  display: flex;
  align-items: center;
  height: 36px;
  margin-right: 20px;
  
  .search-input input {
    border-radius: 4px 0 0 4px;
  }
  .search-button {
    border-radius: 0;
    padding: 0 15px;
    height: 34px;
    box-sizing: border-box;
    line-height: 34px;
    background: #fa7516;
    color: #fff;
  }
}

// .el-input--mini .el-input__inner {
//   height: 36px;
//   line-height: 36px;
//   width: 220px;
// }
</style>
