<template>
  <list-page-layout class="account-container">
    <template #main-actions>
      <el-button type="primary" @click="onAdd">+ 添加账号</el-button>
    </template>
    <template #filters>
      <el-form
        ref="query"
        @submit.prevent.native="$refs.table.search()"
        :model="form"
        inline
        label-suffix=":"
        label-width="80px"
      >
        <el-form-item label="账号信息" prop="accountNo">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="搜索账号/手机号"
            v-model.trim="form.accountNo"
            :maxlength="32"
            clearable
            class="w220"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="accountName">
          <el-input
            prefix-icon="el-icon-search"
            placeholder="搜索用户名"
            v-model.trim="form.accountName"
            :maxlength="32"
            clearable
            class="w220"
          />
        </el-form-item>
        <!-- <el-form-item label="所属应用" prop="appId">
          <app-select placeholder="请选择所属应用" v-model="form.appId" clearable class="w220" />
        </el-form-item> -->
        <el-form-item label="所属项目" prop="storeId">
          <project-select placeholder="请选择所属项目" v-model="form.storeId" clearable class="w220" />
        </el-form-item>
        <el-form-item label="所属商户" prop="subStoreId">
          <merchant-select
            :store-id="form.storeId"
            placeholder="请选择所属商户"
            v-model="form.subStoreId"
            clearable
            class="w220"
            @list="
              $event => {
                merchantList = $event;
              }
            "
          />
        </el-form-item>
        <el-form-item label="类型" prop="accountType">
          <el-select v-model="form.accountType" clearable placeholder="全部" class="w220">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="accountStatus">
          <el-select v-model="form.accountStatus" clearable placeholder="全部" class="w220">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table
      ref="table"
      :state.sync="form"
      class="wkb-table-border"
      row-key="accountNo"
      :fetch-handler="handleFetch"
      :remove-handler="handleRemove"
      remove-confirm-title="删除"
      remove-confirm-message="是否确认删除，删除后，该账号将无法登录发券宝"
      remove-is-center
      remove-class="account-remove"
    >
      <el-table-column label="账号" prop="accountNo" fixed="left" min-width="140" />
      <el-table-column label="用户名" prop="accountName" fixed="left" min-width="120" />
      <el-table-column label="所属应用" prop="appName" min-width="140" />
      <el-table-column label="所属项目" prop="storeName" min-width="140" />
      <el-table-column label="所属商户" v-slot="{ row }" min-width="140" :show-overflow-tooltip="true">
        {{ getName(row.subStoreId) }}
      </el-table-column>
      <el-table-column label="类型" v-slot="{ row }" min-width="120">
        {{ typeName[row.accountType] }}
      </el-table-column>
      <el-table-column label="状态" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch
            class="switch-style"
            :value="scope.row.accountStatus"
            @change="handleStatusChange(scope.row)"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </template>
      </el-table-column>
      <el-table-column label="创建人" min-width="120">
        <template slot-scope="scope" min-width="120">
          <p>{{ scope.row.createUserName }}</p>
          <p>{{ scope.row.createUserRoleName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createTime" width="130" />
      <el-table-column label="操作" align="right" v-slot="scope" width="200" fixed="right">
        <table-actions :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>

    <el-dialog title="添加账号" :visible.sync="addVisible" width="480px">
      <div class="dialog-container">
        <div class="card" @click="$router.push('/business/coupon/account/add-in')">
          <div class="icon-bg">
            <wk-icon name="icon-user" class="icon-user" />
          </div>
          <span>添加内部人员</span>
        </div>
        <div class="card" @click="$router.push('/business/coupon/account/add-out')">
          <div class="icon-bg">
            <wk-icon name="icon-user" class="icon-user" />
          </div>
          <span>添加外部人员</span>
        </div>
      </div>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  // import AppSelect from '@/business-common/components/app-select';
  import MerchantSelect from '@/business-common/components/merchant-select';
  import ProjectSelect from '@/business-common/components/project-select';
  import { typeName, typeOptions } from '../../enum';
  import { getAccountList, delAccount, updateAccountStatus } from '@/dss-wechat3rd/src/api/account-coupon';

  export default {
    components: { ListPageLayout, FatTable, TableActions, /* AppSelect, */ MerchantSelect, ProjectSelect },
    data() {
      return {
        form: {
          accountNo: '',
          accountName: '',
          appId: '',
          storeId: '',
          subStoreId: '',
          accountType: '',
          accountStatus: '',
        },
        addVisible: false,
        statusOptions: [
          {
            value: null,
            label: '全部',
          },
          {
            value: 1,
            label: '启用',
          },
          {
            value: 0,
            label: '禁用',
          },
        ],
        typeOptions,
        typeName,
      };
    },
    computed: {
      getName() {
        return id => {
          const { merchantList } = this;
          const res = merchantList.find(item => item.subStoreId === id);

          return (res && res.name) || '-';
        };
      },
    },
    methods: {
      onAdd() {
        this.addVisible = true;
      },
      tableActions(row) {
        return [
          {
            name: '编辑',
            link: { path: '/business/coupon/account/add-out/edit', query: { accountNo: row.accountNo } },
          },
          {
            name: '发券权限',
            onClick: () => {
              const isClick = row.menuIdList.includes(1); // 1 表示发放优惠券权限
              if (!isClick) {
                return;
              }
              this.$router.push({ path: '/business/coupon/account/config', query: { id: row.id } });
            },
            disabled: !row.menuIdList.includes(1),
          },
          {
            name: '删除',
            type: 'danger',
            onClick: () => {
              this.$refs.table.remove(row.accountNo);
            },
          },
        ];
      },
      async handleStatusChange(row) {
        const params = { accountNo: row.accountNo, accountStatus: Number(!row.accountStatus) };
        await updateAccountStatus(params);
        row.status = params.accountStatus;
        this.$refs.table.refresh();
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
        };

        const { data, totalCount } = await getAccountList(payload);

        return {
          list: data,
          total: totalCount,
        };
      },
      handleRemove(ids) {
        return delAccount({ accountNo: ids[0] });
      },
    },
  };
</script>

<style lang="less" scoped>
  .dialog-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 35px;

    .card {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 70px;
      border: 1px solid #f2f6fc;
      border-radius: 5px;
      font-size: 16px;
      color: #a1a4ab;
      margin-right: 15px;
      cursor: pointer;

      .icon-bg {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: #f5f7fa;
      }

      .icon-user {
        width: 24px;
        height: 24px;
        fill: #d5d8de;
      }

      &:hover {
        border: 1px solid #fa7516;
        color: #fa7516;

        .icon-user {
          fill: #fa7516;
        }
      }

      span {
        margin-left: 16px;
      }
    }
  }

  .switch-style {
    .el-switch__label {
      position: absolute;
      color: #fff !important;
      z-index: 1;
      display: none;
    }

    .is-active {
      display: block;
    }

    .el-switch__label--left span {
      margin-left: 20px;
    }
  }
</style>

<style lang="less">
  .account-remove {
    .el-message-box__title {
      display: flex;
      flex-direction: column;

      .el-message-box__status {
        font-size: 42px !important;
      }

      .el-message-box__status.el-icon-warning {
        color: #ff7875;
      }

      span {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
        margin-top: 8px;
      }
    }
  }
</style>
