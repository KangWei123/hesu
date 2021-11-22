<template>
  <el-select v-bind="$props" @input="$emit('input', $event)">
    <el-option
      v-for="item of options"
      :key="item.key"
      :label="item.label"
      :value="inLabel ? item.label : inString ? String(item.key) : item.key"
    ></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { commonEnum } from '@/business-common/constants';

  export default {
    name: 'SexSelect',
    props: { ...Select.props, inString: { type: Boolean, default: false }, inLabel: { type: Boolean, default: false } },
    data() {
      return {
        options: commonEnum.SEX_OPTIONS,
      };
    },
  };
</script>

<style></style>
