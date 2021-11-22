<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="活动类型" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div style="display: flex; justify-content: flex-end; padding-right: 24px">
        <el-button type="primary" @click="handleAdd">新增活动类型</el-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="form" :fetch-handler="handleFetch" row-key="id">
      <el-table-column label="序号" prop="idx" width="100"></el-table-column>
      <el-table-column label="活动类型" prop="name"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '删除', type: 'danger', onClick: () => handleDelete(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>

    <el-dialog :visible.sync="formDialogVisible" :title="modalTitle" width="480px">
      <el-form ref="createOrEditForm" @submit.prevent.native="" :model="typeForm" inline label-suffix=":">
        <el-form-item label="活动类型名称" prop="name">
          <el-input v-model.trim="typeForm.name" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <div class="type-form-dialog__actions">
        <el-button plain @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSave()">确认</el-button>
      </div>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { activityApi } from '@/mod-kangyang/src/api';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
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
        form: {},
        formDialogVisible: false,
        typeForm: {},
        selectedRow: undefined,
      };
    },
    computed: {
      modalTitle() {
        const type = this.selectedRow ? '编辑' : '添加';
        return `${type}活动类型`;
      },
    },
    methods: {
      search() {
        this.$refs.table.search();
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { currentPage: pageNo, pageSize } = pagination;
        const payload = {
          ...this.form,
          pageNo,
          pageSize,
        };

        const { data: list, totalCount: total } = await activityApi.getTypes(payload);
        return { list: addIdxToListItem(list || [], pageNo, pageSize), total };
      },

      handleAdd() {
        this.selectedRow = undefined;
        this.typeForm = {};
        this.formDialogVisible = true;
      },

      handleEdit(row) {
        this.selectedRow = row;
        this.typeForm = {
          id: row.id,
          name: row.name,
        };
        this.formDialogVisible = true;
      },

      handleDelete(row) {
        try {
          this.$confirm(`确认要删除吗？`, '', { type: 'warning' })
            .then(async () => {
              await activityApi.removeType({
                id: row.id,
              });
              this.$message.success('删除成功');
              this.search();
            })
            .catch(f => {
              console.log(f);
            });
        } catch (err) {
          console.error(err);
        }
      },

      async onSave() {
        if (this.typeForm.id) {
          await activityApi.updateType(this.typeForm);
        } else {
          await activityApi.addType(this.typeForm);
        }
        this.search();
        this.formDialogVisible = false;
      },
    },
  };
</script>

<style scoped lang="less" rel="stylesheet/less">
  .type-form-dialog {
    &__actions {
      margin-top: 30px;
    }
  }
</style>
