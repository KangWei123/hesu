<template>
  <parameter-list-table ref="list"
                          :goodsType="goodsTypeEnum.product"></parameter-list-table>

</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import ParameterListTable from '@/dss-wechat3rd/src/components/goods/ParameterListTable.vue';

export default {
  name: 'parameter-list',
  components: { ParameterListTable },
  data() {
    return {
      goodsTypeEnum
    };
  },

  // 钩子函数执行子组件列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$refs.list.fetchData();
    });
  },

  methods: {}
};
</script>
