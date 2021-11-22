<template>
  <list-page-layout>
    <fat-table ref="table" :fetch-handler="handleFetch" row-key="code">
      <el-table-column label="序号" prop="idx"></el-table-column>
      <el-table-column label="活动标题" prop="name"></el-table-column>
      <el-table-column label="活动ID" prop="code"></el-table-column>
      <el-table-column label="活动范围" prop="prjScopeName"></el-table-column>
      <el-table-column label="活动时间">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime }} 至 {{ scope.row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { activityApi } from '@/mod-kangyang/src/api/activity';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'KyActivityTrashList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    methods: {
      async handleFetch(params) {
        const { pagination } = params;
        const { currentPage: pageNo, pageSize } = pagination;
        const payload = {
          pageNo,
          pageSize,
          isDeleted: true,
        };

        const { data: list, totalCount: total } = await activityApi.queryList(payload);
        return { list: addIdxToListItem(list, pageNo, pageSize), total };
      },
    },
  };
</script>
