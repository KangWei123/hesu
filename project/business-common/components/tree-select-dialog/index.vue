<template>
  <el-dialog
    :title="title"
    :append-to-body="innerDialog"
    class="tree-select-dialog"
    @open="onDialogOpen"
    :width="width"
    :class="dataList && dataList.length ? 'fixed-height' : ''"
    :visible.sync="isShow"
  >
    <slot name="filter"></slot>
    <slot name="limit"></slot>
    <el-tree
      class="wkt-tree"
      ref="tree"
      :props="treeProps"
      :data="data"
      :load="loadNode"
      :lazy="lazy"
      :node-key="treeProps.nodeKey"
      show-checkbox
      @check-change="handleCheckChange"
      :filter-node-method="filterNode"
    >
    </el-tree>

    <div style="margin: 15px 0">
      <el-button v-if="isAll" @click="handleSelectAll">{{ isClickAll ? '取消全选' : '一键全选' }}</el-button>
    </div>

    <div slot="footer" v-if="enableMultiple">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="handleSelectedItems">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import services from '@/dss-common/utils/services';

  export default {
    name: 'TreeSelectDialog',
    model: {
      prop: 'showDialog',
    },

    props: {
      innerDialog: {
        type: Boolean,
        default: false,
      },
      title: {
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
        default: true,
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
      lazy: {
        type: Boolean,
        default: false,
      },
      queryParams: {
        type: Object,
        default() {
          return null;
        },
      },
      treeProps: {
        type: Object,
        default() {
          return {
            nodeKey: 'id',
            label: 'name',
            children: 'children',
          };
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
    },

    data() {
      return {
        className: '',
        loading: false,
        data: [],
        isShow: false,
        timer: null,
        isClickAll: false,
      };
    },

    watch: {
      showDialog(newVal) {
        this.isShow = newVal;
      },
      isShow(newVal) {
        this.$emit('input', newVal);
      },
      queryParams: {
        deep: true,
        handler(newVal) {
          if (newVal && typeof newVal.keyword !== 'undefined') {
            this.$refs.tree.filter(newVal.keyword);
          }
        },
      },
    },

    methods: {
      getDataList(p = {}, cb) {
        if (!this.apiUrl) {
          this.data = this.dataList;
          this.initSelected();
        } else {
          // 正在加载时不再重复请求
          if (this.loading) {
            return;
          }
          this.loading = true;
          const params = { ...this.queryParams, ...p };

          (typeof this.apiUrl === 'function'
            ? this.apiUrl(params)
            : services.arrayGet(this.apiUrl, {
                params,
                action: '获取列表数据',
              })
          )
            .done(res => {
              if (p.parentId && cb) {
                cb(res.data);
              } else {
                this.data = res.data || [];
              }
              this.initSelected();
            })
            .always(() => {
              this.loading = false;
            });
        }
      },
      // 构建完 tree 之后才将已选列表进行设置
      initSelected() {
        this.$nextTick(() => {
          if (this.$refs.tree) {
            this.$refs.tree.setCheckedNodes(this.selectedList);
          }
        });
      },
      // TODO: 懒加载节点
      loadNode(node, resolve) {
        if (this.lazy) {
          this.getDataList({ parentId: node[this.treeProps.nodeKey] }, resolve);
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data[this.treeProps.label].indexOf(value) !== -1;
      },
      handleSelectAll() {
        if (this.isClickAll) {
          this.$refs.tree.setCheckedNodes([]);
        } else {
          this.$refs.tree.setCheckedNodes(this.data);
        }
        this.$refs.tree.this.isClickAll = !this.isClickAll;
      },
      onDialogOpen() {
        if (this.openRefresh || !this.data || this.data.length === 0) {
          this.getDataList();
        } else {
          this.initSelected();
        }
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },
      handleSelectedItems() {
        const selectedList = this.$refs.tree.getCheckedNodes();
        // 总选择数大于限制数目，提示不允许
        if (this.limit > 0 && selectedList.length > this.limit) {
          this.$message(`最多选择${this.limit}条`);
        } else {
          this.isShow = false;
          this.$emit('choose', selectedList);
        }
      },
    },
  };
</script>

<style lang="less">
  .tree-select-dialog {
    .el-dialog {
      .el-dialog__body {
        padding: 0;
        .el-tree:before {
          height: 0;
        }
      }

      .el-dialog__header {
        padding: 20px 20px 10px !important;
      }
    }

    .wkt-tree {
      max-height: 400px;
      overflow-y: auto;
    }
  }

  .fixed-height {
    .el-dialog {
      .el-dialog__body {
        .el-tree {
          max-height: 545px;
          overflow-y: auto;
        }
      }
    }
  }
</style>
