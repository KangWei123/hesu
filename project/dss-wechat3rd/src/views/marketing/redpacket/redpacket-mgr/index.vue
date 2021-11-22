<template>
  <div class="redpacke-list">

    <div class="Add-Manage-Button">
      <el-button @click="handleAddRedPacket"
                 icon="el-icon-plus"
                 type="primary">新建方案
      </el-button>
    </div>

    <div class="redpacke-list-card" v-loading="isLoading">
      <div class="redpacket-tips">注意：创建方案后，裂变红包以弹窗形式出现，如同时配置新客进店好礼，优先显示新客进店好礼</div>
      <el-table :data="redpacketlist"
                class="wkt-table">
        <el-table-column label="活动名称"
                         prop="name">
        </el-table-column>

        <el-table-column prop="startTime"
                         label="开始时间"
                         :formatter="timeFormatter"
                         min-width="100"></el-table-column>

        <el-table-column prop="endTime"
                         label="结束时间"
                         :formatter="timeFormatter"
                         min-width="100"></el-table-column>

        <el-table-column label="红包总额">
          <template slot-scope="scope">
            ￥{{ scope.row.totalFee |price}}
          </template>
        </el-table-column>

        <el-table-column label="拆红包人数"
                         prop="quantity">
        </el-table-column>

        <el-table-column label="红包门槛">
          <template slot-scope="scope">
            <span v-if="scope.row.thresholdFee===redpacketEnum.thresholdFee.NOTHRESHOLD">无门槛</span>
            <span v-else>满 {{ scope.row.thresholdFee | price}} 元可用</span>
          </template>
        </el-table-column>

        <el-table-column label="发起次数"
                         prop="launchTimesLimit">
        </el-table-column>

        <el-table-column label="状态"
                         prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status==-1">未开始</span>
            <span v-if="scope.row.status==1">开启中</span>
            <span v-if="scope.row.status==2">已结束</span>
            <span v-if="scope.row.status==0">已删除</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="170">
          <template slot-scope="scope">
            <a href="javascript:;"
               @click="handleDetail(scope.row.id)">详情</a>
            <a href="javascript:;"
               @click="handleRemove(scope.row.id)">删除</a>
            <a v-if="scope.row.status==1 ||scope.row.status==-1"
               href="javascript:;"
               @click="handleStop(scope.row.id)">结束</a>
            <a v-if="scope.row.status==2"
               href="javascript:;"
               @click="handleStart(scope.row.id)">开启</a>
          </template>
        </el-table-column>

      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange">
      </el-pagination> -->

      <el-pagination
          v-if="totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
          layout="sizes, prev, pager, next"
          :total="totalCount">
        </el-pagination>
    </div>

  </div>
</template>

<script>
import './index.less';
import redpacketApi from '@/dss-wechat3rd/src/api/redpacketApi.js';
import redpacketEnum from '@/dss-wechat3rd/src/constants/redpacketEnum.js';
import utils from '@/dss-common/utils/index';
export default {
  name: 'redpacketplan',
  components: {},
  data() {
    return {
      redpacketEnum,
      redpacketlist: [],
      isLoading: false,
      totalCount: 0,
      pageParams: {
        pageNo: 1,
        pageSize: 10
      }
    };
  },

  mounted() {
    this.doSearch();
  },

  methods: {
    /**
     * 格式化时间
     */
    timeFormatter(row, column, cellValue, index) {
      return utils.timeFormat(cellValue);
    },
    doSearch: function(key) {
      this.isLoading = true;
      redpacketApi
        .list(this.pageParams)
        .then(rs => {
          this.redpacketlist = rs.data || [];
          this.totalCount = rs.totalCount;
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

    warnTip(msg) {
      this.$message({
        message: msg,
        type: 'warning'
      });
    },

    successTip(msg) {
      this.$message({
        message: msg,
        type: 'success'
      });
    },
    //跳转页面装修
    toMiniIndex() {
      this.$router.switchPage('/setting/homedecorate');
    },
    handleAddRedPacket() {
      let hasLived = false;
      this.redpacketlist.forEach(item => {
        if (item.status == 1 || item.status == -1) {
          hasLived = true;
        }
      });
      if (hasLived) {
        this.warnTip('同一时间只能开启一个红包，请结束活动后再新建红包');
      } else {
        this.$router.push({
          path: '/marketing/redpacket/redpacket-mgr/edit'
        });
      }
    },

    handleStart(planId) {
      let hasLived = false;
      this.redpacketlist.forEach(item => {
        if (item.status == 1 || item.status == -1) {
          hasLived = true;
        }
      });
      if (hasLived) {
        this.warnTip('同一时间只能开启一个红包');
      } else {
        this.isLoading = true;
        redpacketApi
          .startPlan({
            planId: planId
          })
          .then(rs => {
            this.successTip('开启成功!');
            this.doSearch();
          })
          .always(() => {
            this.isLoading = false;
          });
      }
    },

    handleStop(planId) {
      this.$confirm('确定结束红包方案吗？', '结束方案', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.isLoading = true;
          redpacketApi
            .stopPlan({
              planId: planId
            })
            .then(rs => {
              this.successTip('结束成功!');
              this.doSearch();
            })
            .always(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          console.log('取消结束');
        });
    },

    handleDetail(planId) {
      this.$router.push({ path: '/marketing/redpacket/redpacket-mgr/edit', query: { planId: planId } });
    },

    handleRemove(planId) {
      this.$confirm('确定删除红包方案吗？', '删除方案', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.isLoading = true;
          redpacketApi
            .deletePlan({
              planId: planId
            })
            .then(rs => {
              this.successTip('删除成功!');
              this.doSearch();
            })
            .always(() => {
              this.isLoading = false;
            });
        })
        .catch(() => {
          console.log('取消删除');
        });
    }
  }
};
</script>
