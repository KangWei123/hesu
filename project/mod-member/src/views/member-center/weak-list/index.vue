<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" @submit.prevent.native="$refs.table.search()" :model="form" inline label-suffix=":">
        <el-form-item label="接触应用" prop="appId">
          <app-select placeholder="请选择接触应用" v-model="form.appId" clearable class="w220" />
        </el-form-item>
        <el-form-item label="接触渠道" prop="channelId">
          <channel-select placeholder="请选择接触渠道" v-model="form.channelId" clearable class="w220" />
        </el-form-item>
        <el-form-item label="首次接触时间" prop="registerDate">
          <date-range-picker v-model="form.registerDate" type="daterange" />
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="会员一账通ID" prop="uniqueAccountId" />
      <el-table-column label="接触应用" v-slot="{ row }">
        <span>{{ (row.appNameList || []).join('、') }}</span>
      </el-table-column>
      <el-table-column label="接触渠道" v-slot="{ row }">
        <span
          >{{ row.channelName }}{{ row.channelNameList.length > 0 ? '-' : ''
          }}{{ (row.channelNameList || []).join('、') }}</span
        >
      </el-table-column>
      <el-table-column label="首次接触时间" prop="createTime" />
    </fat-table>
  </list-page-layout>
</template>

<script>
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import AppSelect from '@/business-common/components/app-select';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';
  import ChannelSelect from '@/mod-member/src/components/channel-select';
  import api from '@/mod-member/src/api/memberAPI';

  /**
   * 潜在会员列表
   */
  export default {
    name: 'WeakUserList',
    components: {
      AppSelect,
      FatTable,
      ListPageLayout,
      DateRangePicker,
      ChannelSelect,
    },
    data() {
      return {
        form: {
          levelNum: null,
          appId: null,
          channelId: null,
          status: null,
          ftype: null,
          registerDate: null,
        },
      };
    },
    methods: {
      getParams() {
        const { registerDate, ...other } = this.form;

        if (registerDate) {
          const [createStartTime, createEndTime] = registerDate;
          Object.assign(other, { createStartTime, createEndTime });
        }
        return other;
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;

        // 请求参数
        const payload = {
          ...this.getParams(),
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.memberCenter.getWeakList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>

<style lang="less" scoped></style>
