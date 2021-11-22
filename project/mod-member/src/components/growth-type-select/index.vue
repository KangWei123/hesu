<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.code" :label="item.desc" :value="item.code"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 成长值类型选择器
   */
  export default {
    name: 'GrowthTypeSelect',
    props: Select.props,
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.fetchList();
    },
    methods: {
      async fetchList() {
        const { data } = await api.growthManager.getGrowthTypes();
        this.list = data;
      },
    },
  };
</script>

<style></style>
