/* * @Author: Neexz * @Date: 2018-11-09 09:19:43 * @Last Modified by: mikey.zhaopeng * @Last Modified time: 2020-03-26
15:55:57 * @Example 参考 @/dss-wechat3rd/src/retail-views/goods-mgr/inventory-mgr/verification/addOrModify/index.vue *
详细使用方式请参考 http://nlush.com/egrid/#/ */

<template>
  <el-dialog
    :title="title"
    :append-to-body="innerDialog"
    class="table-select-dialog"
    @open="onDialogOpen"
    :width="width"
    :class="dataList && dataList.length ? 'fixed-height' : ''"
    :visible.sync="isShow"
    :close-on-click-modal="closeOnClickModal"
  >
    <slot name="filter"></slot>
    <slot name="limit"></slot>
    <egrid
      class="egrid wkt-table"
      fit
      ref="multipleTable"
      :height="height"
      :key="0"
      v-loading="loading"
      :column-type="colType"
      :data="data"
      :columns="columns"
      :columns-schema="columnsSchema"
      :columns-props="columnsProps"
      :column-type-props="columnTypeProps"
      :columns-handler="columnsHandler"
      @selection-change="handleSelectionChange"
    />

    <div style="margin: 15px 0">
      <el-button v-if="isAll" @click="handleSelectAll">{{ isClickAll ? '取消全选' : '一键全选' }}</el-button>
    </div>

    <el-pagination
      v-if="totalCount"
      style="margin-top: 0"
      :hide-on-single-page="true"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-size="pageParams.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      layout="sizes, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>

    <div slot="footer" v-if="enableMultiple">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="handleSelectedItems">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import Vue from 'vue';
  import Egrid from 'egrid';
  import services from '@/dss-common/utils/services';
  import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
  import './index.less';

  Vue.use(Egrid);

  export default {
    name: 'TableSelectDialog',
    mixins: [tableCheckedHelperMixin],
    model: {
      prop: 'showDialog',
    },

    props: {
      closeOnClickModal: {
        type: Boolean,
        default: true,
      },
      innerDialog: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      height: {
        type: String,
        default: '',
      },
      width: {
        type: String,
        default: '900px',
      },
      limit: {
        type: Number,
        default: 0,
      },
      enableMultiple: {
        type: Boolean,
        default: false,
      },

      unionKeys: {
        type: Array,
        default() {
          return [];
        },
      },

      selectedList: {
        type: Array,
        default() {
          return [];
        },
      },
      // 列表数据，如果设置该数据，则不会根据apiurl请求数据
      dataList: {
        type: Array,
        default: () => {
          return null;
        },
      },

      apiUrl: {
        type: [String, Function],
        default: null,
      },

      isAll: {
        type: Boolean,
        default: false,
      },

      queryParams: {
        type: Object,
        default() {
          return null;
        },
      },

      showDialog: {
        type: Boolean,
        default: false,
      },

      openRefresh: {
        type: Boolean,
        default: false,
      },

      columns: {
        type: Array,
        default() {
          return [];
        },
      },

      columnType: [String, Array],
      columnTypeProps: {
        type: Object,
        default() {
          return null;
        },
      },
      columnKeyMap: {
        type: Object,
        default() {
          return null;
        },
      },
      columnsProps: {
        type: Object,
        default() {
          return null;
        },
      },
      columnsSchema: {
        type: Object,
        default() {
          return null;
        },
      },
      columnsHandler: {
        type: Function,
        default: () => {
          return null;
        },
      },
    },

    data() {
      return {
        className: '',
        loading: false,
        data: [],
        size: 'medium',
        totalCount: 0,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },

        // 选中的条目
        selectedItems: [],
        isShow: false,
        timer: null,

        isClickAll: false,
      };
    },

    computed: {
      colType() {
        return this.enableMultiple ? 'selection' : '';
      },
    },

    watch: {
      showDialog(newVal, oldVal) {
        this.isShow = newVal;
      },

      isShow(newVal, oldVal) {
        this.$emit('input', newVal);
      },

      queryParams: {
        deep: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.data = [];
            this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys, () => {
              this.invokeApiList();
            });

            // 判断点击了一键全选才需要重新设置选中状态
            if (this.isClickAll) {
              // 设置一键全选为false
              this.isClickAll = false;

              // 清空之前所有的选中状态
              this.selectedItems = [];
              this.mResetCheckedData();
              this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);
              // 重新刷新数据
              this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
            }
          }
        },
      },
      selectedList(newVal, oldVal) {
        if (newVal) {
          this.mTotalCheckedList = [];
          this.mTotalCheckedList.push(...newVal);
          this.selectedItems = newVal || [];
        }
      },
    },

    methods: {
      invokeApiList() {
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
        this.timer = window.setTimeout(() => {
          if (this.loading) {
            this.invokeApiList();
            return;
          }
          if (this.pageParams.pageNo === 1) {
            this.getDataList();
          } else {
            // pageNo变化也会请求数据
            this.pageParams.pageNo = 1; /* 请求参数发生变化时，重置pageNo为1,兼容输入过滤条件时，分页从1重新开始 */
            this.getDataList();
          }
          this.timer = null;
        }, 300);
      },
      // 取消选中
      toggleSelection() {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
        }
      },

      getDataList() {
        this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);
        if (!this.apiUrl) {
          this.totalCount = 0;
          this.data = this.dataList;
          this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
        } else {
          // 正在加载时不再重复请求
          if (this.loading) {
            return;
          }
          this.loading = true;
          const params = {
            ...this.pageParams,
            ...this.queryParams,
          };
          // console.log('是否有页码数据:', params);
          (typeof this.apiUrl === 'function'
            ? this.apiUrl(params)
            : services.arrayGet(this.apiUrl, {
                params,
                action: '获取列表数据',
              })
          )
            .done(res => {
              this.totalCount = res.totalCount;
              this.data = res.data || [];
              this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
            })
            .always(() => {
              this.loading = false;
            });
        }
      },

      /**
       * 一键全选时获取全部数据
       */
      getAllDataList() {
        this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);

        if (this.isClickAll) {
          // 正在加载时不再重复请求
          if (this.loading) {
            return;
          }
          this.loading = true;
          const params = {
            ...this.queryParams,
            ...this.pageParams,
          };

          (typeof this.apiUrl === 'function'
            ? this.apiUrl(params)
            : services.get(this.apiUrl, {
                params,
                action: '获取列表数据',
              })
          )
            .done(res => {
              this.totalCount = res.totalCount;
              this.selectedItems = res.data || [];
              this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
              this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          // 清空之前所有的选中状态
          this.mResetCheckedData();
          this.selectedItems = [];
          // 重新刷新数据
          this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
          this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);
        }
      },

      handleSelectAll() {
        this.isClickAll = !this.isClickAll;

        this.getAllDataList();
      },

      onDialogOpen() {
        if (!this.data || this.data.length === 0 || this.openRefresh) {
          this.getDataList();
        } else if (this.enableMultiple) {
          this.mBuildMultipleTableSelection(this.data, 'multipleTable', this.unionKeys);
        }
      },

      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getDataList();
      },

      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getDataList();
      },

      handleSelectionChange(selectedItems) {
        this.selectedItems = selectedItems;
      },

      handleSelectedItems() {
        this.mUpdateTotalListBySelection(this.data, this.selectedItems, this.unionKeys);
        // 总选择数大于限制数目，提示不允许
        if (this.limit > 0 && this.mTotalCheckedList.length > this.limit) {
          this.$message(`最多选择${this.limit}条`);
        } else {
          this.isShow = false;
          this.$emit('choose', this.$plain(this.mTotalCheckedList));
        }
      },
    },
  };
</script>

<style lang="less">
  .table-select-dialog {
    .el-dialog__header {
      padding: 20px 20px 10px !important;
    }

    .el-dialog .el-dialog__body {
      padding: 0;
    }
  }

  .fixed-height {
    .el-dialog {
      .el-dialog__body {
        .el-table {
          max-height: 545px;
          overflow-y: auto;
        }
      }
    }
  }
</style>
