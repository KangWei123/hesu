<template>
  <el-dialog :visible.sync="dialogVisible"
             :title="title"
             width="550px"
             class="classify-manage"
             @close="onClose">
    <el-table :data="tableData"
              v-loading="initing">
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          <!-- 创建新标签 -->
          <template v-if="isEditing && scope.row.id === doing.id">
            <el-input maxlength="10"
                      placeholder="10字以内"
                      class="new-name"
                      v-model.trim="doing.value"
                      :ref="'input_' + scope.row.id"
                      :readonly="isLoading"
                      @input="onRename($event, scope)"></el-input>
            <div class="tips"
                 v-if="sameName">分类名和已有分类名重复,请重新输入！</div>
          </template>
          <template v-else>{{scope.row.categoryName}}</template>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 创建新标签和编辑的操作 -->
          <!-- 编辑状态 -->
          <template v-if="isEditing && scope.row.id === doing.id">
            <el-button type="text"
                       :disabled="!doing.value.length"
                       :loading="isLoading"
                       @click="onConfirm(scope)">确定</el-button>
            <el-button type="text"
                       :disabled="isLoading"
                       @click="onCancel(scope)">取消</el-button>
          </template>
          <!-- 普通状态 -->
          <template v-else>
            <el-button type="text"
                       :disabled="isEditing || isLoading"
                       @click="onEdit(scope)">编辑</el-button>
            <el-button type="text"
                       v-if="scope.row.canDelete"
                       :disabled="isEditing || (isLoading && scope.row.id !== doing.id)"
                       :loading="isLoading && scope.row.id === doing.id"
                       @click="onDelete(scope)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 提示 -->
    <span class="note">默认分类、有文章的分类暂不支持删除</span>
    <!-- 创建新分类按钮 -->
    <div class="append-new-tag">
      <el-button :disabled="initing || isEditing || isLoading"
                 @click="onAddTag"
                 type="text">+ 新增分类</el-button>
    </div>
    <!-- <el-pagination layout="prev, pager, next, jumper, total"
                   :total="page.totalCount"
                   v-if="page.totalCount"
                   :page-size="page.pageSize"
                   :page-sizes="[5, 10]"
                   :current-page="page.pageNo"
                   @current-change="onPageChange"
                   class="wkt-pagination pagination"></el-pagination> -->
    <el-pagination
          v-if="page.totalCount"
          :hide-on-single-page="true"
          @current-change="onPageChange"
          :page-size="page.pageSize"
          :page-sizes="[5, 10]"
          layout="sizes, prev, pager, next"
          :total="page.totalCount">
        </el-pagination>
  </el-dialog>
</template>

<script>
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
import { clearTimeout } from 'timers';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  mixins: [AdapterIfr.AdapterMixins],
  props: {
    title: {
      type: String,
      default: '分类管理'
    }
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      page: {
        totalCount: 0,
        pageNo: 1,
        pageSize: 10
      },
      doing: {
        // 正在编辑/正在删除的分类
        id: '',
        value: ''
      },
      isEditing: false, // 是否正在编辑
      isLoading: false, // 是否正在请求接口
      initing: false,
      timer: null,
      sameName: false
    };
  },
  watch: {
    dialogVisible(newVal, oldVal) {
      this.dialogVisible = newVal;
      this.adapterIfmMask(newVal);
    }
  },
  methods: {
    // 接口适配器
    tableDataAdapter(data) {
      return data.map(item => {
        item.canDelete = item.id !== 1 && !item.relatedArticleCount;
        return item;
      });
    },
    // 获取 tableData 数据
    fetchData() {
      this.initing = true;
      marketArticleApi
        .categoryList({
          deleteFlag: 'N',
          pageSize: this.page.pageSize,
          pageNo: this.page.pageNo
        })
        .then(d => {
          this.tableData = this.tableDataAdapter(d.data);
          this.initing = false;
          this.page.totalCount = d.totalCount;
        })
        .catch(e => {
          this.initing = false;
          this.$message.error(e.errorMessage);
        });
    },
    // 操作管理分类
    onAddTag() {
      this.tableData.push({
        id: '',
        name: '',
        canDelete: true
      });
      this.doing.id = '';
      this.doing.value = '';
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.input_.focus();
      });
    },
    onEdit(scope) {
      this.doing.id = scope.row.id;
      this.doing.value = this.tableData.filter(item => item.id === scope.row.id)[0].categoryName;
      this.sameName = false;
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs['input_' + this.doing.id].focus();
      });
    },
    onDelete(scope) {
      this.$confirm('是否确定删除该分类?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.isLoading = true;
          this.doing.id = scope.row.id;
          return marketArticleApi.deleteCategory({ id: scope.row.id });
        })
        .then(res => {
          this.$message.success('删除成功');
          // 删除改分页最后一条的情况，跳到前一页
          if (this.tableData.length === 1 && this.page.pageNo > 1) {
            this.page.pageNo = this.page.pageNo - 1;
          }
          this.fetchData();
        })
        .catch(() => {
          console.log('取消确认');
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    onConfirm(scope) {
      if (this.doing.id) {
        // 编辑
        const oldName = scope.row.categoryName;
        if (oldName === this.doing.value) {
          this.isEditing = false;
          return;
        }
        this.isLoading = true;
        marketArticleApi
          .updateCategory({
            id: this.doing.id,
            categoryName: this.doing.value
          })
          .then(res => {
            this.isEditing = false;
            scope.row.categoryName = this.doing.value;
            this.$message.success('编辑成功');
            this.fetchData();
          })
          .finally(() => {
            this.isLoading = false;
          });
      } else {
        // 添加
        this.isLoading = true;
        marketArticleApi
          .addCategory({
            categoryName: this.doing.value
          })
          .then(res => {
            this.isEditing = false;
            this.tableData.splice(this.tableData.length - 1, 1);
            this.$message.success('添加成功');
            this.fetchData();
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    },
    onCancel(scope) {
      if (!this.doing.id) {
        let index = scope.$index;
        this.tableData.splice(index, 1);
      }
      this.isEditing = false;
    },
    onRename(val, scope) {
      if (this.timer) {
        window.clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = window.setTimeout(() => {
        if (scope.row.categoryName === this.doing.value) {
          this.sameName = false;
          return;
        }
        marketArticleApi
          .checkName({
            categoryName: this.doing.value
          })
          .then(res => {
            this.sameName = res.data;
          });
      }, 300);
    },
    // 关闭弹窗
    onClose() {
      this.dialogVisible = false;
      this.$emit('closeClassDialog');
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },
    show() {
      this.isEditing = false;
      this.isLoading = false;
      this.initing = false;
      this.doing.id = '';
      this.doing.value = '';
      this.page.pageNo = 1;
      this.page.totalCount = 0;
      this.dialogVisible = true;
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style lang="less" scoped>
.classify-manage {
  .el-table {
    .el-button {
      padding: 0 14px 0 0;
    }
  }
  .append-new-tag {
    right: 9px;
    position: absolute;
    top: 50px;
    text-align: center;
  }
  .el-button.is-disabled {
    background: none;
    border: none;
    color: #c0c4cc;
  }
  .pagination {
    margin: 20px 0;
  }
  .new-name {
    /deep/.el-input__inner {
      width: 170px;
    }
  }
  .tips {
    padding-top: 10px;
    color: #f56c6c;
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
