<template>
  <div class="layout-list" >
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container" style="padding: 0 20px;">
      <el-breadcrumb-item :to="{ path: '/estate/goods-mgr/building/list' }" replace>
        楼盘列表
      </el-breadcrumb-item>
      <el-breadcrumb-item>户型列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="Add-Manage-Button">
      <el-button icon="el-icon-plus" @click="handleAddCoupon" type="primary">新增户型</el-button>
    </div>

    <el-table :data="layoutlist" class="wkt-table" v-loading="isLoading">
      <el-table-column label="户型名称" prop="name"> </el-table-column>

      <el-table-column label="建筑面积" prop="buildArea">
        <template slot-scope="scope">
          <div>
            {{ scope.row.buildArea }}<span class="form-unit">/m<sup>2</sup></span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="参考总价" prop="referencePrice">
        <template slot-scope="scope">
          <div>{{ scope.row.referencePrice | price }}万</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="120px">
        <template slot-scope="scope">
          <a class="dss-link" href="javascript:;" @click="edit(scope.row.itemNo)">编辑</a>
          <a class="table-delete" href="javascript:;" @click="handleRemove(scope.row.itemNo)">删除</a>
        </template>
      </el-table-column>
    </el-table>
<!-- 
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalPlanCount"
      :current-page="pageParams.pageNo"
      :page-size="pageParams.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="wkt-pagination"
    >
    </el-pagination> -->
    <el-pagination
      v-if="totalPlanCount"
      :hide-on-single-page="true"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-size="pageParams.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      layout="sizes, prev, pager, next"
      :total="totalPlanCount">
    </el-pagination>
  </div>
</template>

<script>
import layoutApi from '@/dss-wechat3rd/src/api/estate/layout.js';
import couponEnum from '@/dss-wechat3rd/src/constants/couponEnum.js';
export default {
  name: 'index',
  components: {},
  data() {
    return {
      couponEnum,
      layoutlist: [],
      totalPlanCount: 0,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      isLoading: false,
      activityNum: -1,
      hasActivity: false,
      estateItemNo: this.$route.query.estateItemNo
    };
  },

  mounted() {
    this.doSearch();
  },

  methods: {
    doSearch(key) {
      this.isLoading = true;
      layoutApi
        .list({
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          estateItemNo: this.estateItemNo
        })
        .then(rs => {
          this.layoutlist = rs.data || [];
          this.totalPlanCount = rs.totalCount;
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
      this.$router.push({
        path: '/estate/goods-mgr/building/list/layout/add',
        query: { estateItemNo: this.estateItemNo }
      });
    },

    edit(itemNo) {
      this.$router.push({
        path: '/estate/goods-mgr/building/list/layout/add',
        query: { estateItemNo: this.estateItemNo, itemNo: itemNo }
      });
    },

    handleRemove(itemNo) {
      this.$confirm('确定删除户型吗？', '删除户型', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          layoutApi
            .delete({
              itemNo: itemNo
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
.layout-list {
  // padding: 20px;
  // .new-coupon-opt-box {
  //   text-align: right;
  //   margin-top: 20px;
  // }
  .dss-link:last-child {
    padding: 0 10px;
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
