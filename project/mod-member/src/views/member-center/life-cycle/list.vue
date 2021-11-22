<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="handleRecover" v-loading="recovering">恢复默认设置</el-button>
      <el-button type="primary" @click="onToAdd">+ 新增阶段</el-button>
    </template>
    <fat-table
      ref="table"
      class="wkb-table-border"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      row-key="id"
    >
      <el-table-column label="客户阶段" prop="name"></el-table-column>
      <el-table-column label="判定方式" v-slot="{ row }">{{ LifeCycleDetectTypeName[row.type] }}</el-table-column>
      <el-table-column label="阶段描述" prop="desc"></el-table-column>
      <el-table-column label="人数" prop="amount"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.status"
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-color="#52C41A"
            inactive-color="#B1B5BD"
          />
          {{ scope.row.status ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', link: { path: '/member-center/life-cycle/edit', query: { id: scope.row.id } } },
            {
              name: '删除',
              onClick: () => {
                $refs.table.remove(scope.row.id);
              },
            },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import api from '@/mod-member/src/api/memberAPI';
  import { LifeCycleDetectTypeName } from '@/mod-member/src/enum';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    components: { ListPageLayout, FatTable, TableActions },
    data() {
      return {
        LifeCycleDetectTypeName,
        recoverable: false,
        recovering: false,
      };
    },
    methods: {
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.lifeCycle.list(payload);

        if (!totalCount) {
          this.recoverable = true;
        }

        return {
          list: data,
          total: totalCount,
        };
      },
      async handleRemove(ids) {
        return api.lifeCycle.remove(ids[0]);
      },
      async handleRecover() {
        try {
          try {
            await this.$confirm('确定恢复默认设置', '提示');
          } catch (err) {
            return;
          }
          this.recovering = true;
          await api.lifeCycle.recovery();
          await this.$refs.table.search();
        } finally {
          this.recovering = false;
        }
      },
      async handleStatusChange(row) {
        const params = { ...row };
        params.status = Number(!params.status);
        await api.lifeCycle.update(params);
        row.status = params.status;
        this.$refs.table.refresh();
      },
      onToAdd() {
        this.$router.push('/member-center/life-cycle/edit');
      },
    },
  };
</script>
