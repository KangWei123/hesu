<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-form ref="query" inline :model="queryForm" @submit.prevent.native="search()">
        <el-form-item label="项目类型" prop="typeName">
          <el-input v-model.trim="queryForm.typeName" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="actions">
        <el-button type="primary" @click="handleAdd">新增项目类型</el-button>
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="queryForm" row-key="id">
      <el-table-column label="序号" prop="idx" width="100"></el-table-column>
      <el-table-column label="项目类型" prop="typeName"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100">
        <template slot-scope="scope">
          <table-actions
            :options="[
              { name: '编辑', onClick: () => handleEdit(scope.row) },
              { name: '删除', type: 'danger', onClick: () => handleDelete(scope.row) },
            ]"
          />
        </template>
      </el-table-column>
    </fat-table>

    <el-dialog :visible.sync="formDialogVisible" :title="modalTitle" width="480px">
      <el-form ref="createOrEditForm" @submit.prevent.native="" :model="typeForm" inline label-suffix=":">
        <el-form-item label="项目类型名称" prop="typeName">
          <el-input v-model.trim="typeForm.typeName" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <div class="type-form-dialog__actions">
        <el-button plain @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">确认</el-button>
      </div>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { projectApi } from '@/mod-kangyang/src/api/project';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import utils from '@/dss-common/utils/date';
  import { FORMAT } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'ProjectTypes',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        queryForm: {
          typeName: '',
        },
        formDialogVisible: false,
        selectedRow: undefined,
        typeForm: {
          typeName: '',
        },
      };
    },
    computed: {
      modalTitle() {
        const type = this.selectedRow ? '编辑' : '添加';
        return `${type}项目类型`;
      },
    },
    methods: {
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), FORMAT, 8);
      },
      search() {
        this.$refs.table.search();
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { currentPage, pageSize } = pagination;
        const payload = {
          ...this.queryForm,
          pageNo: currentPage,
          pageSize: pageSize,
        };

        const { data: list, totalCount: total } = await projectApi.getTypes(payload);
        return { list: addIdxToListItem(list, currentPage, pageSize), total };
      },

      handleAdd() {
        this.selectedRow = undefined;
        this.formDialogVisible = true;
        this.typeForm = {
          typeName: '',
        };
      },

      handleEdit(row) {
        this.selectedRow = row;
        this.typeForm.typeName = row.typeName;
        this.typeForm.id = row.id;
        this.formDialogVisible = true;
      },

      handleDelete(row) {
        try {
          this.$confirm(`确认要删除吗？`, '', { type: 'warning' }).then(async () => {
            await projectApi.deleteProjectType({
              id: row.id,
            });
            this.search();
          });
        } catch (err) {
          console.error(err);
        }
      },

      async save() {
        if (this.selectedRow) {
          await projectApi.updateProjectType(this.typeForm);
          this.search();
          this.hideModal();
          return;
        }
        await projectApi.addProjectType(this.typeForm);
        this.search();
        this.hideModal();
      },

      hideModal() {
        this.selectedRow = undefined;
        this.formDialogVisible = false;
        this.typeForm = {
          typeName: '',
        };
      },
    },
  };
</script>

<style scoped lang="less">
  .actions {
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  }

  .type-form-dialog {
    &__actions {
      margin-top: 30px;
    }
  }
</style>
