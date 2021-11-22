<template>
  <el-dialog class="manage-warpper" @close="onClose" :visible.sync="dialogVisible" title="画册分类管理" width="560px">
    <span class="note">默认分类、有画册的分类暂不支持删除</span>
    <!-- 创建分组按钮 -->
    <div class="append-new-tag">
      <el-button :disabled="isDoing || initing" @click="onAddTag" type="text">+新增分类</el-button>
    </div>
    <!-- 新增分组 -->
    <el-table :data="tableData" v-loading="initing" class="dialog-table">
      <el-table-column label="分类名称" min-width="100" prop="categoryName">
        <template slot-scope="scope">
          <!-- 创建新标签 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-input maxlength="10" placeholder="10字以内" v-model.trim="editing.value"></el-input>
            <div class="error-tip" v-if="errMsg" style="color: red">{{errMsg}}</div>
          </template>
          <template v-else>{{ scope.row.categoryName }}</template>
        </template>
      </el-table-column>
      <el-table-column align="left" label="操作" min-width="100">
        <template slot-scope="scope">
          <!-- 创建新标签和编辑的操作 -->
          <!-- 编辑状态 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-button
              :disabled="!(editing.value && editing.value.length)"
              @click="onConfirm(scope)"
              type="text"
            >保存</el-button>
            <el-button @click="onCancel(scope)" type="text">取消</el-button>
          </template>
          <!-- 普通状态 -->
          <template v-else>
            <el-button v-if='scope.row.defaultCategory==1' disabled @click="onEdit(scope)" type="text">编辑</el-button>
            <el-button v-else :disabled="isDoing" @click="onEdit(scope)" type="text">编辑</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :disabled="scope.row.defaultCategory == 0 ? true : false"
              content="该分组下存在标签"
              placement="top"
            >
            <!-- 默认分组不允许删除 -->
              <el-button
                v-if="scope.row.defaultCategory!=1"
                :class="{ 'not-allowed-link': !scope.row.canDelete || isDoing || !!scope.row.categoryCount }"
                @click="onDelete(scope)"
                type="text"
              >删除</el-button>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <span slot="footer" class="dialog-footer">
      <el-pagination
        :current-page="page.pageNo"
        :page-size="page.pageSize"
        :total="page.totalCount"
        @current-change="onChangePage"
        layout="prev, pager, jumper, next, total"
      ></el-pagination>
    </span>
  </el-dialog>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/material-pdf';

export default {
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(newVal) {
      this.$emit('input', newVal);
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  computed: {
    isDoing() {
      return this.editing.isEditing || this.isAdding;
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      editing: {
        //正在编辑、删除的分组
        index: '',
        value: '',
        // 编辑状态
        isEditing: false
      },
      errMsg: '',
      // 创建新的分组
      isAdding: false,
      initing: false,
      // 分页
      page: {
        pageNo: 1,
        pageSize: 6,
        totalCount: 0
      }
    };
  },
  methods: {
    tableDataAdapter(data) {
      return data.map(item => {
        //分组下不存在标签可删除
        item.canDelete = item.defaultCategory == 0 ? true : false;
        return item;
      });
    },
    fetchData() {
      this.initing = true;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      };
      api
        .getEbooksGroupList(params)
        .then(res => {
          this.tableData = this.tableDataAdapter(res.data);
          this.page.totalCount = res.totalCount;
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(e => {
          this.initing = false;
        });
    },
    // 操作分组
    async onConfirm(scope) {
      // 检查重名
      let checkResult = await api.checkEbooksGroupName({ Name: this.editing.value });
      if (checkResult.data) {
        this.errMsg = '分组名和已有分组名重复，请重新输入！';
        return false;
      } else {
        this.errMsg = '';
      }
      this.tableData.filter(item => item.id === this.editing.index)[0].categoryName = this.editing.value;
      this.editing.index = '';
      this.editing.value = '';
      let _obj = {
        categoryName: scope.row.categoryName,
        id: scope.row.id
      };
      if (scope.row.newTag) {
        api
          .addEbooksGroupList(_obj)
          .then(d => {
            this.$message.success('新增分组成功');
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(e => {
            this.fetchData();
            this.editing.isEditing = false;
            this.isAdding = false;
          });
      } else {
        _obj.id = scope.row.id;
        api
          .modifyEbooksGroup(_obj)
          .then(d => {
            this.$message.success('分组修改成功');
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(e => {
            this.fetchData();
            this.editing.isEditing = false;
            this.isAdding = false;
          });
      }
    },
    onEdit(scope) {
      this.errMsg = '';
      this.editing.index = scope.row.id;
      this.editing.value = this.tableData.filter(item => item.id === scope.row.id)[0].categoryName;
      this.editing.isEditing = true;
    },
    onDelete(scope) {
      if (this.isDoing || !!scope.row.categoryCount) {
        return;
      }
      if (!scope.row.canDelete) {
        this.$message.info('该分组下有素材，无法删除');
        return;
      }
      this.initing = true;
      api
        .deleteEbooksGroupById({ id: scope.row.id })
        .then(d => {
          this.$message.success('删除分组成功');
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(() => {
          //如果删除分页最后一条，跳去前一页
          if (this.tableData.length <= 1 && this.page.pageNo > 1) {
            this.page.pageNo = this.page.pageNo - 1;
          }
          this.fetchData();
        });
    },
    onAddTag() {
      this.isAdding = true;
      let newId = '';
      this.tableData.unshift({
        id: newId,
        categoryName: '',
        canDelete: true,
        newTag: true
      });
      this.onEdit({ row: { id: newId } });
    },
    // 表单按钮
    onCancel(scope) {
      if (!(scope.row.categoryName && scope.row.categoryName.length)) {
        let index = scope.$index;
        this.tableData.splice(index, 1);
      }
      this.editing.isEditing = false;
      this.isAdding = false;
    },
    // 切换页面
    onChangePage(e) {
      this.page.pageNo = e;
      this.fetchData();
    },
    // 关闭弹窗
    onClose() {
      this.dialogVisible = false;
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="less" scope>
.manage-warpper{
  /deep/ .input__inner{
    width: 40% !important;
  }
  .error-tip {
    position: absolute;
  }
  .append-new-tag {
    text-align: right;
    padding-right: 10px;
    /deep/ & > .el-button {
      display: inline-block;
    }
  }
  .not-allowed-link {
    background: none;
    border: none;
  }

  /deep/ .not-allowed-link span {
    cursor: not-allowed;
    color: #ccc;
    position: relative;
  }
  .dialog-table {
    max-height: 600px;
  }
  .dialog-table::before {
    height: 0px;
  }
  .note {
    position: absolute;
    left: 20px;
    top: 57px;
    font-size: 13px;
    color: #b3b2b2;
  }
}

</style>
