<template>
  <list-page-layout>
    <template #sub-actions>
      <div class="actions">
        <router-link :to="{ name: 'project.houseTypes.create', query: { id: prjId } }">
          <el-button type="primary">新增户型</el-button>
        </router-link>
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="onFetch">
      <el-table-column label="序号" prop="idx"></el-table-column>
      <el-table-column label="户型名称" prop="layoutName"></el-table-column>
      <el-table-column label="建筑面积" prop="layoutArea"></el-table-column>
      <el-table-column label="参考价格" prop="refPrice"></el-table-column>
      <el-table-column label="最后更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy" width="140px"></el-table-column>
      <el-table-column label="操作" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '删除', type: 'danger', onClick: () => handleRemove(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { projectApi } from '@/mod-kangyang/src/api/project';
  import utils from '@/dss-common/utils/date';
  import { FORMAT } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'HouseTypes',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
    },
    computed: {
      prjId() {
        return this.$route.query.id;
      },
    },
    methods: {
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), FORMAT, 8);
      },
      async onFetch(params) {
        const { currentPage, pageSize } = params.pagination;
        const payload = {
          prjId: parseInt(this.prjId),
          pageSize,
          pageNo: currentPage,
        };
        const { data, totalCount } = await projectApi.getHouseTypes(payload);
        return {
          list: addIdxToListItem(data, currentPage, pageSize),
          total: totalCount,
        };
      },
      handleEdit(row) {
        this.$router.push({ name: 'project.houseTypes.edit', params: { id: row.id }, query: { id: row.prjId } });
      },
      async handleRemove(item) {
        try {
          await this.$confirm('确定删除', '提示', { type: 'warning' });
        } catch (ignore) {
          return;
        }

        const { id } = item;
        await projectApi.removeHouseType({ id: id });
        this.$refs.table.search();
        this.$message.success('已删除');
      },
    },
  };
</script>

<style lang="less" scoped>
  .actions {
    display: flex;
    justify-content: flex-end;
    padding: 0 24px;
  }
</style>
