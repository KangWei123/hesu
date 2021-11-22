<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of filteredList" :key="item.id" :label="item.ruleName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import memberApi from '@/mod-member/src/api/memberAPI';

  /**
   * 积分规则选择器
   */
  export default {
    name: 'ScoreRuleSelect',
    props: {
      ...Select.props,
      /**
       * 积分动作的类型, 可以是 give、consume、null(混合)
       */
      source: {
        type: Number,
        default: undefined,
      },
      /**
       * 和 appid 联动
       */
      appId: {
        type: String,
        default: null,
      },
      /**
       * 和积分类型联动
       */
      eventType: {
        type: Number,
        default: null,
      },
    },
    data() {
      return { list: [] };
    },
    computed: {
      filteredList() {
        if (!this.eventType) {
          return this.list;
        }

        return this.list.filter(i => {
          return i.eventKey === this.eventType;
        });
      },
    },
    watch: {
      appId: {
        immediate: true,
        handler() {
          this.fetchList();
        },
      },
    },
    methods: {
      async fetchList() {
        const { data } = await memberApi.scoreCenter.list({
          pageNo: 1,
          // 获取所有
          pageSize: 10000,
          ruleType: this.source,
          appId: this.appId,
        });
        this.list = data;
      },
    },
  };
</script>

<style></style>
