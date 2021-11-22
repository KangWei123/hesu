<template>
  <div v-infinite-scroll="handleFetch" infinite-scroll-disabled="!hasMore">
    <slot v-if="!list.length && !hasMore" name="empty">
      <div class="inf-empty">暂无记录</div>
    </slot>
    <slot :list="list" :loading="loading" :error="error" :has-more="hasMore"> </slot>
    <slot v-if="error" name="error">
      <el-alert show-icon type="error">{{ error.message }}</el-alert>
    </slot>
  </div>
</template>

<script>
  /**
   * 无限滚动容器
   */
  export default {
    name: 'InfiniteScrollList',
    props: {
      pageSize: {
        type: Number,
        default: 30,
      },
      fetchHandler: {
        type: Function,
        required: true,
      },
    },
    data() {
      return {
        hasMore: true,
        pageNo: 0,
        list: [],
        loading: false,
        error: null,
      };
    },
    mounted() {
      this.handleFetch();
    },
    methods: {
      async handleFetch() {
        if (this.loading) {
          return;
        }

        try {
          this.loading = true;
          this.error = null;

          const list = await this.fetchHandler({
            pageNo: this.pageNo + 1,
            pageSize: this.pageSize,
          });

          if (list < this.pageSize) {
            this.hasMore = false;
          }

          this.pageNo += 1;
          this.list = this.list.concat(list || []);
        } catch (err) {
          this.error = err;
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .inf-empty {
    padding: 20px;
  }
</style>
