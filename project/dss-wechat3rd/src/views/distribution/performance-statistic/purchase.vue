<template>
  <div class="purchase">
    <performance-filter @filter="onFilter"
                        class="wkt-opt-label-container"
                        filter-type='purchase' />
    <performance-list ref="list"
                      list-type='purchase'
                      :filter-params="filterParams" />
  </div>
</template>
<script>
import performanceFilter from './performance-filter.vue';
import performanceList from './performance-list.vue';

export default {
  components: {
    performanceFilter,
    performanceList
  },

  data() {
    return {
      filterParams: {} // 列表查询条件
    };
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getPerformanceList(); // 查询业绩列表
    });
  },

  methods: {
    // 按条件查询
    onFilter(filterParams) {
      this.filterParams = filterParams; // 列表查询条件
    }
  }
};
</script>
