<template>
  <list-page-layout>
    <template #main-actions>
      <div class="header-actions">
        <el-form inline :model="mainQuery">
          <el-form-item label="项目">
            <el-select v-model="mainQuery.prjId" placeholder="请选择" clearable @change="onProjectChange">
              <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </template>

    <template #filters>
      <el-form ref="query" inline :model="query" @submit.native.prevent="handleSearch">
        <el-form-item label="亲友" prop="nameOrMobile">
          <el-input v-model="query.nameOrMobile" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="认证状态" prop="certifyState">
          <el-select v-model="query.certifyState" clearable placeholder="请选择">
            <el-option label="未认证" :value="1"></el-option>
            <el-option label="已认证" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="亲友信息来源" prop="sourceType">
          <el-select v-model="query.sourceType" clearable>
            <el-option label="全部" :value="undefined"> </el-option>
            <el-option
              v-for="item of channels"
              :key="item.sourceType"
              :label="item.sourceTypeName"
              :value="item.sourceType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="header-actions mg-bt-10">
        <export-button type="primary" :params="getExportParams">导出</export-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="fetchHandler">
      <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="250px"> </el-table-column>
      <el-table-column align="center" prop="credentialTypeName" label="证件类型"></el-table-column>
      <el-table-column align="center" prop="credentialNo" label="证件号码"></el-table-column>
      <el-table-column align="center" prop="credentialType" label="认证状态">
        <template slot-scope="scope">
          {{ AuthTypeName[scope.row.certifyState] || '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="注册时间"></el-table-column>
      <el-table-column align="center" prop="sourceTypeName" label="亲友信息来源"></el-table-column>
      <el-table-column align="center" prop="mobile" label="联系电话"></el-table-column>
      <el-table-column label="操作" min-width="100px" fixed="right" align="right" v-slot="scope">
        <table-actions :options="[{ name: '详情', onClick: () => toDetail(scope.row) }]" />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { AuthTypeName } from './constants';
  import { elderApi, projectApi } from '@/mod-kangyang/src/api';
  import {
    formatCardId,
    addIdxToListItem,
    getSelectedProjectIdFromStorage,
    setProjectIdToStorage,
  } from '@/mod-kangyang/src/utils/index';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import ExportButton from '@/dss-common/components/export-button';

  export default {
    name: 'FailyMembers',
    components: {
      FatTable,
      ListPageLayout,
      TableActions,
      ExportButton,
    },
    filters: {
      formatCardId(value) {
        return formatCardId(value);
      },
    },
    data() {
      return {
        EXPORT_URL: elderApi.EXPORT_URL,
        AuthTypeName,
        mainQuery: { prjId: undefined },
        query: {
          nameOrMobile: '',
          sourceType: null,
          registerDate: null,
          startTime: null,
          endTime: null,
        },
        channels: [],
        dateRange: null,
        allProjects: [],
      };
    },
    watch: {
      dateRange(range) {
        if (!range) {
          this.query.startTime = null;
          this.query.endTime = null;
          return;
        }
        const [startTime, endTime] = range;
        if (startTime) {
          this.query.startTime = startTime;
        }
        if (endTime) {
          this.query.endTime = endTime;
        }
      },
    },
    mounted() {
      this.getChannels();
      this.getProjects();
    },
    methods: {
      onProjectChange() {
        setProjectIdToStorage(this.mainQuery.prjId);
        this.handleSearch();
      },
      reset() {
        this.$refs.query.resetFields();
      },
      getExportParams() {
        return {
          url: elderApi.EXPORT_MEMBERS_URL,
          data: this.getParams(),
          withFileName: true,
        };
      },

      getParams() {
        return {
          ...this.query,
          prjId: this.mainQuery.prjId,
        };
      },

      toDetail(item) {
        this.$router.push({
          path: `/family-members/${item.id}`,
        });
      },

      handleSearch() {
        this.$refs.table.search();
      },

      async fetchHandler(params) {
        this.loading = true;
        const { currentPage: pageNo, pageSize } = params.pagination;

        const { data, totalCount } = await elderApi.getMembers({
          ...this.getParams(),
          pageNo,
          pageSize,
        });

        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },

      async getChannels() {
        const res = await elderApi.getSources();
        this.channels = res.data;
      },

      async getProjects() {
        const { data } = await projectApi.getSimpleList();
        const [firstProject] = data || [];
        const projectId = getSelectedProjectIdFromStorage();
        if (projectId) {
          this.mainQuery = {
            prjId: projectId,
          };
        } else if (firstProject) {
          this.mainQuery = {
            prjId: firstProject.id,
          };
        }

        this.allProjects = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 24px;
  }

  .user-info__header {
    display: flex;
    align-items: center;
  }

  .user-info__avatar {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    overflow: hidden;
    vertical-align: middle;
  }

  .user-info__avatar > img {
    width: 58px;
    height: 58px;
  }

  .user-info__base {
    margin-left: 10px;
  }

  .user-info__name {
    text-align: left;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #303133;
    line-height: 20px;
    margin-bottom: 4px;
  }

  .user-info__phone {
    text-align: left;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #303133;
    line-height: 20px;
  }
</style>
