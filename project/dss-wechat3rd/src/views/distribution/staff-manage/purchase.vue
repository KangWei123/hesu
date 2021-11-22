<template>
  <div class="purchase">
    <staff-filter @filter="onFilter"
                  class="wkt-opt-label-container" />
    <staff-list ref="list"
                list-type="purchase"
                :filter-params="filterParams" />
  </div>
</template>
<script>
import staffFilter from './staff-filter.vue';
import staffList from './staff-list.vue';

export default {
  components: {
    staffFilter,
    staffList
  },

  data() {
    return {
      filterParams: {} // 列表查询条件
    };
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getDisPersonList(); // 查询分销人员列表
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
