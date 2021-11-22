<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="项目名称" prop="name">
          <el-select v-model.trim="form.name" placeholder="请选择">
            <el-option
              v-for="project of projects"
              :key="project.id"
              :value="project.id"
              :label="project.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="评估时间查询" prop="date">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="actions">
        <el-button type="primary" @click="onClickSetting">评估设置</el-button>
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="项目名称" prop="name"></el-table-column>
      <el-table-column label="评估结果ID"></el-table-column>
      <el-table-column label="客户微信信息" prop="address"></el-table-column>
      <el-table-column label="客户手机号" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" prop="phone"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '复制', onClick: () => handleCopy(scope.row) },
            { name: '查看', onClick: () => handleView(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { projectApi } from '@/mod-kangyang/src/api';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'ProjectList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    data() {
      return {
        form: {},
        projects: [],
      };
    },
    methods: {
      async handleFetch(params) {
        const { pagination } = params;
        const payload = {
          ...this.form,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data: list, totalCount: total } = await projectApi.costAssessments(payload);
        return { list: list || [], total };
      },

      onClickSetting() {},

      handleCopy(row) {
        this.$router.push({ path: '/project/edit', query: { id: row.id } });
      },

      handleView(row) {
        this.$router.push({ path: '/project/edit', query: { id: row.id } });
      },
    },
  };
</script>

<style lang="less" scoped>
  .actions {
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  }
</style>
