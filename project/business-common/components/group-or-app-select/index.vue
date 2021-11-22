<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option label="TODO1" value="1"></el-option>
    <el-option label="TODO2" value="2"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  /**
   * 集团或应用选择器
   * 如果当前管理员属于集团，可以选择集团，具体业态管理员只能选择业态
   * TODO: 接口对接
   */
  export default {
    name: 'GroupOrAppSelect',
    props: Select.props,
  };
</script>

<style></style>
