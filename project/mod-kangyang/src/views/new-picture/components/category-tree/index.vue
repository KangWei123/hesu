<template>
  <div class="tree-selector" v-loading="treeLoading" :style="'width:' + width + ';height:' + height">
    <el-scrollbar style="height: 100%" class="scrollbar" v-loading="loading">
      <div v-if="isElderSpace" class="filter">
        <el-input v-model="filterText" size="mini" placeholder="输入关键字进行过滤"></el-input>
      </div>
      <el-tree
        ref="tree"
        :data="data"
        :indent="18"
        node-key="id"
        highlight-current
        :default-expanded-keys="expanedKey"
        :current-node-key="defaultKey"
        :props="defaultProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      >
        <span :class="['custom-tree-node', { disabled: data.disabled }]" slot-scope="{ node, data }">
          <span class="node-text" :title="node.label">{{ node.label }}</span>

          <div class="toolbar-box" v-if="node.label !== '全部' && showOperation">
            <el-dropdown trigger="click" placement="bottom-start" @command="handleCommand">
              <i class="el-icon-more" style="transform: rotate(90deg)" @click.stop="handleMore(data)"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-if="allowAdd(data)" command="add" :disabled="node.level > 3"
                  >添加文件夹</el-dropdown-item
                >
                <el-dropdown-item v-if="allowEdit(data)" command="edit">编辑文件夹</el-dropdown-item>
                <el-dropdown-item v-if="allowEdit(data)" command="delete">删除文件夹</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </span>
      </el-tree>
    </el-scrollbar>

    <add-folder
      :visible.sync="showFolder"
      v-if="showFolder"
      :is-edit="isEdit"
      :data="editItem"
      @submit="submit"
    ></add-folder>
  </div>
</template>

