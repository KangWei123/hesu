<template>
  <div class="wkt-card recharge-record"
       v-loading="loading">
    <div class="title">
      短信记录：
    </div>

    <el-table class="wkt-table"
              :data="records">
      <el-table-column prop="createTime"
                       label="变更时间">
        <template slot-scope="scope">
          {{scope.row.createTime | time}}
        </template>
      </el-table-column>

      <el-table-column prop="amount"
                       label="条数">
        <template slot-scope="scope">
          <span :style="{color: scope.row.type === 1 ? 'rgba(255,155,45,1)': 'rgba(55,190,143,1)'}">
            {{ (scope.row.type === 1 ? '+': '-') + scope.row.amount}}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="remark"
                       label="原因">
      </el-table-column>
    </el-table>

    <el-pagination layout="prev, pager, next, jumper, sizes, total"
                   :total="totalRecordsCount"
                   :current-page="pageParams.pageNo"
                   :page-size="pageParams.pageSize"
                   :page-sizes="[5, 10, 20, 30, 40, 50]"
                   @size-change="onSizeChange"
                   @current-change="onPageChange">
    </el-pagination>
  </div>
</template>

<script>
import SMSGroupApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
// import recordList from './mockWaterList.js';

export default {
  data() {
    return {
      loading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 5
      },
      records: [],
      totalRecordsCount: 0
    };
  },

  mounted() {
    this.getRechargeRecords();
    // mock 数据
    // this.records = recordList.data;
    // this.totalRecordsCount = recordList.totalCount;
  },

  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.getRechargeRecords();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getRechargeRecords();
    },

    // 这里的type，1：充值， 0:消耗，原型图里没有
    getRechargeRecords() {
      console.log('getRechargeRecords');
      this.loading = true;
      let params = {
        ...this.pageParams
      };
      SMSGroupApi.querySMSRechargesWaterList(params)
        .then(res => {
          console.log('getRechargeRecords', res);
          this.records = res.data || [];
          this.totalRecordsCount = res.totalCount;
        })
        .catch(err => {
          console.error('querySMSPackages', err);
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
.recharge-record {
  .title {
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(52, 52, 52, 1);
    line-height: 20px;
  }
}
</style>
