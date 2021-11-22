<template>
  <question-answer-table ref="list"
                          :goodsType="goodsTypeEnum.product"></question-answer-table>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import QuestionAnswerTable from '@/dss-wechat3rd/src/components/goods/QuestionAnsListTable.vue';

export default {
  name: 'question-answer-list',
  components: { QuestionAnswerTable },
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
