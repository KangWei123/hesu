<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.code" :label="item.desc" :value="item.code"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 渠道选择器
   */
  export default {
    name: 'ChannelSelect',
    props: Select.props,
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
      async getList() {
        const { data } = await api.channel.getList({ pageNo: 1, pageSize: 1000 });
        this.list = data;
      },
    },
  };
</script>

<style></style>
