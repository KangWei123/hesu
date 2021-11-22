<template>
  <el-dialog @close="onClose" :visible.sync="dialogVisible" title="标签分类管理" width="40%">
    <!-- 创建分类按钮 -->
    <div class="append-new-tag">
      <el-button :disabled="isDoing || initing" @click="onAddTag" type="text">新增分类</el-button>
    </div>
    <!-- 新增分类 -->
    <el-table :data="tableData" v-loading="initing" class="dialog-table">
      <el-table-column label="标签分类名称" min-width="100" prop="categoryName">
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
            <el-button :disabled="isDoing" @click="onEdit(scope)" type="text">编辑</el-button>
            <el-tooltip
              class="item"
              effect="dark"
              :disabled="scope.row.referNum == 0 ? true : false"
              content="该分类下存在标签"
              placement="top"
            >
              <el-button
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
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import api from '@/dss-wechat3rd/src/api/template.js';

export default {
  name: 'MerchantTagDialog',
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
        //正在编辑、删除的分类
        index: '',
        value: '',
        // 编辑状态
        isEditing: false
      },
      errMsg: '',
      // 创建新的分类
      isAdding: false,
      loading: false,
      initing: false,
      // 分页
      page: {
        pageNo: 1,
        pageSize: 6,
        totalCount: 0
      },
      mockData: []
    };
  },
  methods: {
    tableDataAdapter(data) {
      return data.map(item => {
        //分类下不存在标签可删除
        item.canDelete = item.referNum == 0 ? true : false;
        return item;
      });
    },
    // 获取 tableData 数据
    fetchData() {
      this.initing = true;
      const url = constants.Api.goods.label.cateList;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize
      };
      services
        .get(url, {
          params,
          action: '标签分类列表'
        })
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
    // 操作管理分类
    async onConfirm(scope) {
      this.tableData.filter(item => item.id === this.editing.index)[0].categoryName = this.editing.value;
      this.editing.index = '';
      this.editing.value = '';
      let _obj = {
        categoryName: scope.row.categoryName,
        id: scope.row.id
      };
      this.initing = true;
      api
        .addCategory(_obj)
        .then(d => {
          let tips = _obj.id ? '修改分类成功' : '新增分类成功';
          this.$message.success(tips);
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(e => {
          this.fetchData();
          this.editing.isEditing = false;
          this.isAdding = false;
        });
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
        this.$message.info('该分类下有标签，无法删除');
        return;
      }
      this.initing = true;
      api
        .deleteCategoryById({ id: scope.row.id })
        .then(d => {
          this.$message.success('删除分类成功');
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
        canDelete: true
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

<style lang="less" scoped>
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
</style>
