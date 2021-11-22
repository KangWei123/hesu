<template>
  <list-page-layout class="dealer-wrap">
    <template #main-actions>
      <el-button class="query-add-btn" type="primary" @click="clickAdd">添加经销商</el-button>
    </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="filterForm" inline>
        <!-- TODO: 字段修改 -->
        <el-form-item label="信息搜索" prop="dealerName">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="搜索经销商编码/名称"
            v-model.trim="filterForm.dealerName"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #sub-actions>
      <el-button class="query-add-btn" :disabled="isExport" @click="handleExport">导出</el-button>
      <el-button class="patch-add" @click="openVipUpload">导入</el-button>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="filterForm" row-key="id">
      <el-table-column label="经销商编码" prop="dealerNo" min-width="180px"></el-table-column>
      <el-table-column label="经销商名称" prop="dealerName" min-width="180px"></el-table-column>
      <el-table-column label="负责人" prop="chargePerson" width="120px"></el-table-column>
      <el-table-column label="手机号码" prop="chargePersonPhone" min-width="180px"></el-table-column>
      <el-table-column label="门店数" prop="storeCount" width="120px"></el-table-column>
      <el-table-column label="状态" width="150px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            @click.native="switchBusiness(scope.row)"
            :width="53"
            disabled
            :active-value="1"
            :inactive-value="0"
            active-color="#50DAAA"
            inactive-color="#DCDDE0"
          />
          {{ scope.row.status ? '开启' : '关闭' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="right" width="240px" v-slot="scope" fixed="right">
        <table-actions
          :options="[
            {
              name: '查看门店',
              link: {
                path: '/companyManage/store-center',
                query: { dealerId: scope.row.id, dealerName: scope.row.dealerName },
              },
            },
            { name: '编辑', link: { path: '/companyManage/dealer-center/list/detail', query: { id: scope.row.id } } },
          ]"
        />
      </el-table-column>
    </fat-table>
    <!--批量导入-->
    <upload
      :visible.sync="dialog.upload"
      :title="'经销商导入'"
      @upload-success="onUploadSuccess"
      :template-down-url="templateDownUrl"
      :upload-server-url="uploadServerUrl"
      :template-desc="'您可以下载我们提供的模版，批量上传经销商信息。 模版下载'"
    >
    </upload>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">经销商信息正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import * as dealerApi from '@/mod-org/src/api/dealerApi';
  import upload from '@/dss-common/components/upload';
  import exportExcel from '@/dss-common/utils/exportExcel';
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import { mapState } from 'vuex';

  export default {
    name: 'Index',
    components: {
      upload,
      ListPageLayout,
      FatTable,
      TableActions,
    },
    data() {
      return {
        // 模板下载地址
        templateDownUrl: dealerApi.dealerTemplateDownUrl,
        // 模板上传接口
        uploadServerUrl: dealerApi.dealerImportUrl,
        dialog: {
          upload: false,
        },
        filterForm: {
          dealerName: null,
        },
        isExport: false,
        showTipDialog: false,
        loading: false,
        totalCount: 0,
        pageNo: 1,
        pageSize: 10,
        tableData: [],
        data: [],
      };
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        storeList: 'storeList',
        env: 'env',
      }),
    },

    mounted() {
      this.search();
    },
    methods: {
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          keyword: this.filterForm.dealerName,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await dealerApi.queryList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },

      // 获取数据
      search() {
        this.$refs.table.search();
      },

      openVipUpload() {
        this.dialog.upload = true;
      },

      onUploadSuccess(message) {
        this.search();
      },

      handleExport() {
        this.$confirm(`确定导出全部的经销商信息吗？ `, '导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(() => {
          this.isExport = true;
          this.showTipDialog = true;
          exportExcel
            .getDownload(dealerApi.dealerExportUrl, {})
            .then(res => {
              this.$message({
                message: '导出经销商信息成功，正在下载',
                type: 'success',
              });
            })
            .always(() => {
              this.isExport = false;
              this.showTipDialog = false;
            });
        });
      },

      switchBusiness(row) {
        let title = '确定启用吗';
        let msg = '启用经销商后，经销商下所有门店状态将变更为营业，员工账号将可以登录系统。';
        const status = row.status ? 0 : 1;
        if (row.status) {
          title = '确定禁用吗';
          msg = '禁用经销商后，经销商下所有门店状态将变更为打烊，员工账号将无法登录系统。';
        }
        this.$confirm(msg, title, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            dealerApi
              .updateStatus({ id: row.id, status: status })
              .then(rs => {
                this.search();
                this.$message({
                  type: 'success',
                  message: '操作成功!',
                });
              })
              .catch(err => {
                console.error(err);
              })
              .always(() => {});
          })
          .catch(() => {});
      },

      // 新增经销商
      clickAdd() {
        this.$router.push({
          path: '/companyManage/dealer-center/list/detail',
          query: {},
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .dealer-wrap {
    .title {
      position: relative;
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      background: white;
      top: -38px;
    }

    .filter-content {
      display: flex;
      justify-content: space-between;
      background: white;
      padding: 20px;

      .left {
        .left-input {
          display: inline-block;
          width: 220px;
        }
      }

      .selector {
        color: #333;
        font-size: 12px;
        margin-left: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        display: inline-block;
      }
    }

    .dealer-content {
      background: white;
      margin-top: 20px;
    }

    .icon {
      width: 34px;
      height: 34px;
      border-radius: 100%;
      vertical-align: middle;
      display: inline-block;
      margin-right: 10px;
      background-size: cover !important;
    }

    .pagination {
      /deep/ .el-pagination {
        margin-right: 100px;
      }

      /deep/ .btn-next {
        position: relative;

        &::after {
          content: '尾页';
          font-size: 14px;
          position: absolute;
          top: 0;
          left: 27px;
        }
      }

      /deep/ .el-pagination__jump {
        margin-left: 50px;
        margin-right: 20px;
      }
    }

    .el-switch.is-disabled {
      opacity: 1;
    }

    /deep/ .el-switch.is-disabled .el-switch__core,
    /deep/ .el-switch.is-disabled .el-switch__label {
      cursor: pointer;
    }
  }
</style>
