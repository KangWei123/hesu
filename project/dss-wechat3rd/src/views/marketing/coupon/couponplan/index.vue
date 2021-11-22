<template>
  <div class="coupon-plan-list">
    <div class="Add-Manage-Button">
      <el-button @click="handleAddCoupon"
                 icon="el-icon-plus"
                 type="primary">新建方案</el-button>
    </div>
    <el-table :data="planlist"
              v-loading="isLoading"
              class="wkt-table">
      <el-table-column label="触发事件">
        <template slot-scope="scope">{{ couponEventType[scope.row.eventType]}}</template>
      </el-table-column>

      <el-table-column label="触发详情"
                       prop="useScope"></el-table-column>

      <el-table-column label="优惠券"
                       prop="name">
        <template slot-scope="scope">
          <div v-for="(item,index) in scope.row.couponList"
               :key="index">
            {{item.couponName}} * {{item.couponAmount}}张
          </div>
        </template>
      </el-table-column>

      <el-table-column label="发放次数限制">
        <template slot-scope="scope">{{ scope.row.quantity===couponEnum.QUANTITY.UNLIMITED?'无限制':scope.row.quantity}}</template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">
            进行中
            <!-- <a href="javascript:;"
               class="table-href"
               @click="handleFinish(scope.row)">
              立即结束
            </a> -->
          </div>
          <span v-else>
            已结束
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="125px">
        <template slot-scope="scope">
          <a class="dss-link"
             href="javascript:;"
             @click="editCoupon(scope.row.id)">详情</a>
          <a class="table-del-a"
             href="javascript:;"
             @click="handleRemove(scope.row.id)">删除</a>
        </template>
      </el-table-column>
    </el-table>

    <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                   :total="totalPlanCount"
                   :current-page="pageParams.pageNo"
                   :page-size="pageParams.pageSize"
                   :page-sizes="[5, 10, 20, 30, 40, 50]"
                   @size-change="onSizeChange"
                   @current-change="onPageChange"
                   class="wkt-pagination">
    </el-pagination> -->

    <el-pagination  v-if="totalPlanCount"
                    :hide-on-single-page="true"
                    @size-change="onSizeChange"
                    @current-change="onPageChange"
                    :page-size="pageParams.pageSize"
                    layout="sizes, prev, pager, next"
                    :total="totalPlanCount">
    </el-pagination> 
  </div>
</template>

<script>
import couponApi from '@/dss-wechat3rd/src/api/couponApi.js';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
export default {
  name: 'couponplan',
  components: {},
  data() {
    return {
      couponEnum,
      couponEventType: {
        [couponEnum.EVENTTYPE.DEFAULT]: '页面转发',
        [couponEnum.EVENTTYPE.CUSTOM]: '购买商品并付款',
        [couponEnum.EVENTTYPE.COMMENT]: '评论图文',
        [couponEnum.EVENTTYPE.RECHARGE_CARD]: '购买充值卡'
      },
      planlist: [],
      totalPlanCount: 0,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      isLoading: false,
      activityNum: -1,
      hasActivity: false
    };
  },

  mounted() {
    this.doSearch();
  },

  methods: {
    doSearch(key) {
      this.isLoading = true;
      couponApi
        .planList({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize
        })
        .then(rs => {
          this.planlist = rs.data || [];
          this.totalPlanCount = rs.totalCount;

          // 是否有正在进行的活动
          if (rs.pageNo === 1) {
            let count = 0;
            this.planlist.forEach(item => {
              if (item.status === 1) {
                count++;
              }
              if (item.eventType === 5) {
                this.hasActivity = true;
              }
            });
            this.activityNum = count;
          }
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.doSearch();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.doSearch();
    },

    handleAddCoupon() {
      // 开放方案限制
      // if (this.activityNum >= 2 && this.hasActivity) {
      //   this.$message('每种方案只能有一个自动发放设置');
      //   return;
      // }
      this.$router.push({
        path: '/marketing/coupon/plan/add'
      });
    },

    editCoupon(couponPlanId) {
      this.$router.push({
        path: '/marketing/coupon/plan/add',
        query: { couponPlanId: couponPlanId }
      });
    },

    handleFinish(item) {
      this.$confirm('确定结束该活动？', '结束优惠券发放活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          // todo 结束活动状态 -> 下期迭代
          // this.apiDeleteActivity();
        })
        .catch(() => {
          console.log('取消结束');
        });
    },

    handleRemove(couponPlanId) {
      this.$confirm('确定删除优惠券方案吗？', '删除方案', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          couponApi
            .deletePlan({
              couponAutoPlanId: couponPlanId
            })
            .then(rs => {
              this.doSearch();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(() => {
          console.log('取消删除方案');
        });
    }
  }
};
</script>

<style lang="less">
.coupon-plan-list {
  background: #fff;
  // padding: 20px;
  .el-table {
    margin-top: -1px;
    padding: 0px;
  }
  .new-coupon-opt-box {
    text-align: right;
  }
  .dss-link:last-child {
    // padding: 0 10px;
  }

  .list-box {
    margin-top: 5px;
  }

  .avatar-size {
    font-size: 40px;
    color: #e4e4e4;
  }

  .table-container {
    padding: 30px 20px;
    background: white;
    margin-bottom: 30px;
  }
  .el-input--mini .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
}

.wkt-warning {
  .el-message-box__status.el-icon-warning {
    color: RGBA(255, 86, 45, 1);
  }
  .el-message-box__status {
    position: absolute;
    top: -19px;
  }
  .el-message-box__status + .el-message-box__message {
    padding-left: 0px;
  }
}
</style>
