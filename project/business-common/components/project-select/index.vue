<template>
  <el-select v-bind="$props" v-on="$listeners">
    <el-option v-for="item of list" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { mapState } from 'vuex';

  export default {
    name: 'MerchantSelect',
    props: {
      ...Select.props,
    },
    computed: {
      ...mapState({
        storeList: 'storeList',
        curStore: 'curStore',
        sidebar: 'sidebar',
      }),
      list() {
        const len = this.storeList.length;
        return (len > 1 ? this.storeList.slice(1) : this.storeList).map(item => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    },
    data() {
      return {};
    },
    mounted() {
      this.$emit('input', this.list[0].id);
      this.$emit('change', this.list[0].id);
    },
    methods: {},
  };
</script>
