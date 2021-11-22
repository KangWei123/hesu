<template>
  <div class="goods-combined-delete-list"
       v-loading="loading">
    <!-- 查询条件过滤器 -->
    <query-filter class="wkt-opt-label-container"
                  :show-marketing-filter="false"
                  :goods-type="goodsTypeEnum.product"
                  @filter="onFilter" />

    <!-- 商品列表 -->
    <list-table ref="list"
                :goods-type="goodsTypeEnum.combinationItem"
                :filter-params="filterParams"
                abandon-goods
                @onLoading="onLoading"
                @unLoading="unLoading" />
  </div>
</template>
<script>
import queryFilter from './query-filter.vue';
import listTable from './list-table.vue';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';

export default {
  components: {
    queryFilter,
    listTable
  },
  data() {
    return {
      loading: false,

      goodsTypeEnum, // 商品类型

      filterParams: null // 列表查询条件
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.listGoodsByType(); // 根据商品类型获取商品列表
    });
  },

  mounted() {},
  methods: {
    // 按条件查询
    onFilter(filterParams) {
      this.filterParams = filterParams; // 列表查询条件
    },

    /**
     * 显示loading
     */
    onLoading() {
      this.loading = true;
    },

    /**
     * 隐藏loading
     */
    unLoading() {
      this.loading = false;
    }
  }
};
</script>
