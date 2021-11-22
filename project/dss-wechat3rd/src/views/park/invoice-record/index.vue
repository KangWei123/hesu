<template>
  <list-page-layout class="app-list-container">
    <template #filters>
      <el-form ref="query" class="nav-form" @submit.prevent.native="$refs.query.search()" :model="form" inline>
        <el-form-item label="开票时间：" prop="dateRange">
          <el-date-picker
            class="el-form-item-view dss-filter-input"
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="开票抬头：" prop="fuzzyBuyerTaxCompany">
          <el-input
            style="width: 260px"
            maxlength="50"
            v-model.trim="form.fuzzyBuyerTaxCompany"
            clearable
            placeholder="搜索开票抬头"
          ></el-input>
        </el-form-item>

        <el-form-item label="开票税号：" prop="fuzzyBuyerTaxNo">
          <el-input
            style="width: 260px"
            maxlength="30"
            v-model.trim="form.fuzzyBuyerTaxNo"
            clearable
            placeholder="搜索开票税号"
          ></el-input>
        </el-form-item>

        <el-form-item label="开票状态：" prop="openStatus">
          <el-select v-model="form.openStatus" class="el-form-item-view" placeholder="请选择开票状态">
            <el-option
              v-for="(item, index) in orderStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发票单号：" prop="invoiceCenterOrderNo">
          <el-input
            style="width: 260px"
            maxlength="30"
            v-model.trim="form.invoiceCenterOrderNo"
            clearable
            placeholder="搜索发票单号"
          ></el-input>
        </el-form-item>

        <el-form-item label="业务单号：" prop="businessOrderNo">
          <el-input
            style="width: 260px"
            maxlength="30"
            v-model.trim="form.businessOrderNo"
            clearable
            placeholder="搜索业务单号"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <el-button @click="handleExport" class="export-btn">导出发票记录</el-button>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="发票单号" prop="invoiceCenterOrderNo"></el-table-column>
      <el-table-column label="业务单号" prop="businessOrderNo"></el-table-column>
      <el-table-column label="项目" prop="storeName"></el-table-column>
      <el-table-column label="合并开票订单数">
        <template slot-scope="scope">
          <div>{{ scope.row.combineOrderNum }}</div>
        </template>
      </el-table-column>
      <el-table-column label="合计开票金额" prop="totalAmount">
        <template slot-scope="scope">
          <div>{{ scope.row.totalAmount | price }}</div>
        </template>
      </el-table-column>
      <el-table-column label="开票项目" prop="invoiceItem"></el-table-column>
      <el-table-column label="开票类型" prop="titleType">
        <template slot-scope="scope">
          <div v-if="scope.row.titleType === 0">企业</div>
          <div v-else>个人</div>
        </template>
      </el-table-column>
      <el-table-column label="开票抬头" prop="buyerTaxCompany"></el-table-column>
      <el-table-column label="开票税号" prop="buyerTaxNo"></el-table-column>
      <el-table-column label="开票状态" prop="openStatus">
        <template slot-scope="scope">
          <div>{{ getDesc(scope.row.openStatus) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="开票时间" prop="invoiceTime"></el-table-column>
    </fat-table>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">信息正在导出，请等候...</span>
    </el-dialog>
  </list-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park.js';
  import { timeFormat } from '@/business-common/filters/date-format-filters';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import exportExcel from '@/dss-common/utils/exportExcel';

  export default {
    name: 'InvoiceRecord',
    components: { FatTable, ListPageLayout, TableActions },
    data() {
      return {
        showTipDialog: false,
        orderStatusList: [
          {
            value: null,
            label: '全部',
          },
          {
            value: 0,
            label: '开票中',
          },
          {
            value: 1,
            label: '开票成功',
          },
          {
            value: 2,
            label: '开票失败',
          },
          {
            value: 3,
            label: '开票取消',
          },
        ],
        form: {
          keyword: '',
          openStatus: null,
          businessOrderNo: null,
          invoiceCenterOrderNo: null,
          dateRange: [],
        },
      };
    },

    methods: {
      getDesc(openStatus) {
        const row =
          this.orderStatusList.find(item => {
            return openStatus === item.value;
          }) || {};
        return row.label;
      },

      handleExport() {
        this.$confirm('确定导出发票记录报表吗？', '导出发票记录', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
          closeOnClickModal: false,
        })
          .then(() => {
            const params = {
              ...this.form,
            };
            if (params.dateRange && params.dateRange.length) {
              params.createTimeStart = timeFormat(params.dateRange[0], 'YYYY-MM-DD 00:00:00');
              params.createTimeEnd = timeFormat(params.dateRange[1], 'YYYY-MM-DD 23:59:59');
            }
            delete params.dateRange;
            Object.keys(params).forEach(key => {
              if (params[key] === null || params[key] === '') {
                delete params[key];
              }
            });
            this.showTipDialog = true;
            exportExcel
              .download(parkApi.exportInvoiceData, params, '发票记录报表')
              .then(res => {
                this.$message({
                  message: '导出发票记录报表成功，正在下载',
                  type: 'success',
                });
                this.showTipDialog = false;
              })
              .catch(err => {
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            this.$message.info('取消导出');
            this.showTipDialog = false;
          });
      },

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
        };
        if (params.dateRange && params.dateRange.length) {
          params.createTimeStart = timeFormat(params.dateRange[0], 'YYYY-MM-DD  00:00:00');
          params.createTimeEnd = timeFormat(params.dateRange[1], 'YYYY-MM-DD 23:59:59');
        }
        delete params.dateRange;
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '') {
            delete params[key];
          }
        });
        const { data: list, totalCount: total } = await parkApi.query_invoice_records(params);
        return { list: list || [], total };
      },
    },
  };
</script>

<style scoped lang="less">
  .export-btn {
    margin: 20px 20px 0 20px;
  }
</style>
