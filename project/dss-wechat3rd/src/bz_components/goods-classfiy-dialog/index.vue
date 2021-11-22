<template>
  <el-dialog :visible.sync="dialogVisible"
             append-to-body
             class="goods-classfiy-list"
             v-loading="loading">
    <div class="condition">
      <el-button class="add-comment"
                 @click="handleAdd"
                 type="primary">添加分类</el-button>
    </div>
    <div class="note">同级分类可长按拖动排序</div>
    <div class="tree-table">
      <div class="header">
        <span>分类</span>
        <span>操作</span>
      </div>
      <el-tree :data="classfiyList"
               ref="tree"
               :props="defaultProps"
               node-key="id"
               :default-expanded-keys='idArr'
               draggable
               :allow-drop="allowDrop"
               @node-drop="handleDrop">
        <span slot-scope='{node,data}'>
          <span>{{ node.label }}</span>
          <span class="operation">
            <img :src="icon_add"
                 v-if="node.level<3"
                 @click.stop="handleAddChild(data)" />
            <img :src="icon_edit"
                 @click.stop="handleEdit(data)" />
            <img :src="icon_del"
                 @click.stop="handleRemove(data)" />
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 分类添加及编辑对话弹框 -->
    <goods-classfiy-add v-if="showGoodsClassfiyAdd"
                        :visible.sync="showGoodsClassfiyAdd"
                        class="goods-classfiy-add"
                        :edit-title="editTitle"
                        :editObj="editObj"
                        :onSaveClassfiy="onSaveClassfiy"></goods-classfiy-add>
  </el-dialog>
</template>

<script>
import goodsClassfiyAdd from '@/dss-wechat3rd/src/bz_components/goods-classfiy-dialog/add.vue';
import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi.js';
import icon_add from '@/dss-wechat3rd/src/images/goods/classfiy-add.png';
import icon_edit from '@/dss-wechat3rd/src/images/goods/classfiy-edit.png';
import icon_del from '@/dss-wechat3rd/src/images/goods/classfiy-remove.png';

