<template>
  <el-dialog
    title="标签分类管理"
    custom-class="tag-types-dialog"
    :visible.sync="dialogVisible"
    width="400px"
    :append-to-body="true"
    :before-close="dialogBeforeClose"
    :close-on-click-modal="false"
  >
    <list-page-layout>
      <template #sub-actions>
        <div class="actions">
          <el-button size="small" type="primary" @click="onClickAdd">新增分类</el-button>
        </div>
      </template>

      <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="queryForm" row-key="id">
        <el-table-column prop="typeName" align="center" label="标签分类名称">
          <template slot-scope="scope">
            <el-input
              v-if="editingIndex === scope.$index || scope.row.id === 0"
              v-model="scope.row.typeName"
              placeholder="请输入"
            ></el-input>
            <span v-else>{{ scope.row.typeName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" v-slot="scope">
          <el-link
            v-if="editingIndex === scope.$index || scope.row.id === 0"
            class="link-edit"
            :underline="false"
            @click="onSave(scope.row)"
          >
            保存
          </el-link>
          <el-link v-else class="link-edit" :underline="false" @click="onClickEdit(scope.$index)">编辑</el-link>
          <el-link type="danger" :underline="false" @click="onClickDelete(scope.$index, scope.row)">删除</el-link>
        </el-table-column>
      </fat-table>
    </list-page-layout>
  </el-dialog>
</template>

<script>
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import { projectApi } from '@/mod-kangyang/src/api';

  export default {
    name: 'TagTypesDialog',
    components: {
      ListPageLayout,
      FatTable,
    },
    data() {
      return {
        dialogVisible: false,
        queryForm: {
          name: null,
        },
        editingIndex: -1,
        editingFrom: {},
      };
    },
    watch: {},
    methods: {
      open() {
        this.dialogVisible = true;
      },
      search() {
        this.$refs.table.search();
      },
      onClickAdd() {
        const table = this.$refs.table;
        table.list.push({
          id: 0,
          status: 'up',
        });
        table.pagination = Object.assign({}, table.list.pagination, { total: table.list.length });
      },
      onClickEdit(index) {
        this.editingIndex = index;
      },
      async onSave(row) {
        if (row.id > 0) {
          await projectApi.updateTagType({
            id: row.id,
            typeName: row.typeName,
          });
        } else {
          await projectApi.addTagType({
            typeName: row.typeName,
          });
        }
        this.editingIndex = -1;
        this.search();
      },
      async onClickDelete(index, row) {
        if (row.id > 0) {
          try {
            this.$confirm('确认要删除吗？', '', { type: 'warning' }).then(async () => {
              await projectApi.deleteTagType({
                id: row.id,
              });
              this.$message.success('删除成功');
              setTimeout(() => {
                this.removeRow(index);
              }, 1500);

              this.search();
            });
          } catch (err) {}
        } else {
          this.removeRow(index);
        }
      },

      removeRow(index) {
        const table = this.$refs.table;
        table.list.splice(index, 1);
        table.pagination = Object.assign({}, table.list.pagination, { total: table.list.length });
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { data, totalCount } = await projectApi.getTagTypes({
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        });
        return {
          list: data,
          total: totalCount,
        };
      },
      confirm() {
        this.dialogVisible = false;
        this.$emit('confirm');
      },
      cancel() {
        this.dialogVisible = false;
        this.$emit('cancel');
      },
      dialogBeforeClose() {
        this.cancel();
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .tag-types-dialog .el-dialog__body {
    padding: 0;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    padding: 0 24px;
  }

  .link-edit {
    color: #2e8dff;
  }
</style>
