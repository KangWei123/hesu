<template>
  <div class="search-input-wrap">
    <el-input
      class="search-input"
      prefix-icon="el-icon-search"
      :placeholder="placeholder"
      v-model="keyword"
      clearable
      @change="handleSearch"
      @keydown.native.enter="handleSearch"
      @clear="handleSearch"
    ></el-input>
    <!-- <el-button class="search-button" size="mini" type="primary" @click="handleSearch" :loading="loading">
      <slot name="text">
        <span>搜索</span>
      </slot>
    </el-button> -->
  </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: String,
        default: '',
      },
      placeholder: {
        type: String,
        default: '请输入标题',
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {};
    },

    methods: {
      handleSearch() {
        this.$emit('search', this.keyword);
      },
    },

    computed: {
      keyword: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        },
      },
    },
  };
</script>

<style lang="less" scoped>
  .search-input-wrap {
    font-size: 0;
    display: flex;
    align-items: center;
    height: 36px;
    .search-input input {
      border-radius: 4px 0 0 4px;
    }
    .search-button {
      border-radius: 0;
      padding: 0 15px;
      height: 30px;
      box-sizing: border-box;
      line-height: 30px;
    }
  }

  // .el-input--mini .el-input__inner {
  //   height: 36px;
  //   line-height: 36px;
  //   width: 220px;
  // }
</style>
