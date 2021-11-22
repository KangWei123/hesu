<template>
  <list-page-layout>
    <fat-table ref="table" :fetch-handler="handleFetch" row-key="code">
      <el-table-column label="序号" prop="idx"></el-table-column>
      <el-table-column label="活动标题" prop="name"></el-table-column>
      <el-table-column label="活动ID" prop="code"></el-table-column>
      <el-table-column label="活动范围" prop="prjScopeName"></el-table-column>
      <el-table-column label="活动时间" prop="updateTime">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime || '-' }} 至 {{ scope.row.endTime || '-' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => onClickEdit(scope.row) },
            { name: '删除', type: 'danger', onClick: () => onClickDelete(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { activityApi } from '@/mod-kangyang/src/api/activity';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'KyActivityDraftList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
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

        const { data: list, totalCount: total } = await activityApi.queryDraftList(payload);
        return {
          list: addIdxToListItem(
            list.map(item => {
              return {
                ...item.activityDTO,
              };
            }),
            pageNo,
            pageSize
          ),
          total,
        };
      },

      onClickEdit(row) {
        console.log(row.code);
        this.$router.push({ name: 'ky-activity.edit', params: { code: row.code }, query: { draft: 'yes' } });
      },

      onClickDelete(row) {
        try {
          this.$confirm('确认要删除吗？', '', { type: 'warning' })
            .then(async () => {
              await activityApi.removeDraft({
                activityCode: row.code,
              });
              this.$message.success('删除成功');
              setTimeout(() => {
                this.search();
              }, 1500);
            })
            .catch(f => {
              console.log(f);
            });
        } catch (err) {
          console.error(err);
        }
      },
    },
  };
</script>
