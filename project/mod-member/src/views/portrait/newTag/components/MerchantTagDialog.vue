<template>
  <el-dialog :before-close="onBeforeClose" :visible.sync="dialogVisible" title="商家印象标签分类" width="40%">
    <!-- 创建新标签按钮 -->
    <div class="append-new-tag">
      <el-button :disabled="isDoing || initing" @click="onAddTag" type="text">新增分类</el-button>
    </div>
    <!-- 新增分类 -->
    <el-table :data="tableData" v-loading="initing">
      <el-table-column label="分类名称" min-width="100" prop="name">
        <template slot-scope="scope">
          <!-- 创建新标签 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-input placeholder="10字以内" v-model="editing.value"></el-input>
          </template>
          <template v-else>{{ scope.row.name }}</template>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="60">
        <template slot-scope="scope">
          <!-- 创建新标签和编辑的操作 -->
          <!-- 编辑状态 -->
          <template v-if="editing.isEditing && scope.row.id === editing.index">
            <el-button :disabled="!editing.value.length" @click="onConfirm(scope)" type="text">保存</el-button>
            <el-button @click="onCancel(scope)" type="text">取消</el-button>
          </template>
          <!-- 普通状态 -->
          <template v-else>
            <el-button :disabled="isDoing" @click="onEdit(scope)" type="text">编辑</el-button>
            <el-button
              :class="{ 'not-allowed-link': !scope.row.canDelete }"
              :disabled="isDoing || isRemoving"
              @click="onDelete(scope)"
              type="text"
              >删除</el-button
            >
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page.index"
      :page-size="page.size"
      :total="page.total"
      @current-change="onChangePage"
      layout="prev, pager, jumper, next"
    ></el-pagination>
  </el-dialog>
</template>

<script>
  import api from '@/mod-member/src/api/new-dmp';

  export default {
    name: 'MerchantTagDialog',
    watch: {
      value: {
        immediate: true,
        handler(val) {
          console.log(val);
          this.dialogVisible = val;
        },
      },
      dialogVisible(newVal) {
        this.$emit('input', newVal);
      },
    },
    props: {
      value: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    computed: {
      isDoing() {
        return this.editing.isEditing || this.isAdding;
      },
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        // 编辑状态
        editing: {
          index: '',
          value: '',
          isEditing: false,
        },
        // 创建新的分类
        isAdding: false,
        loading: false,
        initing: false,
        // 删除分类
        isRemoving: false,
        // 分页
        page: {
          index: 1,
          total: 0, // 总条目
          size: 10,
        },
      };
    },
    methods: {
      // 接口适配器
      tableDataAdapter(data) {
        return data.map(item => {
          item.canDelete = !item.defaultCategory && !item.childCount;
          return item;
        });
      },
      // 获取 tableData 数据
      fetchData() {
        this.initing = true;
        this.tableData = [];
        api
          .getCategoriesPigination({
            pageNo: this.page.index,
            pageSize: this.page.size,
          })
          .then(d => {
            this.tableData = this.tableDataAdapter(d.data);
            this.page.total = d.totalCount;
          })
          .catch(e => {
            this.$message.error(e.errorMessage);
          })
          .finally(e => {
            this.initing = false;
          });
      },
      // 操作管理分类
      onConfirm(scope) {
        // verify
        if (!new RegExp(/^[_\-0-9A-Za-z\u4e00-\u9fa5]+$/i).test(this.editing.value)) {
          this.$message.error('标签分类名称支持字母、数字、汉字、-、或 _');
          return;
        }
        if (!this.editing.value.length || this.editing.value.length > 10) {
          this.$message.error('请填写正确的分类名称，长度不要超过 10 个字符');
          return;
        }
        // submit
        this.tableData.filter(item => item.id === this.editing.index)[0].name = this.editing.value;
        this.editing.index = '';
        this.editing.value = '';
        const _obj = { name: scope.row.name };
        // 新增或修改 修改需要传递 id
        !scope.row.newTag && (_obj.id = scope.row.id);

        api
          .addCategory(_obj)
          .then(d => {
            this.$message.success('新增标签分类成功');
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
        console.log(scope, '-->');
        this.editing.index = scope.row.id;
        this.editing.value = this.tableData.filter(item => item.id === scope.row.id)[0].name;
        this.editing.isEditing = true;
      },
      onDelete(scope) {
        if (scope.row.defaultCategory) {
          this.$message.info('默认分类不可删除');
          return;
        }
        if (!scope.row.canDelete) {
          this.$message.info('该分类下含有标签，无法删除该分类');
          return;
        }

        this.$confirm('确认删除吗？', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.isRemoving = true;
          api
            .deleteCategoryById({ categoryId: scope.row.id })
            .then(d => {
              this.$message.success('删除标签分类成功');
              this.fetchData();
            })
            .catch(e => {
              this.$message.error(e.errorMessage);
            })
            .finally(e => {
              this.isRemoving = false;
            });
        });
      },
      onAddTag() {
        this.isAdding = true;
        // let lastId = (this.tableData[this.tableData.length - 1] || {}).id || -1
        // let newId = lastId + 1
        const newId = 'new';
        this.tableData.push({
          id: newId,
          name: '',
          canDelete: true,
          newTag: true,
        }); // newTag 识别为新增 tag
        this.onEdit({ row: { id: newId } });
      },
      // 表单按钮
      onCancel(scope) {
        if (!scope.row.name.length) {
          const index = scope.$index;
          this.tableData.splice(index, 1);
        }
        this.editing.isEditing = false;
        this.isAdding = false;
      },
      // 切换页面
      onChangePage(e) {
        this.page.index = e;
        this.fetchData();
      },
      // 关闭弹窗触发更新
      onBeforeClose(done) {
        this.$emit('change');
        done();
      },
    },
    mounted() {
      this.fetchData();
    },
  };
</script>

<style lang="less" scoped>
  .append-new-tag {
    text-align: right;
    padding-right: 10px;
    /deep/ & > .el-button {
      display: inline-block;
    }
  }
  /deep/ .not-allowed-link span {
    cursor: not-allowed;
    color: #ccc;
    position: relative;
  }
</style>
