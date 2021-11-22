<template>
  <el-select
    v-bind="$props"
    v-on="$listeners"
    :disabled="disabled || appId == null"
    :placeholder="appId == null ? '请选择应用' : placeholder"
  >
    <el-option v-for="item of list" :key="item.id" :label="item.activityName" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 积分倍率选择器
   */
  export default {
    name: 'ScoreMultiplerSelect',
    props: {
      ...Select.props,
      /**
       * 积分倍率是业态的，所以需要 appId 进行筛选
       */
      appId: {
        type: [Number, String],
        default: null,
      },
    },
    data() {
      return {
        list: [],
      };
    },
    watch: {
      appId: {
        immediate: true,
        handler() {
          this.getList();
        },
      },
    },
    // mounted() {
    //   this.getList();
    // },
    methods: {
      async getList() {
        if (this.appId == null) {
          return;
        }

        const { data } = await api.scoreCenter.scoreMultipleList({ pageNo: 1, pageSize: 1000, appId: this.appId });

        this.list = data || [];
      },
    },
  };
</script>

<style></style>
