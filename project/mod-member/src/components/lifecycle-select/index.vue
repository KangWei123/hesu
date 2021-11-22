<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 生命周期选择器
   */
  export default {
    name: 'LifeCycleSelect',
    props: {
      ...Select.props,
      // 类型，通过 LifeCycleDetectType 定义
      type: {
        type: Number,
        default: undefined,
      },
      status: {
        // 1-开启，0-关闭
        type: Number,
        default: 1,
      },
    },
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
        const { data } = await api.lifeCycle.list({
          pageNo: 1,
          pageSize: 1000,
          type: this.type,
          status: this.status,
        });
        this.list = data;
      },
    },
  };
</script>

<style></style>
