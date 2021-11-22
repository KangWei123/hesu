<template>
  <div class="classfiy-list">
    <div class="Add-Manage-Button">
      <el-button type="primary"
                 icon="el-icon-plus"
                 class="add-comment"
                 @click="handleAdd">添加分类</el-button>
<!--      <el-popover placement="bottom"-->
<!--                  width="200"-->
<!--                  trigger="hover"-->
<!--                  content="请登录管理员账号使用此功能"-->
<!--                  v-else>-->
<!--        <el-button class="add-comment isdisabled"-->
<!--                   slot="reference"-->
<!--                   size="mini"-->
<!--                   type="primary"-->
<!--                   round>添加分类</el-button>-->
<!--      </el-popover>-->
    </div>

    <div class="note">同级分类可长按拖动排序</div>
    <div class="tree-table" v-loading="isLoading">
      <div class="header">
        <span>分类名称</span>
        <span class="header-status" v-if="showStatus">小程序展示状态</span>
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
          <span class="status" v-if="showStatus">
            <el-switch  v-model="!!data.isHidden"
                        :active-value="false"
                        :inactive-value="true"
                        active-text="显示"
                        inactive-text="隐藏"
                        active-color="#52C41A"
                        inactive-color="#B1B5BD"
                        @change="changeHidden(data)">
            </el-switch>

            <!-- <el-switch  v-model="!!data.isHidden"
                        :active-value="false"
                        :inactive-value="true"
                        active-color="#52C41A"
                        inactive-color="#B1B5BD"
                        @change="changeHidden(data)">
              
            </el-switch>

              <span class="statusTip Show" v-if="!data.isHidden">显示</span>
              <span class="statusTip hidden" v-else>隐藏</span> -->
          </span>
          <span class="operation">
            <!-- <img :src="icon_add"
                 v-if="node.level<3"
                 @click.stop="handleAddChild(data)" />
            <img :src="icon_edit"
                 @click.stop="handleEdit(data)" />
            <img :src="icon_del"
                 @click.stop="handleRemove(data)" /> -->
            <span v-if="node.level<3" @click.stop="handleAddChild(data)"> <i class="el-icon-plus"></i>子分类</span>
            <span @click.stop="handleEdit(data)">编辑</span>
            <span @click.stop="handleRemove(data)">删除</span>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- 分类添加及编辑对话弹框 -->
    <goods-classfiy-add v-if="showGoodsClassfiyAdd"
                        :visible.sync="showGoodsClassfiyAdd"
                        :edit-title="editTitle"
                        :editObj="editObj"
                        :onSaveClassfiy="onSaveClassfiy"></goods-classfiy-add>
    
    <!-- 删除操作提示对话框 -->
    <!-- <dialog-tip 
      :dialogVisible="dialogVisible" 
      :tipTitle="tipTitle" 
      :tipContent="tipContent" 
      :iconClass="iconClass" 
      :iconColor="iconColor"
      @DialogSure="DialogSure"
      @DialogCancel="DialogCancel"></dialog-tip> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import goodsClassfiyAdd from '@/dss-wechat3rd/src/bz_components/goods-classfiy-dialog/add.vue';
import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi.js';
import icon_add from '@/dss-wechat3rd/src/images/goods/classfiy-add.png';
import icon_edit from '@/dss-wechat3rd/src/images/goods/classfiy-edit.png';
import icon_del from '@/dss-wechat3rd/src/images/goods/classfiy-remove.png';

// import dialogTip from '@/dss-common/components/Dialog/index.vue';

