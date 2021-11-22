<template>
  <div class="search-input-wrap">
    <el-input
      class="search-input"
      :placeholder="placeholder"
      size="mini"
      v-model="keyword"
      clearable
      @keydown.native.enter="handleSearch"
      @clear="handleSearch"
      style="width: 188px"
    ></el-input>
    <el-button class="search-button" size="mini" type="primary" @click="handleSearch" :loading="loading" v-if="showBtn">
      <slot name="text">
        <span>搜索</span>
      </slot>
    </el-button>
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
      showBtn: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {};
    },

    methods: {
      handleSearch() {
        // 设置 timeout 解决中文输入法回车后值更新慢过事件触发问题
        setTimeout(() => {
          this.$emit('search', this.keyword);
        }, 0);
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
</style>
