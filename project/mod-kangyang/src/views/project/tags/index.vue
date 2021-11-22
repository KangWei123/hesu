<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-form ref="query" @submit.prevent.native="search()" :model="queryForm" inline>
        <el-form-item label="标签名字" prop="name">
          <el-input v-model.trim="queryForm.name" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="标签分类" prop="typeId" placeholder="请选择">
          <el-select v-model="queryForm.typeId" clearable>
            <el-option
              v-for="tagType of tagTypes"
              :key="tagType.id"
              :label="tagType.typeName"
              :value="tagType.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div style="display: flex; justify-content: flex-end; padding-right: 24px">
        <el-button plain type="primary" @click="onClickTagCategoryBtn">标签分类</el-button>
        <el-button type="primary" @click="handleAdd">新增标签</el-button>
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="queryForm" row-key="id">
      <el-table-column label="序号" prop="idx"></el-table-column>
      <el-table-column label="标签名称" prop="tagName"></el-table-column>
      <el-table-column label="标签分类" prop="typeName"></el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '删除', type: 'danger', onClick: () => handleDelete(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>

    <el-dialog :visible.sync="formDialogVisible" title="新增标签" width="480px">
      <el-form ref="createOrEditForm" @submit.prevent.native="" :model="tagForm" inline label-suffix=":">
        <el-form-item label="标签分类" prop="category">
          <el-select v-model="tagForm.typeId">
            <el-option
              v-for="tagType of tagTypes"
              :key="tagType.id"
              :label="tagType.typeName"
              :value="tagType.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model.trim="tagForm.tagName" placeholder="请输入" />
        </el-form-item>
      </el-form>

      <div class="type-form-dialog__actions">
        <el-button plain @click="formDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="processing" @click="onSave()">确认</el-button>
      </div>
    </el-dialog>

    <tag-types-dialog ref="tagTypesDialog"></tag-types-dialog>
  </list-page-layout>
</template>

<script>
  import { projectApi } from '@/mod-kangyang/src/api/project';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import TagTypesDialog from './components/tag-types-dialog';
  import utils from '@/dss-common/utils/date';
  import { FORMAT } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'ProjectTags',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      TagTypesDialog,
    },
    data() {
      return {
        queryForm: {
          name: undefined,
          typeId: undefined,
        },
        tagTypes: [],
        formDialogVisible: false,
        tagForm: {},
        processing: false,
        selectedRow: undefined,
      };
    },
    mounted() {
      this.getTagTypes();
    },
    methods: {
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), FORMAT, 8);
      },
      onClickTagCategoryBtn() {
        this.$refs.tagTypesDialog.open();
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

        const { data: list, totalCount: total } = await projectApi.getTags(payload);
        return { list: addIdxToListItem(list, currentPage, pageSize), total };
      },

      handleAdd() {
        this.formDialogVisible = true;
      },

      handleEdit(row) {
        this.selectedRow = row;
        this.tagForm = {
          tagName: row.tagName,
          id: row.id,
          typeId: row.typeId,
        };
        this.formDialogVisible = true;
      },

      handleDelete(row) {
        try {
          this.$confirm('确认要删除吗？', '', { type: 'warning' }).then(async () => {
            await projectApi.deleteTag({
              id: row.id,
            });
            this.$message.success('删除成功');
            setTimeout(() => {
              this.search();
            }, 1500);
          });
        } catch (err) {
          console.error(err);
        }
      },

      async getTagTypes() {
        const { data } = await projectApi.getTagTypes();
        this.tagTypes = data;
      },

      async onSave() {
        this.processing = true;
        try {
          if (this.tagForm.id > 0) {
            await projectApi.updateTag(this.tagForm);
          } else {
            await projectApi.addTag(this.tagForm);
          }
          this.tagForm = {};
          this.search();
          this.formDialogVisible = false;
        } catch (err) {}

        this.processing = false;
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
