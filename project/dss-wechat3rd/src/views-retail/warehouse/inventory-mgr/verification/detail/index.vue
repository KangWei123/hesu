/*
 * @Author: Neexz
 * @Date: 2018-11-05 16:03:22
 * @Last Modified by: Neexz
 * @Last Modified time: 2018-11-09 10:21:23
 */

<template>
  <div class="verification-detail-container">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/verification' }">库存盘点</el-breadcrumb-item>
      <el-breadcrumb-item>盘点详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="verification-detail-content">
      <div class="desc">
        <el-row class="row_num__1">
          <span class="cell">
            制单号: {{verificationDetail.invoiceNo}}
          </span>

          <span class="cell">
            仓库: {{verificationDetail.warehouseName}}
          </span>

          <span class="cell">
            经办人: {{verificationDetail.operator}}
          </span>
        </el-row>

        <el-row class="time">
          制单时间: {{formatTimeWithHour(verificationDetail.createTime)}}
        </el-row>

        <el-row class="remark">
          备注: {{verificationDetail.remark}}
        </el-row>
      </div>

      <goods-table :goods-list="verificationDetail.itemList"
                   class="goods-table">
      </goods-table>
    </div>
  </div>
</template>

<script>
// import mockVerificationDetailData from '../mock/verificationDetail.js';
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import dateUtils from '@/dss-common/utils/date.js';
import GoodsTable from './goodsTable.vue';

export default {
  components: {
    GoodsTable
  },

  data() {
    return {
      verificationDetail: {}
    };
  },

  mounted() {
    // 获取盘点详情数据
    this.getVerificationDetail(this.$route.query.id);

    // mock data
    // this.verificationDetail = mockVerificationDetailData.data;
  },

  methods: {
    getVerificationDetail(verificationId) {
      let params = {
        reviewId: verificationId
      };
      inventoryMgrAPI
        .getVerificationDetail(params)
        .then(res => {
          console.log('getVerificationDetail -->', JSON.stringify(res.data));
          this.verificationDetail = res.data || {};
        })
        .catch(err => {
          console.error('getVerificationDetail error', err);
        });
    },

    formatTimeWithHour(date) {
      if (date) {
        return dateUtils.format(new Date(date));
      }
      return '';
    }
  }
};
</script>

<style lang="less" scope>
 @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度
.verification-detail-container {
  background: #fff;
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 10px);
  .verification-detail-content {
    padding: 20px;
  }
  .desc {
    padding: 10px 10px;
    background-color: rgb(241, 243, 248);

    .row_num__1 {
      .cell {
        margin-right: 80px;
      }
    }

    .time {
      margin-top: 20px;
    }

    .remark {
      margin-top: 20px;
    }
  }

  .goods-table {
    margin-top: 20px;
  }
}
</style>
