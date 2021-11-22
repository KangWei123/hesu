<template>
  <div>
    <page-header>经销商详情</page-header>
    <div class="section">
      <div class="section-title">经销商基本信息</div>
      <div class="section-info" v-loading="loading">
        <div class="section-info-item">经销商编码：{{ dealerInfo.dealerNo }}</div>
        <div class="section-info-item">经销商名称：{{ dealerInfo.dealerName }}</div>
        <div class="section-info-item">经销商手机号：{{ dealerInfo.dealerPhone }}</div>
        <div class="section-info-item">经销商所属大区：{{ dealerInfo.region }}</div>
        <div class="section-info-item">所属运营中心：{{ dealerInfo.operationCenter }}</div>
        <div class="section-info-item">姓名：{{ dealerInfo.userName }}</div>
        <div class="section-info-item">职位：{{ dealerInfo.position }}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">
        订货下单商品
        <div class="right">
          <el-button type="primary" @click="exportList">导出</el-button>
        </div>
      </div>

      <el-table class="table" :data="tableList" v-loading="loadingTable">
        <el-table-column prop="index" label="序号" type="index" width="80" />
        <el-table-column prop="itemName" label="商品名称" />
        <el-table-column prop="itemNoStr" label="商品编码" min-width="200" />
        <el-table-column prop="itemUnit" label="商品单位" />
        <el-table-column prop="salePrice" label="单价">
          <template slot-scope="scope">
            {{ scope.row.salePrice | price }}
          </template>
        </el-table-column>
        <el-table-column prop="itemTotalCount" label="数量" />
        <el-table-column prop="payFee" label="金额">
          <template slot-scope="scope">
            {{ (scope.row.itemTotalCount * scope.row.payFee) | price }}
          </template>
        </el-table-column>
        <el-table-column prop="thumbnail" label="商品照片">
          <template slot-scope="scope">
            <img class="thumbnail" :src="scope.row.thumbnail" />
          </template>
        </el-table-column>
        <el-table-column prop="itemCategoryName" label="商品分类" />
      </el-table>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/dss-wechat3rd/src/components/page-header';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import exportExcel from '@/dss-common/utils/exportExcel.js';

export default {
  components: {
    PageHeader
  },

  data() {
    return {
      dealerInfo: {},
      tableList: [],
      loading: false,
      loadingTable: false,
      dealerNo: ''
    };
  },

  mounted() {
    const dealerId = this.$route.query.dealerId || '';
    const dealerNo = this.$route.query.dealerNo || '';
    this.dealerNo = dealerNo;
    this.fetchDealerData(dealerId);
    this.fetchDealerItemData(dealerNo);
  },

  methods: {
    fetchDealerData(dealerId) {
      if (!dealerId) return;
      this.loading = true;
      const params = {
        dealerId
      };

      services
        .get(constants.Api.purchaseOrder.dealerDetail, {
          params,
          action: '经销商详情'
        })
        .then(res => {
          const info = res.data || {};
          if (info && info.id) {
            this.dealerInfo = {
              dealerName: info.dealerName || '-',
              dealerNo: info.dealerNo || '-',
              dealerPhone: info.dealerPhone || '-',
              region: info.region || '-',
              operationCenter: info.operationCenter || '-',
              position: info.position || '-',
              userName: info.userName || '-'
            };
            return;
          }
          this.dealerInfo = {};
        })
        .always(() => {
          this.loading = false;
        });
    },

    fetchDealerItemData(dealerNo) {
      if (!dealerNo) return;
      const params = {
        dealerNo
      };
      this.loadingTable = true;
      services
        .get(constants.Api.purchaseOrder.dealerOrderList, {
          params,
          action: '经销商商品列表'
        })
        .then(res => {
          this.tableList = res.data || [];
        })
        .always(() => {
          this.loadingTable = false;
        });
    },

    exportList() {
      if (!this.dealerNo) return;
      const params = {
        dealerNo: this.dealerNo
      };

      exportExcel.getDownload(constants.Api.purchaseOrder.dealerExport, params).always(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.section {
  padding: 20px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }

  .section-title {
    margin-bottom: 8px;
    display: flex;
    font-size: 15px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    // color: #333;

    .right {
      flex: 1;
      justify-content: flex-end;
      display: flex;
    }
  }

  .section-title,
  .table {
    max-width: 1200px;
  }

  .section-info {
    color: #566980;
    font-size: 14px;

    .section-info-item {
      margin-bottom: 10px;
    }
  }

  .table {
    .thumbnail {
      width: 60px;
      height: 60px;
      display: inline-block;
      vertical-align: bottom;
    }
  }
}
</style>