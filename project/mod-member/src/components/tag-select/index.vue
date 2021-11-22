<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.tagId" :label="item.tagName" :value="item.tagId"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { overideProps } from '@/dss-common/utils/vue';
  /**
   * 标签选择器
   */
  export default {
    name: 'TagSelect',
    props: overideProps(Select, {
      extendsProps: {
        /**
         * 列表接口请求
         */
        fetchHandler: {
          // 用于拉取数据
          type: Function,
          required: true,
        },
      },
    }),
    data() {
      return { list: [] };
    },
    async mounted() {
      const { data } = await this.fetchHandler();
      this.list = data;
    },
  };
</script>

<style></style>
