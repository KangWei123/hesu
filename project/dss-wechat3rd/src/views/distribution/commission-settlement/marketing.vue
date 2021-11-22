<template>
  <div class="marketing">
    <commission-filter @filter="onFilter"
                       class="wkt-opt-label-container" />
    <commission-list ref="list"
                     list-type="marketing"
                     :filter-params="filterParams" />
  </div>
</template>
<script>
import commissionFilter from './commission-filter.vue';
import commissionList from './commission-list.vue';

export default {
  components: {
    commissionFilter,
    commissionList
  },

  data() {
    return {
      filterParams: {} // 列表查询条件
    };
  },
  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.getCashOutList(); // 查询提现记录列表
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
