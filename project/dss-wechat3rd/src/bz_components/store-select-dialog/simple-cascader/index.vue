<template>
  <div class="dealer-store">
    <el-cascader
      v-if="showDept"
      :options="storeList"
      :props="cascaderProps"
      v-model="selectIds"
      placeholder="全部门店"
      filterable
      clearable
      expand-trigger="click"
      :show-all-levels="false"
      collapse-tags
    />

    <el-select
      class="single-store-select"
      v-else-if="showStore"
      v-model="selectIds"
      multiple
      collapse-tags
      clearable
      filterable
      placeholder="全部门店"
    >
      <el-option v-for="item in computedStoreList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
    </el-select>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import wechat3rdApi from '@/dss-wechat3rd/src/api/index';

  export default {
    name: 'SimpleStoreCascader',
    props: {
      selectStores: {
        type: Array,
        default: () => [],
      },
      showDept: {
        type: Boolean,
        default: false,
      },
      showStore: {
        type: Boolean,
        default: false,
      },
      showTotalConsole: {
        type: Boolean,
        default: true,
      },
      fetch: {
        type: Function,
        default: wechat3rdApi.getDealerList,
      },
      formatData: {
        type: Function,
        default: i => i,
      },
    },

    data() {
      return {
        storeList: [],
        selectIds: [],
        computedStoreList: [],
        cascaderProps: {
          multiple: true,
          leaf: 'children',
        },
      };
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        authStoreList: 'storeList',
      }),
    },

    mounted() {
      if (this.showDept) this.getOrganizationTree();
      this.computedStoreList = !this.showTotalConsole
        ? (this.authStoreList ?? []).filter(i => i.id)
        : this.authStoreList;
    },

    watch: {
      selectIds: function (newVal, oldVal) {
        let storeIds = [];
        if (this.showDept) storeIds = newVal.reduce((arr, item) => arr.push(item[1] || item[0]) && arr, []);
        if (this.showStore) storeIds = this.selectIds;

        this.$emit('update:selectStores', storeIds);
        this.$emit('change', storeIds);
      },
    },

    methods: {
      reset() {
        this.selectIds = [];
      },
      async getOrganizationTree() {
        try {
          const { data = [] } = await this.fetch();
          this.formatArray(data);
          this.storeList = data;
        } catch (e) {
          console.log('查询经销商失败');
        }
      },

      formatArray(list = []) {
        list.forEach((item, index) => {
          item.value = item.id || item.storeId;
          item.label = item.dealerName || item.name || item.storeName;
          item.children = this.$plain(item.storeDTOList || []);
          delete item.storeDTOList;
          if (item && item.children && item.children.length) {
            this.formatArray(item.children);
          } else {
            item.children = null;
          }
        });
      },

      handleClear() {
        this.selectIds = [];
      },
    },
  };
</script>

<style lang="less" scoped>
  .dealer-store {
    display: inline-block;

    /deep/ .el-cascader {
      width: 100%;
    }

    /deep/ .el-cascader .el-input__inner {
      padding-left: 15px;
    }

    /deep/ .el-cascader .el-input {
      height: unset;
    }
  }

  /deep/ .single-store-select.el-select {
    width: 100%;

    .el-select__tags > span {
      display: inline-block;
      max-width: 100%;
    }

    .el-tag.el-tag--info.el-tag--small {
      display: inline-block;
      max-width: 100%;
      position: relative;
      padding: 0 12px 0 8px;

      .el-select__tags-text {
        display: inline-block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-tag__close.el-icon-close {
        position: absolute;
        top: 6px;
        right: -2px;
      }
    }
  }
</style>
