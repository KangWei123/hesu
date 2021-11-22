<template>
  <table-select-dialog v-model="showDialog"
                       class="store-select-dialog"
                       :inner-dialog="innerDialog"
                       :enable-multiple="enableMultiple"
                       :columns="columns"
                       :columns-handler="enableMultiple ? null : columnsHandler"
                       :data-list="filterAllStoreList"
                       :api-url="apiUrl"
                       :selected-list="selectedStores"
                       :union-keys="['id']"
                       :query-params="allQueryParams"
                       :limit="limit"
                       :is-all="isAll"
                       @choose="onStoreChoosed">
    <div slot="filter"
         class="store-filter">
      <store-list-filter :title="title" :is-show-area="isShowArea" :is-show-dealer="isShowDealer" @filter="onFilter" />
    </div>
  </table-select-dialog>
</template>

<script>
import { mapState } from 'vuex';
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import ChooseColumn from './choose-column.vue';
import StoreListFilter from './store-list-filter.vue';

const columns = [
  {
    prop: 'name',
    label: '门店',
    propsHandler: Handler.propsHanler
  }
];
export default {
  name: 'StoreSelectDialog',
  components: {
    TableSelectDialog,
    StoreListFilter
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    innerDialog: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 0
    },
    enableMultiple: {
      type: Boolean,
      default: true
    },
    queryParams: {
      type: Object,
      default: function() {
        return null;
      }
    },
    apiUrl: {
      type: String,
      default: ''
    },
    selectedStores: {
      type: Array,
      default: function() {
        return [];
      }
    },
    isAll: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择门店'
    },
    isShowArea: {
      type: Boolean,
      default: true
    },
    isShowDealer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns,
      columnsHandler: cols => {
        const that = this;
        return cols.concat({
          align: 'right',
          sortable: false,
          component: ChooseColumn,
          listeners: {
            'single-choosed'(store) {
              that.$emit('single-choosed', store);
              that.showDialog = false;
            }
          }
        });
      },
      showDialog: false,
      allQueryParams: null,
      filterParams: null
    };
  },
  computed: {
    ...mapState({
      storeList: 'storeList'
    }),
    filterAllStoreList() {
      if (!this.apiUrl) {
        const filterParams = this.filterParams;
        const stores = this.$plain(this.storeList);
        return stores.filter(store => {
          let inFilter = true;
          if (filterParams) {
            //本地过滤匹配门店名和区域选择的门店
            const { storeName, storeIdList } = filterParams;
            if (filterParams.storeName) {
              inFilter = store.name.indexOf(storeName) !== -1;
            }
            if (inFilter && storeIdList && storeIdList.length) {
              const selectedStoreId = storeIdList.find(storeId => {
                return storeId === store.id;
              });
              inFilter = !!selectedStoreId;
            }
          }
          return !!store.id && inFilter;
        });
      } else {
        return null;
      }
    }
  },
  watch: {
    value(newVal, oldVal) {
      this.showDialog = newVal;
    },
    showDialog(newVal, oldVal) {
      this.$emit('input', newVal);
    },
    queryParams: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        this.allQueryParams = {
          ...this.queryParams
        };
      }
    }
  },
  methods: {
    onFilter(filter) {
      const params = { ...filter };
      this.filterParams = filter;
      // 选择了区域才进行转化处理
      if (params.storeIdList && params.storeIdList.length) {
        params.storeIdList.forEach((item, index) => {
          params['storeIds[' + index + ']'] = item;
        });
      }
      delete params.storeIdList;

      this.allQueryParams = {
        ...this.queryParams,
        ...params
      };
    },
    onStoreChoosed(selectedRows) {
      this.$emit('choosed', selectedRows);
    }
  }
};
</script>

<style lang="less">
.store-select-dialog {
  .el-table {
    padding-top: 0px;
  }
  .el-table thead th {
    .cell {
      text-align: left;
    }
  }
  .el-dialog {
    display: inline-block;
    width: 770px !important;
    margin: 0 !important;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  // .store-filter {
  //   border-bottom: 1px solid rgba(235, 235, 235, 1);
  //   padding-bottom: 10px;
  //   margin-bottom: 19px;
  // }
}
</style>
