<template>
  <tree-select-dialog
    :title="title"
    v-model="showDialog"
    class="category-select-dialog"
    enable-multiple
    :api-url="apiUrl"
    :selected-list="selectedCategories"
    :query-params="queryParams"
    :limit="limit"
    :tree-props="treeProps"
    @choose="onCategoryChoosed"
  >
    <div slot="filter" class="category-filter">
      <span class="filter-title" style="margin-right: 10px">选择分类</span>
      <el-input
        class="filter-input"
        v-model="filterCategoryName"
        placeholder="搜索名称"
        @input="onFilter"
        style="width: 200px"
        size="mini"
      ></el-input>
    </div>
  </tree-select-dialog>
</template>

<script>
  import TreeSelectDialog from '@/business-common/components/tree-select-dialog';

  export default {
    name: 'CategorySelectDialog',
    components: {
      TreeSelectDialog,
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      value: {
        type: Boolean,
        default: false,
      },
      limit: {
        type: Number,
        default: 0,
      },
      selectedCategories: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    data() {
      return {
        showDialog: false,
        apiUrl: '/wp/item/category/queryCategoryList',
        filterCategoryName: null,
        queryParams: {
          type: 1,
        },
        treeProps: {
          nodeKey: 'id',
          label: 'category',
          children: 'childrenCategory',
        },
      };
    },
    watch: {
      value(newVal, oldVal) {
        this.showDialog = newVal;
      },
      showDialog(newVal, oldVal) {
        this.$emit('input', newVal);
      },
    },
    methods: {
      onFilter() {
        this.queryParams = {
          ...this.queryParams,
          keyword: this.filterCategoryName,
        };
      },
      onCategoryChoosed(selectedRows) {
        this.$emit('choosed', selectedRows);
      },
    },
  };
</script>

<style lang="less">
  .category-select-dialog {
    .category-filter {
      border-bottom: 1px solid rgba(235, 235, 235, 1);
      padding-bottom: 10px;
      text-align: left;
      padding-left: 20px;
    }

    .el-input__inner {
      border-color: #dce1e6 !important;
    }
  }
</style>
