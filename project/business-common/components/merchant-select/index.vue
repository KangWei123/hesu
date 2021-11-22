<template>
  <el-select v-bind="$props" v-on="$listeners" @change="onchange">
    <el-option v-for="item of list" :key="item.subStoreId" :label="item.name" :value="item.subStoreId"></el-option>
  </el-select>
</template>

<script>
  import { Select } from 'element-ui';
  import { businessApi } from '@/business-common/api';

  export default {
    name: 'MerchantSelect',
    props: {
      ...Select.props,
      storeId: { type: [String, Number], default: '' },
    },
    data() {
      return {
        list: [],
      };
    },
    watch: {
      storeId(val, oldVal) {
        this.fetchMerchants();
      },
    },
    mounted() {
      this.fetchMerchants();
    },
    methods: {
      async fetchMerchants() {
        const params = { storeId: this.storeId };
        const { data } = await businessApi.business.query(params);

        this.list = data;
        this.$emit('list', this.list);

        const { value } = this.$props;
        const rs = value && this.list.some(x => x.subStoreId === Number(value));

        if (!rs) {
          this.$emit('input', '');
        }
      },

      onchange(val) {
        const rs = this.list.find(item => item.subStoreId === val);
        const name = rs && rs.name;
        this.$emit('onselect', name);
      },
    },
  };
</script>
