<template>
  <el-select
    v-model="selectedStores"
    collapse-tags
    filterable
    multiple
    size="medium"
    :placeholder="placeholder">
    <el-option
      v-for="item in stores"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'MultiStoreSelector',
    model: {
      prop: 'selectedStores'
    },

    props: {
      placeholder: {
        type: String,
        default: '请选择店铺'
      }
    },

    data() {
      return {
        selectedStores: []
      };
    },

    computed: {
      ...mapState({
        stores: state => state.userInfo.storeList
      })
    },

    watch: {
      selectedStores(newVal, oldVal) {
        this.$emit('input', newVal);
      }
    }
  };
</script>

<style lang="less">

</style>