export default {
  name: 'goodsClassfiyDialog',
  components: { goodsClassfiyAdd },
  props: {
    //是否显示弹窗
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 1
    }
  },
  computed: {
    // 是否显示分类弹框
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  data() {
    return {
      loading: false,
      icon_add,
      icon_edit,
      icon_del,

      showGoodsClassfiyAdd: false,
      classfiyList: [],
      editObj: null,
      idArr: [],
      defaultProps: {
        children: 'childrenCategory',
        label: 'category'
      },

      selectedCategoryId: null, // 选中的分类id
      selectedCategoryArray: [] // 选中的分类数组，包括父级及子级
    };
  },

  mounted() {
    this.getClassfiyList(); // 查询分类列表
  },

  methods: {
    /**
     * 查询分类列表
     */
    getClassfiyList(categoryId) {
      this.loading = true;
      classfiyApi
        .queryCategoryList({ type: this.type })
        .then(rs => {
          this.classfiyList = rs.data || [];
          if (categoryId) {
            this.assembleCategoryTree(categoryId); // 获取选中分类及其所有父节点组成分类树
          }
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    /**
     * 只允许同级拖拽
     */
    allowDrop(moveNode, inNode, type) {
      if (moveNode.level === inNode.level) {
        if (moveNode.parent.id === inNode.parent.id) {
          return type === 'prev' || type === 'next';
        }
      }
    },
    /**
     * 保存拖拽
     */
    handleDrop(moveNode, inNode, type) {
      let queryParam = this.getOrder(moveNode.data.parentId);
      this.getExpanded(moveNode.data.id);
      classfiyApi
        .order_category(queryParam)
        .then(rs => {
          this.getClassfiyList(); // 查询分类列表
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {});
    },
    /**
     * 获取拖拽顺序
     */
    getOrder(parent) {
      let queryParam = [];
      if (parent) {
        let parentData = this.$refs.tree.getNode(parent).data;
        parentData.childrenCategory.forEach((item, index) => {
          let query = {
            id: item.id,
            seq: index
          };
          queryParam.push(query);
        });
      } else {
        this.classfiyList.forEach((item, index) => {
          let query = {
            id: item.id,
            seq: index
          };
          queryParam.push(query);
        });
      }
      return queryParam;
    },

    /**
     * 添加分类
     */
    handleAdd() {
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '添加分类';
      this.editObj = {
        id: null,
        type: this.type
      };
    },

    /**
     * 添加子分类
     */
    handleAddChild(row) {
      this.getExpanded(row.id);
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '添加子分类';
      this.editObj = {
        id: row.id,
        type: this.type
      };
    },

    /**
     * 编辑分类
     */
    handleEdit(row) {
      this.getExpanded(row.id);
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '编辑分类';
      this.editObj = {
        id: row.id,
        category: row.category,
        isEdit: true,
        categoryImgUrl: row.categoryImgUrl,
        type: this.type
      };
      this.selectedCategoryId = row.id; // 编辑状态下设置编辑的id为选中的id
    },

    /**
     * 删除分类
     */
    handleRemove(row) {
      this.$confirm('删除后，该分类下如有子分类也会一起删除。', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          classfiyApi
            .delete_category({ categoryId: row.id, type: this.type })
            .then(rs => {
              this.getExpanded(row);
              this.getClassfiyList(row.id); // 查询分类列表
            })
            .catch(err => {
              console.error(err);
            })
            .always(() => {});
        })
        .catch(() => {
          console.log('取消删除分类');
        });
    },

    /**
     * 保存当前操作的节点
     */
    getExpanded(id) {
      let idArr = [];
      if (id) {
        idArr.push(id);
      }
      this.idArr = idArr;
    },

    /**
     * 保存分类关闭弹窗后执行的函数
     */
    onSaveClassfiy(res) {
      if (this.selectedCategoryId) {
        // 编辑
        this.getClassfiyList(this.selectedCategoryId); // 查询分类列表
      } else {
        // 新增
        this.getClassfiyList(res.data); // 查询分类列表
      }
    },

    /**
     * 获取选中分类及其所有父节点组成分类树
     */
    assembleCategoryTree(selectedCategoryId) {
      this.selectedCategoryId = selectedCategoryId;
      this.selectedCategoryArray = []; // 每次解析之前都要清空之前的数据
      try {
        this.getSelectedCategory(this.classfiyList);
      } catch (error) {}

      // 将选中分类及其所有父节点组成分类树
      for (let i = 0; i < this.selectedCategoryArray.length - 1; i++) {
        this.selectedCategoryArray[i + 1].parentCategory = this.selectedCategoryArray[i];
      }
      const categoryDTO = this.selectedCategoryArray[this.selectedCategoryArray.length - 1];

      this.$emit('onChoiceClassfiy', categoryDTO);
      this.dialogVisible = false; // 关闭当前弹框
    },

    /**
     * 获取选中的分类对象及其所有父节点
     */
    getSelectedCategory(categoryItem) {
      function get(item) {
        this.selectedCategoryArray.push(item);
        if (item.id === this.selectedCategoryId) {
          throw new Error('ignoe');
        } else if (item.childrenCategory && item.childrenCategory.length) {
          item.childrenCategory.forEach(childItem => {
            get.bind(this)(childItem);
          });
          this.selectedCategoryArray.pop();
        } else {
          this.selectedCategoryArray.pop();
        }
      }
      categoryItem.forEach((item, index) => {
        this.selectedCategoryArray = [];
        get.bind(this)(item);
      });
    }
  }
};
</script>
<style  lang="less">
.goods-classfiy-list {
  overflow: hidden;
  .note {
    font-size: 12px;
    color: rgba(153, 153, 153, 1);
    margin-left: 20px;
    margin-top: 20px;
  }
  .condition {
    margin-top: 20px;
    margin-right: 20px;
    position: relative;
    overflow: hidden;
    .add-comment {
      float: right;
    }
  }

  .tree-table {
    margin: 10px 20px 25px 20px;
    border: 1px solid rgba(220, 221, 224, 1);
    .header {
      background: rgba(242, 244, 247, 1);
      font-size: 14px;
      color: @black-color;
      line-height: 30px;
      span:first-child {
        margin-left: 41px;
      }
      span:last-child {
        float: right;
        margin-right: 70px;
      }
    }
    .operation {
      float: right;
      line-height: 17px;
      position: absolute;
      right: 30px;
      img {
        width: 17px;
        height: 17px;
        margin-left: 30px;
        vertical-align: middle;
      }
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0px 10px 0 15px;
    }
    .el-tree-node__content {
      height: 30px;
    }
    .el-tree-node__content {
      border-top: 1px solid rgba(220, 221, 224, 1);
    }
  }

  .el-dialog {
    margin-top: 15vh !important;
    width: 800px;
    height: 70%;

    .el-dialog__body {
      height: calc(100% - 80px);
    }

    .tree-table {
      height: calc(100% - 100px);
      overflow-y: scroll;
    }

    .el-dialog__footer {
      padding: 20px 55px 30px;
    }
  }
}

.goods-classfiy-add {
  .el-dialog {
    width: 450px;
    margin-top: 25vh !important;
  }
}
</style>
