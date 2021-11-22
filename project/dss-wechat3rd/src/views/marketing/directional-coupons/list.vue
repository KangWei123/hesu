<template>
  <div class="directional-coupons-list" v-loading="loading">
    <div class="Add-Manage-Button">
      <el-button icon="el-icon-plus" type="primary" @click="$router.push('/marketing/directional-cp/add')">
        新建群发
      </el-button>
    </div>
    <div class="table-list-container">
      <el-table :data="directionalList" class="wkt-table">
        <el-table-column label="活动名称">
          <template slot-scope="scope" :title="scope.row.name">
            <span class="ellipsis">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="群发时间" width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="接收人群">
          <template slot-scope="scope">
            <!--群发优惠券不是批量导入创建的-->
            <span
              v-if="scope.row.filterType < 4"
              class="ellipsis"
              :title="
                scope.row.filterUserLevelNames || scope.row.filterUserLabelNames || scope.row.filterMonth || '全部'
              "
            >
              {{ scope.row.filterUserLevelNames || scope.row.filterUserLabelNames || scope.row.filterMonth || '全部' }}
            </span>
            <!--是批量导入创建的-->
            <span v-else class="ellipsis" :title="scope.row.filterType === 4 ? '批量导入手机号' : '批量导入用户ID'">
              {{ scope.row.filterType === 4 ? '批量导入的手机号' : '批量导入的用户ID' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="优惠券">
          <template slot-scope="scope">
            <div
              v-for="(couponName, index) in couponNames(scope.row)"
              :key="index"
              class="ellipsis"
              :title="couponName"
            >
              {{ couponName }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="人数" width="120" prop="quantity"> </el-table-column>

        <el-table-column label="短信通知" width="120">
          <template slot-scope="scope">
            <span>{{ sms(scope.row) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="执行状态">
          <template slot-scope="scope">
            <span>{{ executeStatus[scope.row.executeStatus] }}</span>
            <div v-if="scope.row.executeStatus === executeStatusEnum.fail && scope.row.errorMessage">
              {{ scope.row.errorMessage }}
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalListCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      >
      </el-pagination> -->

      <el-pagination
          v-if="totalListCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          layout="sizes, prev, pager, next"
          :total="totalListCount">
        </el-pagination> 
    </div>
  </div>
</template>

<script>
import marketingApi from '@/dss-wechat3rd/src/api/marketingAPI.js';
import { SendMsgType } from './enum.js';

const executeStatus = {
  0: '等待执行',
  1: '执行中',
  2: '执行成功',
  3: '执行失败',
  5: '检索人群包中',
  6: '检索人群包完成，等待发送'
};
const executeStatusEnum = {
  wait: 0,
  going: 1,
  success: 2,
  fail: 3,
  checking: 5,
  checkingSuccess: 6
};
export default {
  name: 'ListDirectionalCoupons',
  data() {
    return {
      executeStatus,
      executeStatusEnum,
      loading: false,
      totalListCount: 0,
      directionalList: null,
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      }
    };
  },
  computed: {
    sms() {
      return function(item) {
        return item.sendSmsType === SendMsgType.NO ? '无' : '送达：' + (item.smsCount || 0);
      };
    },
    couponNames() {
      return function(item) {
        const couponNameStr = item.couponNames;
        if (couponNameStr) {
          const couponNamesArr = couponNameStr.split(',');
          if (couponNamesArr && couponNamesArr.length) {
            return couponNamesArr;
          }
        }
        return [];
      };
    }
  },
  mounted() {
    this.fetchDirectionalList();
  },
  methods: {
    fetchDirectionalList() {
      this.loading = true;
      const params = { ...this.pageParams };
      marketingApi
        .fetchDirectionalCouponsList(params)
        .then(res => {
          this.directionalList = res.data || [];
          this.totalListCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },
    handleDelItem(id) {
      const params = { couponBatchPlanId: id };
      marketingApi.deleteDirectionalCoupons(params).then(res => {
        this.fetchDirectionalList();
      });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchDirectionalList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchDirectionalList();
    }
  }
};
</script>

<style lang="less">
.directional-coupons-list {
  .table-list-container {
    // padding: 0 20px 20px;
    margin-top: 16px;
    background: #fff;
    .el-table {
      padding-top: 0px;
    }
  }
}
</style>
