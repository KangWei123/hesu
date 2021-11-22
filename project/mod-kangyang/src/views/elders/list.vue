<template>
  <list-page-layout>
    <template #main-actions>
      <el-form inline :model="mainQuery">
        <el-form-item label="项目">
          <el-select v-model="mainQuery.prjId" placeholder="请选择" clearable @change="onProjectChange()">
            <el-option v-for="item in allProjects" :key="item.id" :label="item.prjName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #filters>
      <el-form ref="query" inline :model="query" @submit.native.prevent="handleSearch">
        <el-form-item label="长者" prop="nameOrMobile">
          <el-input v-model="query.nameOrMobile" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="认证状态" prop="certifyState">
          <el-select v-model="query.certifyState" clearable>
            <el-option v-for="item of authTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="长者信息来源" prop="sourceType">
          <el-select v-model="query.sourceType" clearable>
            <el-option
              v-for="item of sources"
              :key="item.sourceType"
              :label="item.sourceTypeName"
              :value="item.sourceType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <template #sub-actions>
      <div class="header-actions mg-bt-10">
        <export-button type="primary" :params="getExportParams">导出</export-button>
        <el-button type="primary" @click="onClickAdd">新增</el-button>
      </div>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="fetchHandler">
      <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
      <el-table-column align="center" prop="name" label="姓名" width="200px"></el-table-column>
      <el-table-column align="center" prop="credentialTypeName" label="证件类型"></el-table-column>
      <el-table-column align="center" prop="credentialNo" label="证件号码">
        <template slot-scope="scope">
          <span>{{ scope.row.credentialNo | formatCardId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="credentialType" label="认证状态">
        <template slot-scope="scope">
          {{ authTypeName[scope.row.certifyState] }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sourceTypeName" label="长者信息来源"></el-table-column>
      <el-table-column align="center" prop="roomNo" label="房号"></el-table-column>
      <el-table-column align="center" prop="bedNo" label="床位"></el-table-column>
      <el-table-column align="center" prop="mobile" label="联系电话"></el-table-column>
      <el-table-column label="操作" fixed="right" align="right" min-width="100" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '详情', onClick: () => handleDetail(scope.row) },
            { name: '删除', type: 'danger', onClick: () => handleDelete(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import DepartmentSelector from './components/department-selector';
  import ExportButton from '@/dss-common/components/export-button';
  import { formatCardId, addIdxToListItem, setProjectIdToStorage, getSelectedProjectIdFromStorage } from '../../utils';
  import { AuthTypes, AuthTypeName } from './constants';
  import { elderApi, projectApi } from '@/mod-kangyang/src/api';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';

  export default {
    name: 'Elders',
    components: {
      FatTable,
      ExportButton,
      DepartmentSelector,
      ListPageLayout,
      TableActions,
    },
    filters: {
      formatCardId(value) {
        return formatCardId(value || '');
      },
    },
    data() {
      return {
        mainQuery: {
          prjId: undefined,
        },
        authTypes: AuthTypes,
        authTypeName: AuthTypeName,
        serviceTypes: [],
        query: {
          nameOrMobile: '',
          certifyState: undefined,
          sourceType: undefined,
        },
        allProjects: [],
        sources: [],
      };
    },
    async mounted() {
      const { data } = await projectApi.getSimpleList();
      this.allProjects = data;
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
      this.getSources();
    },
    computed: {
      prjName() {
        const target = this.allProjects.find(item => item.id == this.mainQuery.prjId);
        if (target) {
          return target.prjName;
        }
        return '';
      },
    },
    methods: {
      onProjectChange() {
        setProjectIdToStorage(this.mainQuery.prjId);
        this.$refs.table.search();
      },
      reset() {
        this.$refs.query.resetFields();
      },
      getExportParams() {
        return {
          url: elderApi.EXPORT_URL,
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
      onClickAdd() {
        this.$router.push({
          name: 'elder.create',
          query: {
            prjId: this.mainQuery.prjId,
            name: this.prjName,
          },
        });
      },
      handleEdit(row) {
        this.$router.push({
          name: 'elder.edit',
          params: {
            elderId: row.id,
          },
          query: {
            prjId: this.mainQuery.prjId,
            name: this.prjName,
          },
        });
      },
      toDetail(item) {
        this.$router.push({
          path: `/elders/${item.id}`,
        });
      },

      handleSearch() {
        this.$refs.table.search();
      },

      async fetchHandler(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        this.loading = true;

        const { data, totalCount } = await elderApi.getElders({
          ...this.getParams(),
          pageNo,
          pageSize,
        });

        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },

      async getSources() {
        const { data } = await elderApi.getSources();
        this.sources = data || [];
      },

      handleDetail(row) {
        this.$router.push({
          name: 'elder.detail',
          params: {
            id: row.id,
          },
        });
      },
      handleDelete(row) {
        this.$confirm('确认要删除吗？', '', {
          type: 'warning',
          beforeClose: async (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              try {
                await elderApi.delElder({
                  appId: row.appId,
                  elderId: row.id,
                  prjId: row.prjId,
                });
                done();
              } finally {
                instance.confirmButtonLoading = false;
              }
            } else {
              done();
            }
          },
        }).then(() => {
          this.handleSearch();
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn-add {
      margin-left: 15px;
    }

    &__btn-template {
      margin-right: 15px;
    }
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

  .tips {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 16px;

    &-text {
      margin-right: 24px;
      font-size: 14px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #303133;
    }
  }

  .upload-dialog {
    /deep/.el-dialog__header {
      background-color: #fff;
      color: #303133;
      text-align: left;

      .el-dialog__title {
        color: #303133;
      }

      .el-dialog__close {
        color: #303133;
      }
    }

    &__footer {
      text-align: center;
    }

    .tips {
      margin-bottom: 30px;
    }

    /deep/.el-upload {
      display: block;
      text-align: left;

      .el-upload-dragger {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        padding: 20px 14px;
        border: 1px dashed #dce1e6;
        border-radius: 3px;
        width: 100% !important;
        height: auto !important;
        background-color: transparent;

        .uploadbox__tips {
          font-size: 14px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #a1a4ab;
        }
      }
    }
  }
</style>
