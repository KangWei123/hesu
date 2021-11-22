<template>
  <div class="marketing">
    <performance-filter @filter="onFilter"
                        class="wkt-opt-label-container"
                        filter-type='marketing'
                        :params="params" />
    <performance-list ref="list"
                      list-type='marketing'
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
      // 列表查询条件
      filterParams: {
        commissionMode: 1 // 佣金类型，默认查询推广业绩
      },

      // 传给子组件的默认查询条件
      params: {
        commissionMode: 1 // 佣金类型，默认查询推广业绩
      }
    };
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getPerformanceList(); // 查询业绩列表
    });
  },

  mounted() {
    // 传给子组件的默认查询条件赋值
    this.params = {
      commissionMode: 1 // 佣金类型，默认查询推广业绩
    };
  },
  methods: {
    // 按条件查询
    onFilter(filterParams) {
      this.filterParams = filterParams; // 列表查询条件
    }
  }
};
</script>
