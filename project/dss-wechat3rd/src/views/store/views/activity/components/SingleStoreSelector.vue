<template>
  <div class="single-store-selector">
    <el-select
      v-model="selectedStore"
      clearable
      filterable
      :placeholder="computePlaceholder">
      <el-option
        v-for="item in allStores"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'SingleStoreSelector',

    props: {
      //是否包含全部？
      withAll: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        selectedStore: null,
        allStores: []
      };
    },

    computed: {
      ...mapState({
        stores: state => {
          return state.userInfo.storeList;
        }
      }),

      computePlaceholder() {
        return this.withAll ? '总店' : '请选择店铺';
      }
    },

    watch: {
      selectedStore(newVal, oldVal) {
        this.$emit('select-store', newVal);
      }
    },

    created() {
      if (this.withAll) {
        this.allStores.push(...this.stores);

      }
    }
  };
</script>

<style lang="less">
  .single-store-selector {
    display: inline-block;
  }
</style>
