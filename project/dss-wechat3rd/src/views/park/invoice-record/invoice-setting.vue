<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="$router.push('/park/invoice-setting/add-invoice')">配置开票</el-button>
    </template>
    <fat-table ref="$tabel" :fetch-handler="getInvoiceSetting">
      <el-table-column
        fixed
        prop="businessTypeStr"
        label="开票业务"
        min-width="100"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="invoicePlatformStr"
        label="开票平台"
        min-width="100"
        width="160"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="taxCompany"
        label="卖方企业名称"
        min-width="100"
        width="340"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="enterpriseAddress"
        label="卖方企业地址"
        min-width="100"
        width="240"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="taxNo"
        label="卖方纳税人识别号"
        min-width="100"
        width="300"
        align="center"
      ></el-table-column>
      <el-table-column prop="tel" label="联系电话" min-width="100" width="180" align="center"></el-table-column>
      <el-table-column prop="operator" label="操作人" min-width="100" width="180" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" min-width="320" align="left">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-switch
            class="invoice-switch"
            v-model="scope.row.status"
            active-text="开启"
            inactive-text="关闭"
            :active-value="1"
            :inactive-value="0"
            active-color="#52C41A"
            @change="changeState(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page/index';

  export default {
    name: 'InvoiceSetting',
    components: {
      ListPageLayout,
      FatTable,
    },
    data() {
      return {
        invoiceList: [],
      };
    },
    methods: {
      async getInvoiceSetting(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };
        const res = await parkApi.invoiceSetting(params);
        this.invoiceList = res.data;
        if (this.invoiceList && this.invoiceList.length !== 0) {
          this.invoiceList.forEach(item => {
            item.invoicePlatformStr = item.invoicePlatform === 0 ? '中税' : '';
            item.businessTypeStr = item.businessType === 0 ? '停车场' : '';
          });
        }
        return { list: this.invoiceList, total: res.totalCount };
      },
      changeState(e) {
        const params = {
          ...e,
        };
        params.status = e.status ? 1 : 0;
        parkApi
          .updateStatus({
            id: params.id,
            status: params.status,
          })
          .then(() => {
            this.$refs.$tabel.search();
          })
          .catch(err => {
            console.error(err);
            this.$refs.$tabel.search();
          });
      },
      edit(obj) {
        this.$router.push({ path: '/park/invoice-setting/add-invoice?id=' + obj.id });
      },
    },
  };
</script>

<style lang="less" scoped>
  .invoice-switch {
    margin-left: 40px;
  }
</style>
