<template>
  <list-page-layout>
    <template #filters>
      <div>
        <el-radio-group v-model="query.status" class="condition__radios ky-radios-tabs" size="medium">
          <el-radio-button v-for="item in statusOptions" :key="item.value" :label="item.value">{{
            item.label
          }}</el-radio-button>
        </el-radio-group>

        <div class="condition__body">
          <el-form ref="form" inline :model="query" @submit.native.prevent="handleSearch">
            <el-form-item label="探访项目" prop="projId">
              <el-select v-model="query.projId" placeholder="请选择" clearable>
                <el-option
                  v-for="item in allProjects"
                  :key="item.id"
                  :label="item.prjName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="探访长者" prop="elderName">
              <el-input v-model="query.elderName" placeholder="请输入" clearable></el-input>
            </el-form-item>

            <el-form-item label="预约日期">
              <el-date-picker
                v-model="query.visitDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>

            <el-form-item label="探访时间">
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
      </div>
    </template>

    <div class="v-appointment-list body-wrapper">
      <div>
        <div class="action-bar">
          <el-button plain type="primary" @click="onClickSettingBtn">预约设置</el-button>
          <export-button type="primary" :params="getExportParams">导出</export-button>
        </div>

        <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
          <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
          <el-table-column align="center" prop="projName" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="elderName" label="探访长者"></el-table-column>
          <el-table-column align="center" label="探访时间">
            <template slot-scope="scope">
              <span>{{ scope.row.visitDate }} {{ scope.row.beginTime }}-{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="userName" label="探访人"></el-table-column>
          <el-table-column align="center" prop="visitPeopleNums" label="探访人数"></el-table-column>
          <el-table-column align="center" prop="userPhone" label="探访人电话"></el-table-column>
          <el-table-column align="center" prop="status" label="状态">
            <template slot-scope="scope">
              <span :style="{ color: statusColor(scope.row.appointStatus) }">{{
                statusName(scope.row.appointStatus)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="![0, 1, 3].includes(query.status)"
            align="center"
            prop="cancelReason"
            label="取消原因"
          ></el-table-column>
        </fat-table>
      </div>
    </div>
  </list-page-layout>
</template>

<script>
  import { projectApi, elderAppointmentApi } from '@/mod-kangyang/src/api';
  import ExportButton from '@/dss-common/components/export-button/index';
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import { ALL_APPOINTMENT_STATUS } from '@/mod-kangyang/src/constants';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'ProjectElderAppointment',
    components: {
      FatTable,
      ExportButton,
      ListPageLayout,
    },
    data() {
      const defaultQuery = {
        projId: undefined,
        elderName: undefined,
        visitDate: '',
        visitTime: '',
      };

      return {
        statusOptions: ALL_APPOINTMENT_STATUS,
        query: Object.assign({}, defaultQuery),
        activeName: 'list', // 标签页默认值
        allProjects: [],
      };
    },
    mounted() {
      this.getProjects();
    },
    methods: {
      statusName(status) {
        const target = ALL_APPOINTMENT_STATUS.find(item => item.value == status);
        return target ? target.label : '未知';
      },
      statusColor(status) {
        const target = ALL_APPOINTMENT_STATUS.find(item => item.value == status);
        return target ? target.color : '';
      },
      reset() {
        this.$refs.form.resetFields();
        this.query.visitDate = '';
        this.query.visitTime = '';
      },
      onClickSettingBtn() {
        this.$router.push({
          name: 'project.elderAppointment.setting.list',
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
        const { data, totalCount } = await elderAppointmentApi.getList(payload);
        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },

      async handleStatusChange() {
        this.handleSearch();
      },

      handleSearch() {
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
</style>