<script>
  import addFolder from '../dialogs/add-folder';
  import { elderSpaceApi } from '@/mod-kangyang/src/api';
  import { FOLDER_TYPE } from '@/mod-kangyang/src/views/new-picture/constants';
  import { isEditableFolder } from '@/mod-kangyang/src/utils';
  import materialEnum from '../material-type';
  import debounce from 'lodash/debounce';

  const defaultData = [
    {
      id: 0,
      name: '全部',
      subFolderList: [],
    },
  ];

  /**
   * 素材分类目录
   */
  export default {
    name: 'CategoryTree',
    components: {
      addFolder,
    },
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    props: {
      // 显示操作栏
      showOperation: {
        type: Boolean,
        default: true,
      },
      asSelector: {
        type: Boolean,
        default: false,
      },
      /**
       * 源素材
       */
      sourceMaterial: {
        type: Object,
        default: null,
      },
      width: {
        type: String,
        default: '220px',
      },
      height: {
        type: String,
        default: 'calc(100vh - 108px)',
      },
      defaultKey: {
        type: Number,
        default: null,
      },
      showAll: {
        type: Boolean,
        default: true,
      },
    },

    data() {
      return {
        FOLDER_TYPE,
        loading: false,
        filterText: '',
        treeLoading: false,
        arrId: [],
        showFolder: false,
        defaultProps: {
          label: 'name',
          children: 'subFolderList',
        },
        data: JSON.parse(sessionStorage.getItem(`elder_space${this.moduleType}`)) || defaultData,
        isEdit: false,
        editItem: {},
        tagList: [],
      };
    },
    computed: {
      expanedKey() {
        return [this.defaultKey];
      },
      triggerFilter() {
        return debounce(val => {
          this.$refs.tree.filter(val);
        }, 500);
      },
    },

    mounted() {
      this.queryTree();
    },

    watch: {
      data: {
        handler(val) {
          sessionStorage.setItem(`elder_space${this.moduleType}`, JSON.stringify(val));
        },
        deep: true,
      },
      filterText(val) {
        this.triggerFilter(val);
      },
      defaultKey() {
        this.$refs.tree.setCurrentKey(this.defaultKey);
        setTimeout(() => {
          const el = this.$el.querySelector('.is-current');
          if (el) {
            el.scrollIntoViewIfNeeded ? el.scrollIntoViewIfNeeded() : el.scrollIntoView();
          }
        }, 1000);
      },
    },

    methods: {
      allowAdd(data) {
        return true;
      },
      allowEdit(data) {
        return !this.isElderSpace || isEditableFolder(data);
      },
      handleNodeClick(node) {
        if (node.disabled) {
          return;
        }

        this.$emit('nodeClick', node);
      },

      queryTree() {
        const params = {
          materialType: materialEnum.materialType.IMAGE,
        };

        if (!this.data[0].subFolderList.length) {
          this.loading = true;
        }

        return elderSpaceApi
          .queryTree(params)
          .then(res => {
            const list = this.preprocessTree(res.data || []);
            // 是否显示全部
            if (this.showAll) {
              const data = defaultData;
              data[0].subFolderList = list;
              this.data = data;
            } else {
              this.data = list;
            }

            this.arrId = this.data.map(i => i.id);

            this.loading = false;
          })
          .always(res => {
            this.loading = false;
            this.$nextTick(() => {
              const key = this.$refs.tree.getCurrentKey();
              this.$refs.tree.setCurrentKey(key);
            });
          });
      },

      preprocessTree(list) {
        if (this.isElderSpace && this.asSelector) {
          const walk = folders => {
            for (const item of folders) {
              // 未识别目录不允许新增东西
              if (item.folderType === FOLDER_TYPE.FACE_VERIFY_FAIL) {
                item.disabled = true;
              } else if (this.sourceMaterial) {
                if (
                  // 图片目录只能放图片
                  (this.sourceMaterial.materialType !== materialEnum.materialType.IMAGE &&
                    item.folderType === FOLDER_TYPE.ELDER_PIC) ||
                  // 视频目录只能放视频
                  (this.sourceMaterial.materialType !== materialEnum.materialType.VIDEO &&
                    item.folderType === FOLDER_TYPE.ELDER_VIDEO)
                ) {
                  item.disabled = true;
                }
              }

              if (item.subFolderList && item.subFolderList.length) {
                walk(item.subFolderList);
              }
            }
          };
          walk(list);
        }

        return list;
      },

      handleCommand(command) {
        switch (command) {
          case 'add':
            this.handleAdd();
            break;
          case 'edit':
            this.editCategory();
            break;
          case 'delete':
            this.deleteCategory();
            break;
        }
      },
      handleMore(data) {
        this.editItem = {
          id: data.id,
          groupName: data.name,
          parentId: data.parentId,
        };
      },

      handleAllAdd() {
        this.editItem = {
          id: 0,
        };
        this.isEdit = false;
        this.showFolder = true;
      },

      handleAdd() {
        this.isEdit = false;
        this.showFolder = true;
      },

      editCategory() {
        this.isEdit = true;
        this.showFolder = true;
      },

      submit() {
        this.queryTree();
      },

      filterNode(value, data) {
        if (!value) {
          return true;
        }
        return data.name.indexOf(value) !== -1;
      },

      deleteCategory() {
        this.$confirm(
          this.isElderSpace ? '删除后将无法恢复，确认删除？' : '删除文件夹内项目会被放进回收站7天内可以在回收站还原',
          '是否确定删除所选文件夹？',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true,
            type: 'warning',
            customClass: 'wkb-confirm',
          }
        ).then(() => {
          elderSpaceApi
            .deleteFolder({ ids: this.editItem.id })
            .then(res => {
              this.$message.success('删除成功');
              this.queryTree().then(() => {
                // 激活其他节点
                const root = this.$refs.tree.root;
                if (root && root.data) {
                  if (Array.isArray(root.data)) {
                    this.$emit('nodeClick', root.data[0]);
                  } else {
                    this.$emit('nodeClick', root.data);
                  }
                }
              });
            })
            .always(res => {});
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .el-loading-mask {
    z-index: 99;
  }

  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .tree-selector {
    overflow-x: hidden;
    overflow-y: auto;
    width: 200px;
    background: white;
    font-size: 14px;
    color: #717378;
    position: relative;

    .filter {
      margin: 0;
      padding: 5px;
    }

    .add-category {
      position: absolute;
      top: 13px;
      right: 8px;
      width: 16px;
      height: 17px;
      z-index: 99;
      cursor: pointer;
    }

    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;

      .toolbar-box {
        font-size: 16px;
        display: none;
        position: absolute;
        right: 10px;
        text-align: center;
      }

      span {
        display: inline-block;
        width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .custom-tree-node.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .custom-tree-node:hover {
      .toolbar-box {
        display: inline-block;
      }
    }

    /deep/ .el-tree {
      background: white;
    }

    /deep/ .el-icon-caret-right {
      font-size: 20px;
      color: #717378;
    }

    /deep/ .el-tree-node__expand-icon.is-leaf {
      font-size: 0;
      cursor: default;
      color: transparent;
      padding: 0;
    }

    /deep/ .el-tree-node__content:hover {
      background: #edf6ff;
      color: #256dff;

      .el-icon-caret-right {
        background: #edf6ff;
      }

      i {
        background: #edf6ff;
      }

      .el-tree-node__expand-icon.is-leaf + .custom-tree-node {
        &::before {
          content: '';
          width: 16px;
          height: 16px;
          background-size: cover;
          display: inline-block;
          margin: 0 -1px;
        }
      }
    }

    /deep/ .el-tree-node__content:visited {
      background: #edf6ff;
    }

    /deep/ .el-tree-node__content:active,
    .router-link-exact-active {
      background: #edf6ff;
    }

    /deep/ .el-tree-node__expand-icon.is-leaf + .custom-tree-node {
      &::before {
        content: '';
        width: 16px;
        height: 16px;
        background-size: cover;
        display: inline-block;
        margin: 0 -1px;
      }
    }

    /deep/ .el-tree-node__content {
      height: 41px;
      line-height: 41px;
      width: 100%;
      border: none;
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background: #edf6ff;
      color: #256dff;

      .el-tree-node__expand-icon {
        color: #256dff;
      }

      .el-tree-node__expand-icon.is-leaf + .custom-tree-node {
        &::before {
          content: '';
          width: 16px;
          height: 16px;
          background-size: cover;
          display: inline-block;
          margin: 0 -1px;
        }
      }
    }
  }
</style>
