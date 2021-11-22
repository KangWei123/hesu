<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" :model="form" inline>
        <el-form-item label="项目名称" prop="prjName">
          <el-input v-model.trim="form.prjName" placeholder="请输入项目名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="actions">
        <el-button plain type="primary" @click="onClickTypeMgrBtn">项目类型管理</el-button>
        <el-button plain type="primary" @click="onClickTagMgrBtn">标签管理</el-button>
        <!-- <el-button type="primary" @click="onClickCreateProjectBtn">新增项目</el-button> -->
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="序号" prop="idx" width="100"></el-table-column>
      <el-table-column label="项目名称" prop="prjName"></el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <div>{{ scope.row.lessPrice }}-{{ scope.row.maxPrice }}元/月/床</div>
        </template>
      </el-table-column>
      <el-table-column label="开业时间" prop="openDay"></el-table-column>
      <el-table-column label="上下架状态" prop="state">
        <template slot-scope="scope">
          {{ ShelfStatusName[scope.row.state] }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>
      <el-table-column label="操作" fixed="right" align="left" min-width="100" v-slot="scope">
        <table-actions
          class="projects-table-actions"
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '户型设置', onClick: () => onClickHouseType(scope.row) },
            { name: `${scope.row.state === 1 ? '下架' : '上架'}`, onClick: () => toggleState(scope.row) },
          ]"
        />
        <popover-qrcode path="sub-packages/kangyang-package/pages/project-detail/index" :query-id="scope.row.id">
          <el-button type="text" style="color: #2e8dff">二维码</el-button>
        </popover-qrcode>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { projectApi } from '@/mod-kangyang/src/api/project';
  import utils from '@/dss-common/utils/date';
  import { FORMAT, ShelfStatus, ShelfStatusName } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import PopoverQrcode from './components/popover-qrcode';

  export default {
    name: 'ProjectList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      PopoverQrcode,
    },
    data() {
      return {
        form: {},
        ShelfStatusName,
      };
    },
    methods: {
      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), FORMAT, 8);
      },
      onClickTypeMgrBtn() {
        this.$router.push({ name: 'project.types' });
      },
      onClickTagMgrBtn() {
        this.$router.push({ name: 'project.tags' });
      },
      onClickCreateProjectBtn() {
        this.$router.push({ name: 'project.create' });
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { currentPage, pageSize } = pagination;
        const payload = {
          ...this.form,
          pageNo: currentPage,
          pageSize,
        };

        const { data: list, totalCount: total } = await projectApi.queryList(payload);
        return { list: addIdxToListItem(list || [], currentPage, pageSize), total };
      },

      handleEdit(row) {
        this.$router.push({ name: 'project.edit', params: { id: row.id } });
      },

      onClickHouseType(row) {
        this.$router.push({ name: 'project.houseTypes.index', query: { id: row.id } });
      },

      handleConfig(row) {
        this.$router.push({ path: '/project/edit', query: { id: row.id } });
      },

      handleAdd() {
        this.$router.push({ path: '/project/edit' });
      },

      async toggleState(row) {
        if (row.state === ShelfStatus.On) {
          await projectApi.down({
            projectId: row.id,
          });
          row.state = ShelfStatus.Off;
          this.$message.success('下架成功');
        } else if (row.state === ShelfStatus.Off) {
          await projectApi.up({
            projectId: row.id,
          });
          row.state = ShelfStatus.On;
          this.$message.success('上架成功');
        }
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

  .projects-table-actions {
    display: inline-block;
    margin-right: 10px;
  }
</style>
