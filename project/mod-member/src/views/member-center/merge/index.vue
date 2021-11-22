<template>
  <list-page-layout>
    <template #main-actions> <el-button type="primary" @click="handleAdd">+ 新增合并</el-button> </template>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="主手机号" prop="mainUserPhone">
          <el-input v-model.trim="form.mainUserPhone" placeholder="请输入主手机号" maxlength="32" class="w220" />
        </el-form-item>
        <el-form-item label="主会员ID" prop="mainUniqueAccountId">
          <el-input v-model.trim="form.mainUniqueAccountId" placeholder="请输入主会员ID" maxlength="32" class="w220" />
        </el-form-item>
        <el-form-item label="主账号姓名" prop="mainUsername">
          <el-input v-model.trim="form.mainUsername" placeholder="请输入主账号姓名" maxlength="32" class="w220" />
        </el-form-item>
        <br />
        <el-form-item label="被合并手机号" prop="mergedUserPhone">
          <el-input v-model.trim="form.mergedUserPhone" placeholder="请输入被合并手机号" maxlength="32" class="w220" />
        </el-form-item>
        <el-form-item label="被合并ID" prop="mergedUniqueAccountId">
          <el-input
            v-model.trim="form.mergedUniqueAccountId"
            placeholder="请输入被合并ID"
            maxlength="32"
            class="w220"
          />
        </el-form-item>
        <br />
        <el-form-item label="操作时间" prop="createTime">
          <date-range-picker v-model="form.createTime" type="daterange" />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="主会员ID" prop="mainUniqueAccountId"></el-table-column>
      <el-table-column label="主账号信息" v-slot="{ row }">
        <div class="user-info__name">{{ row.mainUsername }}</div>
        <div class="user-info__contact">{{ row.mainUserPhone }}</div>
      </el-table-column>
      <el-table-column label="被合并ID" prop="mergedUniqueAccountId"></el-table-column>
      <el-table-column label="被合并账号信息" v-slot="{ row }">
        <div class="user-info__name">{{ row.mergedUsername }}</div>
        <div class="user-info__contact">{{ row.mergedUserPhone }}</div>
      </el-table-column>
      <el-table-column label="操作时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作人" prop="operatorName"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 潜在会员列表
   */
  export default {
    name: 'MemberMerge',
    components: {
      FatTable,
      ListPageLayout,
      DateRangePicker,
    },
    data() {
      return {
        form: {
          mainUserPhone: null,
          mainUniqueAccountId: null,
          mergedUserPhone: null,
          mergedUniqueAccountId: null,
          mainUsername: null,
          createTime: [],
        },
        loading: false,
      };
    },
    methods: {
      getParams() {
        const { createTime, ...other } = this.form;

        if (createTime) {
          const [createTimeStart, createTimeEnd] = createTime;
          Object.assign(other, { createTimeStart, createTimeEnd });
        }
        return other;
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;
        this.loading = true;
        // 请求参数
        const payload = {
          ...this.getParams(),
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getMergeList(payload);
        this.loading = false;
        return {
          list: data,
          total: totalCount,
        };
      },
      handleAdd() {
        this.$router.push({ path: '/member-center/merge/edit' });
      },
    },
  };
</script>

<style lang="less" scoped></style>
