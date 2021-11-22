<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-radio-group
        v-model="query.approveStatus"
        class="condition__radios ky-radios-tabs"
        size="medium"
        @change="handleStatusChange"
      >
        <el-radio-button v-for="item in StatusList" :key="item.value" :label="item.value">{{
          item.label
        }}</el-radio-button>
      </el-radio-group>

      <el-form inline @submit.native.prevent="$refs.table.search()">
        <el-form-item label="项目">
          <department-select v-model="query.orgId" clearable />
        </el-form-item>

        <el-form-item label="认证时间">
          <el-date-picker
            v-model="query.datetime"
            type="datetimerange"
            style="width: 380px"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :default-time="['00:00:00', '23:59:59']"
            clearable
          />
        </el-form-item>

        <el-form-item label=" " label-width="12px">
          <el-button native-type="submit" type="primary">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch">
      <el-table-column label="项目" prop="orgName" min-width="160px" />
      <el-table-column label="邀请人" min-width="120px">
        <template slot-scope="scope">
          <p>{{ scope.row.invitorName }}</p>
          <p>{{ scope.row.invitorPhone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="被邀请人" min-width="120px">
        <template slot-scope="scope">
          <p>{{ scope.row.kinsfolkName }}</p>
          <p>{{ scope.row.phone }}</p>
        </template>
      </el-table-column>
      <el-table-column label="长者姓名" prop="elderName" />
      <el-table-column label="证件类型" prop="cardTypeName" />
      <el-table-column label="证件号" prop="cardNo" min-width="170px" />
      <el-table-column label="与长者关系" prop="relationName" min-width="100px" />
      <el-table-column label="邀请时间" prop="createTime" min-width="150px" />
      <el-table-column label="认证时间" prop="authTime" min-width="150px" />
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.refuseReason" effect="dark" :content="scope.row.refuseReason" placement="top">
            <p>{{ verifyStatusName[scope.row.approveStatus] }}</p>
          </el-tooltip>
          <p v-else>{{ verifyStatusName[scope.row.approveStatus] }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-link v-if="scope.row.approveStatus === Status.WAITING" type="primary" @click="verify(scope.row.id)"
            >审核</el-link
          >
        </template>
      </el-table-column>
    </fat-table>

    <ver-dialog :id="checkedId" v-model="dialogVisible" @refresh="$refs.table.fetch()" />
  </list-page-layout>
</template>

<script>
  import { DepartmentSelect } from '@/mod-kangyang/shared/components';
  import { relativeVerifyApi } from '@/mod-kangyang/src/api';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import verDialog from './components/dialog';

  const Status = {
    WAITING: 0, // 未审核
    SUCCESS: 1, // 已审核
    REFUSE: 2, // 已拒绝
  };
  const StatusName = {
    [Status.WAITING]: '未审核',
    [Status.SUCCESS]: '已审核',
    [Status.REFUSE]: '已拒绝',
  };
  const StatusList = [
    { label: '全部', value: '' },
    { label: StatusName[Status.WAITING], value: Status.WAITING },
    { label: StatusName[Status.SUCCESS], value: Status.SUCCESS },
    { label: StatusName[Status.REFUSE], value: Status.REFUSE },
  ];

  export default {
    name: 'RelativeVerifyList',
    components: {
      ListPageLayout,
      TableActions,
      FatTable,
      verDialog,
      DepartmentSelect,
    },
    data() {
      return {
        Status,
        StatusList,
        query: {
          orgId: null,
          datetime: null,
          approveStatus: '',
        },
        verifyStatusName: {
          [Status.WAITING]: '未审核',
          [Status.SUCCESS]: '已通过',
          [Status.REFUSE]: '未通过',
        },
        dialogVisible: false,
        checkedId: 0, // 选择审批的 id
      };
    },
    methods: {
      async handleStatusChange() {
        await this.$nextTick();
        this.$refs.table.fetch();
      },
      verify(id) {
        this.checkedId = id;
        this.dialogVisible = true;
      },
      getParams() {
        const { datetime, ...other } = this.query;
        const [startTime, endTime] = datetime || [];
        return {
          ...other,
          startTime,
          endTime,
        };
      },
      async handleFetch({ pagination: { currentPage: pageNo, pageSize } }) {
        const payload = {
          ...this.getParams(),
          pageNo,
          pageSize,
        };

        const { data, totalCount } = await relativeVerifyApi.queryList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>

<style lang="less">
  .ky-radios-tabs {
    margin: -24px;
    margin-bottom: 30px;
    display: block;
    height: 64px;
    border-bottom: 1px solid #ececec;
    padding-left: 32px;

    .el-radio-button {
      height: 100%;
      position: relative;
      vertical-align: middle;
    }

    .el-radio-button__inner {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #717378;
      background: none !important;
      border: none !important;
      box-shadow: none !important;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      color: #fa7516;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      height: 4px;
      width: 100%;
      background-color: #fa7516;
    }
  }
</style>
