<template>
  <list-page-layout>
    <template #filters>
      <el-radio-group v-model="query.status" class="condition__radios ky-radios-tabs" size="medium">
        <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value">{{
          item.label
        }}</el-radio-button>
      </el-radio-group>

      <div class="condition__body">
        <el-form ref="form" inline :model="query" @submit.native.prevent="search">
          <el-form-item label="预约项目" prop="projId">
            <el-select v-model="query.projId" placeholder="请选择" clearable>
              <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="预约人电话" prop="userPhone">
            <el-input v-model="query.userPhone" placeholder="请输入" clearable></el-input>
          </el-form-item>

          <el-form-item label="参观日期">
            <el-date-picker
              v-model="query.visitDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item label="参观时间">
            <el-time-picker
              v-model="query.visitTime"
              is-range
              format="HH:mm"
              value-format="HH:mm"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            />
          </el-form-item>

          <el-form-item>
            <el-button @click="reset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>

    <template #sub-actions>
      <div class="action-bar">
        <el-button plain type="primary" @click="onClickSettingBtn">预约设置</el-button>
        <export-button type="primary" :params="getExportParams">导出</export-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
      <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
      <el-table-column align="center" prop="prjName" label="项目名称"></el-table-column>
      <el-table-column align="center" prop="appointPeopleName" label="预约人"></el-table-column>
      <el-table-column align="center" prop="appointPeoplePhone" label="预约人电话"></el-table-column>
      <el-table-column align="center" prop="visitPeopleName" label="参观人姓名"> </el-table-column>
      <el-table-column align="center" prop="visitPeoplePhone" label="联系方式"> </el-table-column>
      <el-table-column align="center" prop="visitPeopleNums" label="参观人数"></el-table-column>
      <el-table-column align="center" prop="visitDate" label="参观日期">
        <template #default="scope">
          <div :style="{ whiteSpace: 'no-wrap' }">{{ formatDate(scope.row.visitDate) }}</div>
          <div>{{ scope.row.beginTime }}-{{ scope.row.endTime }}</div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="status" label="预约状态">
        <template slot-scope="scope">
          <span :style="{ color: statusColor(scope.row.status) }">{{ statusName(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="![0, 1, 3].includes(query.status)"
        align="center"
        prop="cancelReason"
        label="取消原因"
      ></el-table-column>
      <el-table-column align="center" width="180" prop="createTime" label="创建时间"> </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { projectApi, projectAppointmentApi } from '@/mod-kangyang/src/api';
  import ExportButton from '@/dss-common/components/export-button/index';
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import { ALL_APPOINTMENT_STATUS } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';
  import utilsDate from '@/dss-common/utils/date';

  export default {
    name: 'ProjectAppointment',
    components: {
      FatTable,
      ExportButton,
      ListPageLayout,
    },
    data() {
      const defaultQuery = {
        status: '',
        projId: undefined,
        userPhone: undefined,
        visitDate: '',
        visitTime: '',
      };

      return {
        statusOptions: ALL_APPOINTMENT_STATUS,
        query: Object.assign({}, defaultQuery),
        allProjects: [],
      };
    },

    mounted() {
      this.getProjects();
    },
    methods: {
      formatDate(value) {
        return utilsDate.format(new Date(value), 'YYYY-MM-DD (周w)');
      },
      statusName(status) {
        const target = ALL_APPOINTMENT_STATUS.find(item => item.value == status);
        return target ? target.label : '未知';
      },
      statusColor(status) {
        const target = ALL_APPOINTMENT_STATUS.find(item => item.value == status);
        return target ? target.color : '';
      },
      onVisitDateChange(event) {
        console.log(event);
        this.query.visitDate = event.detail;
        this.search();
      },
      reset() {
        this.$refs.form.resetFields();
        this.query.visitTime = '';
        this.query.visitDate = '';
      },
      onClickSettingBtn() {
        this.$router.push({
          name: 'project.appointment.setting.list',
        });
      },
      getExportParams() {
        return {
          url: projectAppointmentApi.EXPORT_URL,
          data: this.getParams(),
          withFileName: true, // 使用 API 端返回的文件名作为下载的文件名
        };
      },

      getParams() {
        const { visitDate, visitTime, ...other } = this.query;
        const [beginDate, endDate] = visitDate || ['', ''];
        const [beginTime, endTime] = visitTime || ['', ''];
        return {
          ...other,
          beginDate,
          endDate,
          beginTime,
          endTime,
        };
      },

      async handleFetch(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        const payload = {
          ...this.getParams(),
          pageNo,
          pageSize,
        };
        const { data, totalCount } = await projectAppointmentApi.getList(payload);
        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },

      async handleStatusChange() {
        this.search();
      },

      search() {
        this.$refs.table.search();
      },

      async getProjects() {
        const { data } = await projectApi.getSimpleList();
        this.allProjects = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  /deep/ .ky-radios-tabs {
    margin: -24px;
    margin-bottom: 30px;
    display: block;
    height: 50px;
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
      font-size: 14px;
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
      height: 3px;
      width: 80%;
      background-color: #fa7516;
    }
  }

  .action-bar {
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
  }

  .visit-date {
    white-space: nowrap;
    border: 1px solid red;
  }
</style>
