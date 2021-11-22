<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="form" inline :model="query">
        <el-form-item label="项目名称" prop="projId">
          <el-select v-model="query.projId" placeholder="请选择" clearable>
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="action-bar">
        <el-button type="primary" @click="onClickSettingBtn">新增设置</el-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
      <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
      <el-table-column align="center" prop="projName" label="项目名称"></el-table-column>
      <el-table-column align="center" prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" prop="updateBy" label="操作人"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="120" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '删除', type: 'danger', onClick: () => handleDelete(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { projectApi, elderAppointmentApi } from '@/mod-kangyang/src/api';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'ProjectElderAppointmentSettingList',
    filters: {},
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        query: {
          projId: undefined,
        },
        allProjects: [],
      };
    },
    mounted() {
      this.getProjects();
    },
    methods: {
      onClickSettingBtn() {
        this.$router.push({
          name: 'project.elderAppointment.setting.form',
        });
      },
      getExportParams() {
        return {
          url: elderAppointmentApi.EXPORT_URL,
          data: this.getParams(),
          withFileName: true,
        };
      },

      getParams() {
        return this.query;
      },

      async handleFetch(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        const payload = {
          ...this.getParams(),
          pageNo,
          pageSize,
        };
        try {
          const { data, totalCount } = await elderAppointmentApi.getSettings(payload);
          return {
            list: addIdxToListItem(data, pageNo, pageSize),
            total: totalCount,
          };
        } catch (e) {
          return {
            list: [],
            totalCount: 0,
          };
        }
      },

      handleEdit(row) {
        this.$router.push({
          name: 'project.elderAppointment.setting.edit',
          params: {
            settingId: row.id,
          },
        });
      },

      handleDelete(row) {
        try {
          this.$confirm(`确认要删除吗？`, '', { type: 'warning' }).then(async () => {
            await elderAppointmentApi.removeSetting({
              id: row.id,
            });
            this.$refs.table.search();
          });
        } catch (err) {
          console.error(err);
        }
      },

      async getProjects() {
        const { data } = await projectApi.getSimpleList();
        this.allProjects = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  .action-bar {
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
  }
</style>
