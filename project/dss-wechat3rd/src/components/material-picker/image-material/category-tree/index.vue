<template>
  <div class="tree-selector" v-loading="treeLoading" :style="'width:'+width+';height:'+height">
    <el-scrollbar style="height:100%" class="scrollbar" v-loading="loading">
      <el-tree
        :data="data"
        :indent="18"
        highlight-current
        ref="tree"
        default-expand-all
        :default-expanded-keys="arrId"
        :current-node-key="defaultKey"
        node-key="id"
        :props="defaultProps"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span class="node-text">{{ node.label }}</span>
        </span>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
import api from '../../new-materials';
import materialEnum from '../material-type';
export default {
  components: {},
  props: {
    showOperation: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: 'calc(100vh - 108px)'
    },
    defaultKey: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      loading: false,
      treeLoading: false,
      arrId: [],
      showFolder: false,
      defaultProps: {
        label: 'groupName',
        children: 'childGroup'
      },
      data: JSON.parse(sessionStorage.getItem('dsp_picture_category')) || [
        {
          id: 0,
          groupName: '全部',
          childGroup: []
        }
      ],
      isEdit: false,
      editItem: {},
      tagList: []
    };
  },

  mounted() {
    this.queryTree();
  },

  watch: {
    data: {
      handler(val) {
        sessionStorage.setItem('dsp_picture_category', JSON.stringify(val));
      },
      deep: true
    },
    defaultKey() {
      this.$refs.tree.setCurrentKey(this.defaultKey);
    }
  },

  methods: {
    handleNodeClick(node) {
      this.$emit('nodeClick', node);
    },

    queryTree() {
      let params = {
        materialType: materialEnum.materialType.IMAGE
      };

      if (!this.data[0].childGroup.length) {
        this.loading = true;
      }

      api
        .queryTree(params)
        .then(res => {
          this.data[0].childGroup = res.data || [];
          this.data = this.data;
          this.loading = false;
        })
        .always(res => {
          this.loading = false;
          this.$nextTick(() => {
            let key = this.$refs.tree.getCurrentKey();
            this.$refs.tree.setCurrentKey(key);
          });
        });
    }
  }
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
  // height: calc(100vh - 48px);
  font-size: 14px;
  color: #717378;
  position: relative;
  overflow-y: auto;
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
    font-size: 0px;
    cursor: default;
    color: transparent;
    /* margin-right: 2px; */
    padding: 0;
  }

  /deep/ .el-tree-node__content:hover {
    background: #edf6ff;
    color: #256dff;

    .el-icon-caret-right {
      color: #256dff;
    }
    i {
      color: #256dff;
    }
    .el-tree-node__expand-icon.is-leaf + .custom-tree-node {
      &:before {
        content: '';
        width: 16px;
        height: 16px;
        // background: url('./images/folder-org.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        // margin: 0 8px;
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
    &:before {
      content: '';
      width: 16px;
      height: 16px;
      // background: url('./images/folder.png') 0 0 no-repeat;
      background-size: cover;
      display: inline-block;
      // margin: 0 8px;
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
      &:before {
        content: '';
        width: 16px;
        height: 16px;
        // background: url('./images/folder-org.png') 0 0 no-repeat;
        background-size: cover;
        display: inline-block;
        // margin: 0 8px;
        margin: 0 -1px;
      }
    }
  }
}
</style>
