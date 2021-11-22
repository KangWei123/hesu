<template>
  <table-select-dialog
    :title="title"
    v-model="showDialog"
    class="category-select-dialog"
    enable-multiple
    :columns="columns"
    :api-url="apiUrl"
    :selected-list="selectedCategories"
    :union-keys="['id']"
    :query-params="queryParams"
    :limit="limit"
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
  </table-select-dialog>
</template>

<script>
import constants from '@/dss-wechat3rd/src/constants/index';
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';

const columns = [
  {
    prop: 'category',
    label: '分类',
    propsHandler: Handler.propsHanler
  }
];
export default {
  name: 'CategorySelectDialog',
  components: {
    TableSelectDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    selectedCategories: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      columns,
      showDialog: false,
      apiUrl: constants.Api.category.pageList,
      filterCategoryName: null,
      queryParams: {
        itemType: goodsTypeEnum.product.value
      }
    };
  },
  watch: {
    value(newVal, oldVal) {
      this.showDialog = newVal;
    },
    showDialog(newVal, oldVal) {
      this.$emit('input', newVal);
    }
  },
  methods: {
    onFilter() {
      this.queryParams = {
        ...this.queryParams,
        keyword: this.filterCategoryName
      };
    },
    onCategoryChoosed(selectedRows) {
      this.$emit('choosed', selectedRows);
    }
  }
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
}
</style>
