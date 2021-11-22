<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <div class="filter-bar">
        <el-tabs class="tabs-status" v-model="form.activityStatus">
          <el-tab-pane label="全部" name="-1"></el-tab-pane>
          <el-tab-pane label="未开始" name="10"></el-tab-pane>
          <el-tab-pane label="进行中" name="20"></el-tab-pane>
          <el-tab-pane label="已结束" name="30"></el-tab-pane>
        </el-tabs>

        <div class="actions">
          <div class="action" @click="onClickDraft()">
            <img src="../../../images/icon/draft.png" class="action__icon" />
            <span class="action__label">草稿箱</span>
          </div>
          <div class="action" @click="onClickTrash()">
            <img src="../../../images/icon/trash.png" class="action__icon" />
            <span class="action__label">回收站</span>
          </div>
        </div>
      </div>

      <el-form ref="query" @submit.prevent.native="search()" :model="form" inline>
        <el-form-item label="活动名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="活动时间" prop="date">
          <el-date-picker
            v-model="form.date"
            type="daterange"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动范围">
          <el-select v-model="form.projectId" placeholder="请选择" clearable>
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="sub-actions">
        <el-button plain type="primary" @click="onClickTypeMgrBtn">活动类型管理</el-button>
        <el-button type="primary" @click="onClickCreateBtn">发布活动</el-button>
      </div>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="序号" width="100" prop="idx"></el-table-column>
      <el-table-column label="活动标题" prop="name"></el-table-column>
      <el-table-column label="活动范围" prop="prjScopeName"></el-table-column>
      <el-table-column label="已报名">
        <template slot-scope="scope"
          ><span class="ticket-count" @click="onClickView(scope.row)">
            {{ scope.row.ticketSignCount || 0 }}/{{ scope.row.ticketTotalCount || 0 }}
          </span></template
        >
      </el-table-column>
      <el-table-column label="活动时间">
        <template slot-scope="scope">
          <div>{{ scope.row.startTime }} 至 {{ scope.row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" prop="activityStatus">
        <template slot-scope="scope">
          {{ ActivityStatusName[scope.row.activityStatus] || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="上下架状态" prop="isShelf">
        <template slot-scope="scope">
          {{ scope.row.isShelf ? '上架' : '下架' }}
        </template>
      </el-table-column>
      <el-table-column label="是否取消" prop="isCancel">
        <template slot-scope="scope">
          {{ scope.row.isCancel ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="updateBy"></el-table-column>

      <el-table-column label="操作" align="left" fixed="right" width="210" v-slot="scope">
        <table-actions class="operation-more-actions" :options="generateActions(scope.row)" />
      </el-table-column>
    </fat-table>

    <ticket-selector
      v-if="selectedRow"
      :selected-activity="selectedRow"
      @cancel="selectedRow = null"
      @confirm="selectedRow = null"
    ></ticket-selector>
  </list-page-layout>
</template>

<script>
  import { activityApi } from '@/mod-kangyang/src/api/activity';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { DepartmentSelect } from '@/mod-kangyang/shared/components';
  import TicketSelector from '@/mod-kangyang/src/components/ticket-selector';
  import { ActivityStatusName } from '@/mod-kangyang/src/constants';
  import { projectApi } from '@/mod-kangyang/shared';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'KyActivityList',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      DepartmentSelect,
      TicketSelector,
    },
    data() {
      return {
        ActivityStatusName: ActivityStatusName,
        allProjects: [],
        form: {
          activityStatus: '-1',
        },
        selectedRow: null,
      };
    },
    async mounted() {
      const { data } = await projectApi.getSimpleList();
      this.allProjects = data;
    },
    methods: {
      generateActions(row) {
        let actions = [
          { name: '复制', onClick: () => this.onClickCopy(row) },
          { name: '编辑', onClick: () => this.onClickEdit(row) },
          { name: '查看', onClick: () => this.onClickInfoView(row) },
          { name: row.isShelf == 1 ? '下架' : '上架', onClick: () => this.toggleShelfStatus(row) },
          { name: '设置票种', onClick: () => this.onClickTicket(row) },
        ];
        if (!row.isCancel) {
          actions.push({ name: '取消', onClick: () => this.onCancel(row) });
        }

        actions.push({ name: '删除', type: 'danger', onClick: () => this.handleDelete(row) });
        actions = actions.map((item, index) => {
          if (index > 3) {
            item.style = {
              marginLeft: 0,
            };
          }
          return {
            ...item,
          };
        });
        return actions;
      },
      wrapCommand(type, row) {
        return {
          type,
          row,
        };
      },
      search() {
        this.$refs.table.search();
      },
      onClickTypeMgrBtn() {
        this.$router.push({ name: 'ky-activity.types' });
      },
      onClickCreateBtn() {
        this.$router.push({ name: 'ky-activity.create' });
      },
      onStatusChanged(tab) {
        this.form.activityStatus = tab.name;
        this.search();
      },
      onClickDraft() {
        this.$router.push({ name: 'ky-activity.draft' });
      },
      onClickTrash() {
        this.$router.push({ name: 'ky-activity.trash' });
      },
      onClickCopy(row) {
        try {
          this.$confirm(`确认要复制吗？`, '', { type: 'info' }).then(async () => {
            await activityApi.copyActivity({
              code: row.code,
            });
            this.search();
          });
        } catch (err) {
          console.error(err);
        }
      },
      onClickEdit(row) {
        this.$router.push({ name: 'ky-activity.edit', params: { code: row.code } });
      },
      toggleShelfStatus(row) {
        if (row.isShelf == 1) {
          this.onClickDown(row);
        } else {
          this.onClickUp(row);
        }
      },
      async onClickUp(row) {
        this.$confirm(`确认要上架吗？`, '', { type: 'warn' })
          .then(async () => {
            await activityApi.up({
              code: row.code,
            });
            row.isShelf = 1;
            this.$message.success('上架成功');
          })
          .catch(e => {
            console.warn('用户取消');
          });
      },
      async onClickDown(row) {
        this.$confirm(`确认要下架吗？`, '', { type: 'warn' })
          .then(async () => {
            await activityApi.down({
              code: row.code,
            });
            row.isShelf = 0;
            this.$message.success('下架成功');
          })
          .catch(e => {
            console.warn('用户取消');
          });
      },
      async onCancel(row) {
        this.$confirm(`确认要取消吗？`, '', { type: 'warn' })
          .then(async () => {
            await activityApi.cancel({
              code: row.code,
            });
            row.isCancel = 1;
            this.$message.success('取消成功');
          })
          .catch(e => {
            console.warn('用户取消');
          });
      },
      onClickTicket(row) {
        this.selectedRow = row;
      },
      onClickView(row) {
        this.$router.push({ name: 'ky-activity.detail', params: { code: row.code } });
      },
      onClickInfoView(row) {
        this.$router.push({ name: 'ky-activity.edit', params: { code: row.code }, query: { readOnly: 1 } });
      },
      async handleFetch(params) {
        const { pagination } = params;
        const { activityStatus, ...rest } = this.form;
        const { currentPage: pageNo, pageSize } = pagination;
        const payload = {
          ...rest,
          pageNo,
          pageSize,
        };
        if (activityStatus != '-1') {
          payload.activityStatus = +activityStatus;
        }

        const { data: list, totalCount: total } = await activityApi.queryList(payload);
        return {
          list: addIdxToListItem(list, pageNo, pageSize),
          total,
        };
      },

      handleDelete(row) {
        try {
          this.$confirm(`确认要删除吗？`, '', { type: 'warning' })
            .then(async () => {
              await activityApi.remove({
                code: row.code,
              });
              this.$message.success('删除成功');
              setTimeout(() => {
                this.search();
              }, 3000);
            })
            .catch(f => {
              console.log(f);
            });
        } catch (err) {
          console.error(err);
        }
      },

      handleAdd() {
        this.$router.push({ path: '/ky-activity/edit' });
      },
    },
  };
</script>

<style lang="less" scoped>
  .filter-bar {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f2f6fc;
    margin-bottom: 16px;
  }

  .tabs-status {
    /deep/ .el-tabs__header {
      margin-bottom: 0;
    }

    /deep/ .el-tabs__nav-wrap::after {
      display: none;
      background-color: red;
    }
  }

  .actions {
    display: flex;
    align-items: center;
    padding-right: 24px;
  }

  .sub-actions {
    display: flex;
    justify-content: flex-end;
    padding-right: 24px;
  }

  .action {
    display: flex;
    align-items: center;
    margin-left: 18px;
    cursor: pointer;

    &__icon {
      width: 14px;
      height: 14px;
      margin-right: 6px;
    }

    &__label {
      font-size: 14px;
      font-weight: 400;
      color: #303133;
    }
  }

  .ticket-count {
    font-size: 14px;
    color: #fa7516;
    cursor: pointer;
  }

  .el-link--primary {
    color: #2e8dff;
  }
</style>
