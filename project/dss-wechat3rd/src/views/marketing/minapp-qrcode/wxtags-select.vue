<template>
  <el-select
    class="wxtags-select"
    v-model="model"
    :multiple="multiple"
    :disabled="disabled"
    placeholder="请选择标签"
    :loading="loading.tags"
    :multiple-limit="16"
  >
    <el-option
      v-for="item in tags"
      :key="item.wxOriginTagId"
      :label="item.tagName"
      :value="item.wxOriginTagId"
    ></el-option>
    <li class="load-more" @click="loadMore" v-if="tags.length<totalCount">
      <a>加载更多</a>
    </li>
  </el-select>
</template>

<script>
import wechatoaTagsApi from '@/dss-wechat3rd/src/api/wechatoa-tags';

export default {
  props: {
    value: {
      type: [Number, String, Array]
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultTags: {
      type: [Array, null],
      default: null
    },
    concatTags: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      page: {
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      tags: [],
      loading: {
        tags: false
      }
    };
  },
  methods: {
    async fetchTags() {
      // 如果给定 tags 不再重新请求（删除已有标签的情况）
      if (Object.prototype.toString.call(this.defaultTags).toLowerCase() === '[object array]') {
        this.tags = this.defaultTags;
        this.totalCount = this.tags.length;
        return;
      }
      this.loading.tags = true;
      try {
        const { data, totalCount, pageSize, pageNo } = await wechatoaTagsApi.queryTagList(this.page);
        // 去重
        this.tags = [...this.concatTags, ...this.tags, ...data].reduce((pre, item) => {
          if (pre.findIndex(i => i.wxOriginTagId === item.wxOriginTagId) === -1) {
            return [...pre, item];
          }
          return pre;
        }, []);
        this.totalCount = totalCount;
      } finally {
        this.loading.tags = false;
      }
    },
    async loadMore() {
      if (this.tags.length < this.totalCount) {
        this.page.pageNo += 1;
        await this.fetchTags();
      }
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  },
  mounted() {
    this.fetchTags();
  }
};
</script>

<style lang="less" scoped>
.load-more {
  text-align: center;
  padding: 4px 0;
}
</style>
<style lang="less">
.wxtags-select {
  &.el-select {
    overflow: hidden;
  }
  .el-select__tags {
    max-height: 90px;
    overflow: hidden;
    overflow-y: auto;
  }
  // 滚动条
  .el-select__tags::-webkit-scrollbar {
    width: 0 !important;
  }
  .el-select__tags::-webkit-scrollbar {
    width: 0 !important;
  }
  .el-input__inner {
    max-height: 87px;
    width: 200px;
  }
  .el-tag {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    padding-right: 24px;
    &:first-child {
      margin-top: 5px;
    }
    .el-tag__close.el-icon-close {
      position: absolute;
      right: 4px;
      top: 5px;
    }
  }
}
</style>