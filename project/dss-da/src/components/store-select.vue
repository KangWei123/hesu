<template>
  <div class="m-store-select">
    <span class="label">选择门店: </span>
    <div class="select">
      <el-select v-model="selectedStoreName"
                 size="mini"
                 filterable
                 placeholder="选择门店">
        <el-option v-for="item in allStoreList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.name">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SelectStore',

  data() {
    return {
      epStores: null
    };
  },

  computed: {
    ...mapState({
      selectedStore: 'selectedStore',
      storeList: 'storeList',
      userInfo: 'userInfo',
      curStore: 'curStore'
    }),

    allStoreList() {
      console.log('storeList', this.storeList);
      if (this.storeList) {
        return [
          {
            name: '全部',
            value: '全部',
            label: '全部',
            id: -1
          },
          ...this.storeList.filter(store => {
            return store.id;
          })
        ];
      }
    },

    selectedStoreName: {
      get() {
        return this.selectedStore && this.selectedStore.name;
      },

      set(val) {
        let store = this.allStoreList.find(item => item.name === val);
        const preStore = this.selectedStore;
        store.store_name = store.name;
        if (preStore && preStore.id === store.id) {
          return;
        }
        this.$store.commit('setSelectedStore', store);
      }
    }
  },

  watch: {
    selectedStore: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.$emit('storeChange', newVal.id);
        }
      }
    }
  },

  mounted() {
    // 如果未选中店铺，则默认选择全部
    if (!this.selectedStore) {
      this.$store.commit('setSelectedStore', {
        name: '全部',
        value: '全部',
        label: '全部',
        id: -1
      });
    }
  },

  methods: {}
};
</script>

<style lang="less">
.m-store-select {
  margin: 20px 16px;
  align-items: center;

  .label {
    font-size: 14px;
  }

  .select {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
