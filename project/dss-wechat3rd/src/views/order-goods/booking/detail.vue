<template>
  <div>
    <page-header>清单详情</page-header>
    <div class="container">
      <div class="section">
        <el-breadcrumb class="breadcrumb">
          <el-breadcrumb-item to="/order-goods/list">订货清单</el-breadcrumb-item>
          <el-breadcrumb-item>清单详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="section-info" v-loading="loading">
          <div class="section-info-item">清单编号：{{ orderInfo.purchaseOrderNoStr }}</div>
          <div class="section-info-item">下单时间：{{ orderInfo.createTime | formatDate }}</div>
          <div class="section-info-item">订单状态：{{ orderInfo.orderStatus | formatStatus }}</div>
          <div class="section-info-item">总金额：{{ orderInfo.payFee | price }}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">经销商信息</div>
        <div class="section-info" v-loading="loading">
          <div class="section-info-item">经销商编码：{{ dealerInfo.dealerNo }}</div>
          <div class="section-info-item">经销商名称：{{ dealerInfo.dealerName }}</div>
          <div class="section-info-item">经销商手机号：{{ dealerInfo.dealerPhone }}</div>
          <div class="section-info-item">经销商所属区域：{{ dealerInfo.region }}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">商品信息</div>
        <el-table class="table" v-loading="loading" :data="tableList">
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column label="商品名称" prop="itemName" />
          <el-table-column label="商品编码" prop="itemNoStr" min-width="200" />
          <el-table-column label="商品单位" prop="itemUnit" />
          <el-table-column label="单价" prop="salePrice">
            <template slot-scope="scope">
              {{ scope.row.salePrice | price }}
            </template>
          </el-table-column>
          <el-table-column label="数量" prop="itemCount" />
          <el-table-column label="金额" prop="payFee">
            <template slot-scope="scope">
              {{ (scope.row.payFee * scope.row.itemCount) | price }}
            </template>
          </el-table-column>
          <el-table-column label="商品图片" prop="thumbnail">
            <template slot-scope="scope">
              <img class="thumbnail" :src="scope.row.thumbnail" />
            </template>
          </el-table-column>
          <el-table-column label="商品分类" prop="itemCategoryName" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/dss-wechat3rd/src/components/page-header';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';

export default {
  components: { PageHeader },
  data() {
    return {
      orderInfo: {},
      dealerInfo: {},
      tableList: [],
      loading: false
    };
  },

  filters: {
    formatDate(val) {
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    },
    formatStatus(val) {
      let status = '-';
      switch (val) {
        case 0:
          status = '待确认';
          break;
        case 1:
          status = '已确认';
          break;
        case 2:
          status = '已取消';
          break;
        case 3:
          status = '已删除';
          break;
      }
      return status;
    }
  },

  mounted() {
    const orderNo = this.$route.query.orderNo || '';
    this.fetchOrderData(orderNo);
  },

  methods: {
    fetchOrderData(orderNo) {
      if (!orderNo) return;
      this.loading = true;
      const params = {
        purchaseOrderNoStr: orderNo
      };

      services
        .get(constants.Api.purchaseOrder.orderDetail, {
          params,
          action: '订单详情'
        })
        .then(res => {
          const info = res.data || {};
          if (info && info.purchaseOrderNoStr) {
            this.orderInfo = {
              purchaseOrderNoStr: info.purchaseOrderNoStr,
              payFee: info.payFee,
              orderStatus: info.orderStatus,
              createTime: info.createTime
            };
            this.dealerInfo = {
              dealerName: info.dealerDTO.dealerName || '-',
              dealerNo: info.dealerDTO.dealerNo || '-',
              dealerPhone: info.dealerDTO.dealerPhone || '-',
              region: info.dealerDTO.region || '-'
            };
            this.tableList = info.itemList;
            return;
          }
          this.orderInfo = {};
          this.dealerInfo = {};
          this.tableList = [];
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.breadcrumb {
  margin-bottom: 10px;
}

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
