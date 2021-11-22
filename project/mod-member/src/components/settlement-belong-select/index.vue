<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
  import memberApi from '@/mod-member/src/api/memberAPI';
  import { Select } from 'element-ui';

  /**
   * 简单的应用下拉选择器
   */
  export default {
    name: 'SettlementBelongSelect',
    props: {
      ...Select.props,
      autoSelectFirst: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        list: [],
      };
    },
    mounted() {
      this.fetchBelong();
    },
    methods: {
      getSelected() {
        const list = this.value == null ? [] : Array.isArray(this.value) ? this.value : [this.value];
        return list.map(i => {
          return this.list.find(j => j.id === i);
        });
      },
      async fetchBelong() {
        const { data } = await memberApi.scoreCenter.settlementBelong();
        this.list = data.map(i => ({ ...i, id: `${i.id}-${i.type}` }));

        if (this.autoSelectFirst) {
          this.$emit('change', this.list[0]);
        }
      },
    },
  };
</script>

<style></style>
