<template>
  <div class="growth">
    <div class="filters">
      <el-form ref="query" :model="form" inline @submit.native.prevent="$refs.table.search()">
        <el-form-item label="应用" prop="appId">
          <app-select group-selectable v-model="form.appId" placeholder="请选择应用" clearable></app-select>
        </el-form-item>
        <el-form-item label="成长值类型" prop="accessType">
          <growth-type-select v-model="form.accessType" placeholder="请选择成长值类型" clearable />
        </el-form-item>
        <el-form-item label="时间" prop="dateRange">
          <date-range-picker v-model="form.dateRange" type="daterange"></date-range-picker>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button plain @click="handleChangeValue">增减成长值</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <fat-table ref="table" :state="form" :fetch-handler="handleFetch">
        <el-table-column label="时间" prop="createdTime"></el-table-column>
        <el-table-column label="应用" prop="appName" v-slot="scope">{{
          scope.row.appId === 0 ? '集团' : scope.row.appName || '-'
        }}</el-table-column>
        <!-- <el-table-column label="来源项目" prop="storeName" v-slot="scope">{{
          scope.row.storeName || '-'
        }}</el-table-column>
        <el-table-column label="来源商户" prop="subStoreName" v-slot="scope">{{
          scope.row.subStoreName || '-'
        }}</el-table-column> -->
        <el-table-column label="成长值类型" prop="accessTypeDetail"></el-table-column>
        <!-- <el-table-column label="比例" prop="TODO:"></el-table-column> -->
        <el-table-column label="订单金额" prop="orderAmount"></el-table-column>
        <el-table-column label="成长值变化" prop="fvalue"></el-table-column>
        <el-table-column label="当前成长值" prop="currentTotal"></el-table-column>
        <el-table-column label="备注" prop="remark"> </el-table-column>
        <el-table-column label="操作人" prop="operator"></el-table-column>
      </fat-table>
    </div>
    <value-change-dialog ref="changeDialog" />
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import AppSelect from '@/business-common/components/app-select';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import GrowthTypeSelect from '@/mod-member/src/components/growth-type-select';
  import api from '@/mod-member/src/api/memberAPI';
  import ValueChangeDialog from '../../user-list/value-change-dialog';
  import GrowthChangeMixin from '../../user-list/growth-change-mixin';

  export default {
    name: 'Growth',
    mixins: [GrowthChangeMixin],
    inject: ['refreshUserInfo'],
    components: {
      AppSelect,
      GrowthTypeSelect,
      FatTable,
      ValueChangeDialog,
      DateRangePicker,
    },
    props: {
      info: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        form: {
          appId: null,
          accessType: null,
          dateRange: null,
        },
      };
    },
    methods: {
      async handleFetch(params) {
        const { dateRange, ...other } = this.form;
        if (dateRange) {
          const [createStartTime, createEndTime] = dateRange;
          Object.assign(other, { createStartTime, createEndTime });
        }

        // 分页信息
        const { pagination } = params;
        // 请求参数
        const payload = {
          ...other,
          uniqueAccountId: this.info.uniqueAccountId,

          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        const { data, totalCount } = await api.growthManager.getUserStat(payload);

        return {
          list: data || [],
          total: totalCount,
        };
      },
      handleChangeValue() {
        this.$refs.changeDialog.show({
          valueName: '成长值',
          value: this.info.totalGrowthValue,
          onConfirm: async params => {
            await this.doGrowthChange({ ...params, uniqueAccountId: this.info.uniqueAccountId });
            this.$refs.table.refresh();
            this.refreshUserInfo();
          },
        });
      },
    },
  };
</script>

<style scoped>
  .filters {
    padding: 20px;
  }

  .table {
    padding-bottom: 20px;
  }
</style>
