<template>
  <div class="cur-activity wkt-card">

    <div class="Add-Manage-Button" v-if="single">
        <el-button type="primary" style="margin-left: 167px;"
                   icon="el-icon-plus"
                   @click="createNewActivity">新建方案</el-button>
        <p class="new-tip"
           v-if="tipShow">* 只能存在一个方案，请先结束旧方案再新建方案</p>
    </div>

    <el-table class="wkt-table"
              :data="activityList" v-loading="loading">
      <el-table-column prop="name"
                       label="活动名称"
                       min-width="120">
      </el-table-column>
      <el-table-column prop="startTime"
                       label="开始时间"
                       min-width="100">
        <template slot-scope="scope">
          {{scope.row.startTime | time}}
        </template>
      </el-table-column>
      <el-table-column prop="endTime"
                       label="结束时间"
                       min-width="100">
        <template slot-scope="scope">
          {{scope.row.endTime | time}}
        </template>
      </el-table-column>
      <el-table-column prop="createTime"
                       label="创建时间"
                       width="180">
        <template slot-scope="scope">
          {{scope.row.createTime | time}}
        </template>
      </el-table-column>
      <el-table-column prop="couponNames"
                       label="包含优惠券"
                       min-width="130">
      </el-table-column>
      <el-table-column prop="issueAmount"
                       width="120"
                       label="领取次数">
      </el-table-column>
      <el-table-column prop="issueAmount"
                       width="100"
                       label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1">
            进行中
          </span>
          <span v-else-if="scope.row.status === 2">
            未开始
          </span>
          <span v-else-if="scope.row.status === 3">
            已过期
          </span>
          <span v-else>
            已结束
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="110"
                       v-if="single">
        <template slot-scope="scope">
          <a v-if="scope.row.status === 1 || scope.row.status === 2"
             href="javascript:;"
             class="table-href"
             @click="handleRemove(scope.row)">
            立即结束
          </a>
          <span v-else-if="scope.row.status === 3">
            已过期
          </span>
          <span v-else>
            已结束
          </span>
        </template>
      </el-table-column>
    </el-table>
<!-- 
    <el-pagination layout="prev, pager, next, jumper, sizes, total"
                   :total="totalActivitiesCount"
                   :current-page="pageParams.pageNo"
                   :page-size="pageParams.pageSize"
                   :page-sizes="[5, 10, 20, 30, 40, 50]"
                   @size-change="onSizeChange"
                   @current-change="onPageChange"
                   class="wkt-pagination">
    </el-pagination> -->

    <el-pagination
          v-if="totalActivitiesCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          layout="sizes, prev, pager, next"
          :total="totalActivitiesCount">
        </el-pagination>
  </div>
</template>

<script>
import NewUserGiftApi from '@/dss-wechat3rd/src/api/marketingAPI.js';

export default {
  props: {
    single: {
      type: Boolean,
      default: true
    },

    queryParams: {
      type: Object,
      default() {
        return null;
      }
    }
  },

  data() {
    return {
      loading: false,
      hasActivity: false,
      tipShow: false,
      totalActivitiesCount: 0,
      activityList: [],
      pageParams: {
        pageNo: 1,
        pageSize: 5
      }
    };
  },

  watch: {
    queryParams(newVal, oldVal) {
      if (!!newVal) {
        this.pageParams.pageNo = 1;
        this.apiQueryActivityRecords();
      }
    }
  },

  mounted() {
    this.apiGetData();
  },

  methods: {
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.apiGetData();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.apiGetData();
    },

    createNewActivity() {
      if (this.hasActivity) {
        this.tipShow = true;
        return;
      }
      this.$router.push('/marketing/new-user-gift/mgr/new');
    },

    handleRemove(item) {
      this.$confirm('确定结束该活动？', '结束新客进店好礼活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.apiDeleteActivity();
        })
        .catch(() => {
          console.log('取消结束');
        });
    },

    apiGetData() {
      if (this.single) {
        this.apiQueryCurActivity();
      } else {
        this.apiQueryActivityRecords();
      }
    },

    apiDeleteActivity() {
      this.loading = true;
      NewUserGiftApi.deleteNewUserGiftActivity()
        .then(res => {
          console.log('apiDeleteActivity --->', JSON.stringify(res.data));
          if (!!res && res.data) {
            this.$message({
              message: '结束成功',
              type: 'success'
            });
            this.tipShow = false;
            this.apiGetData();
          }
        })
        .catch(err => {
          console.error('apiDeleteActivity', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    apiQueryCurActivity() {
      this.loading = true;
      let params = {
        ...this.pageParams
      };
      NewUserGiftApi.queryCurNewUserGiftActivity(params)
        .then(res => {
          this.activityList = res.data || [];
          this.activityList.sort(this.sortByDateDESC('createTime'));
          this.totalActivitiesCount = res.totalCount;

          // 是否有正在进行的活动
          if (res.pageNo === 1) {
            let hasActiivty = this.activityList.find(item => {
              return item.status === 1 || item.status === 2;
            });
            this.hasActivity = !!hasActiivty;
          }
        })
        .catch(err => {
          console.error('apiQueryCurActivity', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    apiQueryActivityRecords() {
      let params = {
        ...this.pageParams,
        ...this.queryParams
      };

      NewUserGiftApi.queryNewUserGiftActivityRecords(params)
        .then(res => {
          console.log('apiQueryActivityRecords --->', JSON.stringify(res.data));
          this.activityList = res.data || [];
          this.activityList.sort(this.sortByDateDESC('createTime'));
          this.totalActivitiesCount = res.totalCount;
        })
        .catch(err => {
          console.error('apiQueryActivityRecords', err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    sortByDateDESC(date) {
      return function(a, b) {
        return b[date] - a[date];
      };
    }
  }
};
</script>

<style lang="less">
.cur-activity {
//   .new-container {
//     margin: 20px 0;
//     text-align: right;
    // .Add-Manage-Button::after {
    //   content: '';
    //   clear: both;
    //   visibility: hidden;
    //   display: block;
    // }

    .new-tip {
      color: red;
      margin-top: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
    }
  // }
}
</style>
