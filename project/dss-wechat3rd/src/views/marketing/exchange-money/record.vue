<template>
  <list-page-layout class="app-record-container">
    <template #main-actions> </template>

    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/marketing/exchange-money' }" replace> 积分兑钱</el-breadcrumb-item>
      <el-breadcrumb-item> 积分兑钱记录 </el-breadcrumb-item>
    </el-breadcrumb>

    <template #filters>
      <el-form ref="query" class="nav-form" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="会员账号" prop="phone">
          <el-input
            class="w250"
            maxlength="20"
            v-model.trim="form.phone"
            clearable
            placeholder="搜索手机号码"
          ></el-input>
        </el-form-item>

        <el-form-item label="核销商户" prop="verificationSubStore">
          <el-select v-model="form.verificationSubStore" class="w250" filterable>
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in merchantList"
              :key="index"
              :label="item.name"
              :value="item.subStoreId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="状态" label-width="60px">
          <el-select v-model="form.status" class="w250" placeholder="全部">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <br />
        <el-form-item prop="dateRange" label="核销时间">
          <el-date-picker
            class="el-form-item-view dss-filter-input"
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="会员" prop="phone" width="300px">
        <template slot-scope="scope">
          <user-info-field :avatar="scope.row.avatarImg" :name="scope.row.name" :phone="scope.row.phone" />
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="status">
        <template slot-scope="scope">
          <div>{{ scope.row.status ? '已撤销' : '已抵扣' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作积分" prop="score"></el-table-column>
      <el-table-column label="抵扣金额" prop="amount">
        <template slot-scope="scope">
          <div>￥{{ scope.row.amount | price }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作项目" prop="verificationStoreName">
        <template slot-scope="scope">
          <div>{{ scope.row.verificationStoreName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作商户" prop="verificationSubStoreName"></el-table-column>
      <el-table-column label="操作时间" prop="createTime">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime }}</div>
        </template>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import exchangeApi from '@/dss-wechat3rd/src/api/exchange-money.js';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { mapState } from 'vuex';
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';
  import { timeFormat } from '@/business-common/filters/date-format-filters';

  export default {
    name: 'Record',
    components: { FatTable, ListPageLayout, TableActions, UserInfoField },
    data() {
      return {
        showTipDialog: false,
        orderStatusList: [],
        form: {
          carNo: null,
          phone: null,
          verificationSubStore: null,
          status: null,
          dateRange: [],
        },
        merchantList: [],
        statusList: [
          {
            label: '抵扣',
            value: 0,
          },
          {
            label: '撤销',
            value: 1,
          },
        ],
      };
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        storeList: state => state.storeList.filter(i => !!i.id),
      }),
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        exchangeApi
          .tenant_queryList({
            pageNo: 1,
            pageSize: 1000,
          })
          .then(res => {
            this.merchantList = res.data || [];
          })
          .catch(() => {});
      },

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
          storeId: this.$route.query.storeId,
        };
        if (this.form.dateRange && this.form.dateRange.length) {
          params.startTime = timeFormat(this.form.dateRange[0], 'YYYY-MM-DD 00:00:00');
          params.endTime = timeFormat(this.form.dateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        delete params.dateRange;

        const { data: list, totalCount: total } = await exchangeApi.record(params);
        return { list: list || [], total };
      },
    },
  };
</script>

<style lang="less" scoped>
  .app-record-container {
    .wkt-breadcrumb-container {
      height: 50px !important;
      line-height: 50px !important;
      padding: 0 20px;
    }

    .export-btn {
      margin: 20px 20px 0 20px;
    }

    .w250 {
      width: 250px;
    }

    .default {
      display: inline-block;
      border: 1px solid #fa7516;
      color: #fa7516;
      width: 40px;
      text-align: center;
      line-height: 22px;
      border-radius: 4px;
      margin-right: 5px;
    }

    .dss-filter-input {
      width: 340px !important;
    }
  }
</style>
