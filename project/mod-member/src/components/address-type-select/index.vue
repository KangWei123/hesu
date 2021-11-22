<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of Address" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { AddressType, AddressTypeName } from '@/mod-member/src/enum/index';

  const Address = [];
  Object.keys(AddressType).forEach(i => {
    // 去除选择收货地址 -> 小程序自带不可手动新增
    if (i !== 'Receive') {
      Address.push({ label: AddressTypeName[AddressType[i]], value: AddressType[i] });
    }
  });

  /**
   * 地址类型选择器
   */
  export default {
    name: 'GrowthTypeSelect',
    props: Select.props,
    data() {
      return {
        Address,
      };
    },
  };
</script>

<style></style>