export default {
  name: 'list',
  components: {
    goodsClassfiyAdd
    // dialogTip
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    showStatus: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      icon_add,
      icon_edit,
      icon_del,
      isLoading: false,
      showGoodsClassfiyAdd: false,
      classfiyList: [],
      editObj: null,
      idArr: [],
      defaultProps: {
        children: 'childrenCategory',
        label: 'category'
      },

      // 删除提示对话框
      dialogVisible: false,
      tipTitle: '',
      tipContent: '',
      iconClass: '',
      iconColor: '',
      keyWord: '',
      row: ''
    };
  },

  computed: {
    ...mapState({
      roleList: 'roleList'
    }),

    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    }
  },

  mounted() {
    this.getClassfiyList();
  },

  methods: {
    // 删除对话框确认操作
    // DialogSure() {
    //   this.dialogVisible = false;
    //   if (this.keyWord === 'delSingle') {
    //     this.delSingle(this.row);
    //   }
    // },

    // // 删除对话框取消操作
    // DialogCancel() {
    //   this.dialogVisible = false;
    // },

    /**
     * 警告提示弹框
     */
    warnTip(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    //获取拖拽顺序
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

    getClassfiyList() {
      this.isLoading = true;
      classfiyApi
        .queryCategoryList({ type: this.type })
        .then(rs => {
          this.classfiyList = rs.data || [];
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    handleAdd() {
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '添加分类';
      this.editObj = {
        deepth: false,
        id: null,
        type: this.type
      };
    },

    // 保存分类关闭弹窗后执行的函数
    onSaveClassfiy() {
      this.getClassfiyList();
    },

    //添加子分类
    handleAddChild(row) {
      // 判断是否为企业管理员
      // if (!this.isEnterpriseManager) {
      //   return this.warnTip('请登录管理员账号使用此功能');
      // }
      this.getExpanded(row.id);
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '添加子分类';
      this.editObj = {
        deepth: true,
        id: row.id,
        type: this.type
      };
    },

    /**
     * 编辑分类
     */
    handleEdit(row) {
      // 判断是否为企业管理员
      // if (!this.isEnterpriseManager) {
      //   return this.warnTip('请登录管理员账号使用此功能');
      // }

      this.getExpanded(row.id);
      this.showGoodsClassfiyAdd = true;
      this.editTitle = '编辑分类';
      this.editObj = {
        deepth: row.parentId ? true : false,
        id: row.id,
        category: row.category,
        isEdit: true,
        categoryImgUrl: row.categoryImgUrl,
        type: this.type
      };
    },

    // handleRemove(row) {
    //   this.tipTitle = '删除分类';
    //   this.tipContent = '删除后该分类下如有子分类也会一起删除,确认删除吗？';
    //   this.iconClass = 'el-icon-warning';
    //   this.dialogVisible = true;
    //   this.iconColor = '#F5222D';
    //   this.keyWord = 'delSingle';
    //   this.row = row;
    // },

    // delSingle(row) {
    //   classfiyApi
    //     .delete_category({ categoryId: row.id, type: this.type })
    //     .then(rs => {
    //       this.getExpanded(row);
    //       this.getClassfiyList();
    //     })
    //     .catch(err => {
    //       console.error(err);
    //     })
    //     .always(() => {});
    // },

    handleRemove(row) {
      // 判断是否为企业管理员
      if (!this.isEnterpriseManager) {
        return this.warnTip('请登录管理员账号使用此功能');
      }

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
              this.getClassfiyList();
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

    changeHidden(row) {
      let title = '显示分类';
      let msg = '设置显示后，该分类下的子分类会一起显示';
      let isHidden = !row.isHidden ? 1 : 0;
      if (!row.isHidden) {
        title = '隐藏分类';
        msg = '设置隐藏后，该分类下的子分类会一起隐藏';
      }
      this.$confirm(msg, title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          classfiyApi
            .hide_category({ id: row.id, isHidden: isHidden })
            .then(rs => {})
            .catch(err => {
              console.error(err);
            })
            .always(() => {
              this.getExpanded(row.id);
              this.getClassfiyList();
            });
        })
        .catch(() => {
          this.getExpanded(row.id);
          this.getClassfiyList();
        });
    },

    //保存当前操作的节点
    getExpanded(id) {
      let idArr = [];
      if (id) {
        idArr.push(id);
      }
      this.idArr = idArr;
    },

    //保存拖拽
    handleDrop(moveNode, inNode, type) {
      let queryParam = this.getOrder(moveNode.data.parentId);
      this.getExpanded(moveNode.data.id);
      classfiyApi
        .order_category(queryParam)
        .then(rs => {
          this.getClassfiyList();
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {});
    },

    //只允许同级拖拽
    allowDrop(moveNode, inNode, type) {
      if (moveNode.level === inNode.level) {
        if (moveNode.parent.id === inNode.parent.id) {
          return type === 'prev' || type === 'next';
        }
      }
    }
  }
};
</script>
<style  lang="less">
.classfiy-list {
  border-radius: 0px 0px 4px 4px;
  background: white;
  overflow: hidden;

  .isdisabled {
    margin-left: 10px;
    opacity: 0.3;
    cursor: not-allowed !important;
  }

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
      // background: rgba(242, 244, 247, 1);
      font-size: 14px;
      color: @black-color;
      line-height: 50px;
      span:first-child {
        margin-left: 41px;
      }
      span:last-child {
        float: right;
        margin-right: 30px;
      }
      .header-status{
        float: right;
        position: absolute;
        right: 580px;
      }
    }

    .status{
        float: right;
        position: absolute;
        right: 570px;
        line-height: 20px;
    }
    .operation {
      float: right;
      line-height: 17px;
      position: absolute;
      right: 30px;
      // img {
      //   width: 17px;
      //   height: 17px;
      //   margin-left: 30px;
      //   vertical-align: middle;
      // }
      span {
        color: @ui-function-color-fail;
      }
      span:not(:last-child) {
        color: @ui-function-color-link;
        margin-right: 24px;
      }
      .el-icon-plus {
        font-size: 8px;
      }
    }
    .el-tree-node__content > .el-tree-node__expand-icon {
      padding: 0px 10px 0 15px;
    }
    .el-tree-node__content {
      height: 60px;
    }
    .el-tree-node__content {
      border-top: 1px solid rgba(220, 221, 224, 1);
    }
    .el-switch__core {
      width: 58px !important;
    }
    // .statusTip {
    //   position: relative;
    //   z-index: 10;
    //   color: #fff;
    //   top: 1px;
    //   font-size: 12px;
    // }
    // .Show {
    //   right: 52px;
    // }
    // .hidden {
    //   right: 42px;
    // }
  }
}
</style>
