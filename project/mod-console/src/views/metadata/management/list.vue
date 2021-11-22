<template>
  <div class="metadata-account">
    <div class="top-box">
      <div class="title">数据源账号</div>
      <div class="add-box" v-loading="syncLoading">
        <el-button class="add-btn" icon="el-icon-refresh" type="primary" @click="syncAccountData">同步账号</el-button>
      </div>
      <el-form class="form-box" ref="query" @submit.prevent.native="$refs.table.search()" :model="filterForm" inline>
        <el-form-item label="数据源" prop="dealerName">
          <el-select v-model="filterForm.type" placeholder="选择">
            <el-option v-for="(item, index) in typeList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号名称" prop="dealerName">
          <el-input prefix-icon="el-icon-search" placeholder="请输入账号名称" v-model.trim="filterForm.accountName" />
        </el-form-item>
        <el-form-item label="状态" prop="dealerName">
          <el-select v-model="filterForm.status" placeholder="选择">
            <el-option v-for="(item, index) in statusList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit">搜索</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <fat-table
      class="table-box"
      ref="table"
      :fetch-handler="getAccountList"
      :state.sync="filterForm"
      row-key="accountId"
    >
      <el-table-column label="数据源" prop="type"></el-table-column>
      <el-table-column label="账号名称" prop="accountName"></el-table-column>
      <el-table-column label="授权状态">
        <div slot-scope="scope">{{ scope.row.status | statusDesc }}</div>
      </el-table-column>
      <el-table-column label="余额" prop="balance"></el-table-column>
      <el-table-column label="创建时间" prop="createTime">
        <div slot-scope="scope">{{ scope.row.createTimeStr }}</div>
      </el-table-column>
      <el-table-column label="操作" align="right" width="240px" v-slot="scope" fixed="right">
        <table-actions
          :options="[
            { name: '同步', onClick: () => syncAccountData() },
            // { name: '重新授权', onClick: () => doAuthorization(scope.row) },
            { name: '删除', type: 'danger', onClick: () => deleteAccount(scope.row.id) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';
  import Apis from '@/mod-console/src/api/metadata/index';
  export default {
    name: 'List',
    components: {
      WkbPageNav,
      ListPageLayout,
      FatTable,
      TableActions,
    },
    filters: {
      statusDesc: function (value) {
        let str = '';
        switch (value) {
          case 1: {
            str = '开户金未到';
            break;
          }
          case 2: {
            str = '正常生效';
            break;
          }
          case 3: {
            str = '余额为零';
            break;
          }
          case 4: {
            str = '未通过审核';
            break;
          }
          case 6: {
            str = '审核中';
            break;
          }
          case 7: {
            str = '被禁用';
            break;
          }
          case 11: {
            str = '预算不足';
            break;
          }
        }
        return str;
      },
    },
    data() {
      return {
        typeList: [
          { value: '', label: '全部' },
          { value: 'BAIDU', label: '百度' },
        ],
        statusList: [
          { value: '', label: '全部' },
          { value: 1, label: '开户金未到' },
          { value: 2, label: '正常生效' },
          { value: 3, label: '余额为零' },
          { value: 4, label: '未通过审核' },
          { value: 6, label: '审核中' },
          { value: 7, label: '被禁用' },
          { value: 11, label: '预算不足' },
        ],
        filterForm: {
          accountName: '',
          status: '',
          type: '',
        },
        loading: false,
        syncLoading: false,
        totalCount: 0,
        currentPage: 1,
        pageSize: 10,
        data: [],
      };
    },
    methods: {
      async getAccountList(params) {
        // 分页信息
        const { pagination } = params;
        console.log(pagination);
        // 请求参数
        const payload = {
          accountName: this.filterForm.accountName,
          status: this.filterForm.status,
          type: this.filterForm.type,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        //
        const { data, totalCount } = await Apis.getAccountList(payload);
        return {
          list: data || [],
          total: totalCount,
        };
      },
      // 获取数据
      search() {
        this.$refs.table.search();
      },
      resetForm() {
        this.filterForm = {
          accountName: '',
          status: '',
          type: '',
        };
      },
      syncAccountData() {
        if (this.syncLoading) {
          return false;
        }
        this.syncLoading = true;
        const params = {};
        Apis.syncAccount(params)
          .then(res => {
            this.$message({ message: '数据同步中，预计1-3分钟，请稍后刷新', type: 'warning' });
          })
          .catch(() => {
            this.$message.error('同步失败，请重试');
          })
          .always(() => {
            this.syncLoading = false;
          });
      },
      doAuthorization() {},
      deleteAccount(id) {
        this.$confirm(`确定删除该账号吗？ `, '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          const params = {
            id: id,
          };
          Apis.deleteAccount(params)
            .then(res => {
              this.search();
              this.$message({
                message: '删除成功',
                type: 'success',
              });
            })
            .catch(() => {});
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .metadata-account {
    padding: 24px;
    .top-box {
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.06);
      position: relative;
      .add-box {
        position: absolute;
        right: 24px;
        top: 11px;
      }
      .title {
        line-height: 58px;
        padding: 0 24px;
        font-size: 16px;
        color: #303133;
        font-weight: 500;
        border-bottom: 1px solid #dce1e6;
      }
      .form-box {
        padding: 22px 24px 0;
      }
    }
    .table-box {
      margin-top: 16px;
      background: #ffffff;
      padding: 0 0 24px;
      border-radius: 4px;
      box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.06);
    }
  }
</style>
