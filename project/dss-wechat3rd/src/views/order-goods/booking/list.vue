<template>
  <div>
    <page-header>订货清单</page-header>
    <list-filter @filter="handleFilter" ref="filter" />
    <div class="export">
      <el-button @click="handleBatchExport">批量导出订单</el-button>
      <el-button @click="handleExport">一键导出</el-button>
      <el-button type="primary" @click="onBatchConfirm">确认订单</el-button>
    </div>
    <div class="table">
      <el-table ref="multipleTable" :data="orderList" v-loading="loadingList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="订单编号" prop="purchaseOrderNoStr" min-width="200" />
        <el-table-column label="创建日期" prop="createTime" min-width="150">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="orderStatus">
          <template slot-scope="scope">
            <div v-if="scope.row.orderStatus === 0">待确认</div>
            <div v-else-if="scope.row.orderStatus === 1">已确认</div>
            <div v-if="scope.row.orderStatus === 2">已取消</div>
            <div v-if="scope.row.orderStatus === 3">已删除</div>
          </template>
        </el-table-column>
        <el-table-column label="经销商" prop="dealerDTO">
          <template slot-scope="scope">
            {{ scope.row.dealerDTO && scope.row.dealerDTO.dealerName ? scope.row.dealerDTO.dealerName : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="经销商所属区域">
          <template slot-scope="scope">
            {{ scope.row.dealerDTO && scope.row.dealerDTO.region ? scope.row.dealerDTO.region : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="所属营运中心">
          <template slot-scope="scope">
            {{ scope.row.dealerDTO && scope.row.dealerDTO.operationCenter ? scope.row.dealerDTO.operationCenter : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="总金额" prop="payFee">
          <template slot-scope="scope">
            {{ scope.row.payFee | price }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="id">
          <template slot-scope="scope">
            <a @click="goDetail(scope.row)">详情</a>
            <a v-if="scope.row.orderStatus === 0" @click="onConfirm(scope.row)">确认</a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalOrderCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        :page-sizes="[10, 30, 50, 100, 500]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/dss-wechat3rd/src/components/page-header';
import ListFilter from './list-filter';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';
import exportExcel from '@/dss-common/utils/exportExcel.js';
// import { mapState } from 'vuex';

export default {
  components: {
    PageHeader,
    ListFilter
  },

  filters: {
    formatDate(val) {
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  data() {
    return {
      loadingList: false,
      params: {}, // 筛选条件
      orderList: [], // 订货清单列表数据
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      totalOrderCount: 0,
      selection: []
    };
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData(); // 获取订单列表
    });
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    // 查询列表
    fetchData() {
      const params = {
        ...this.params,
        ...this.pageParams
      };
      this.loadingList = true;

      services
        .get(constants.Api.purchaseOrder.orderList, {
          params,
          action: '订单列表'
        })
        .then(res => {
          const orderList = res.data || [];
          // orderList.forEach(order => {
          //   order.checked = false;
          // });
          this.orderList = orderList;
          this.totalOrderCount = res.totalCount;

          this.selection = [];
        })
        .always(() => {
          this.loadingList = false;
        });
    },

    // 列表筛选
    handleFilter(filter) {
      this.pageParams.pageNo = 1;
      this.params = filter;
      this.fetchData();
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchData();
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchData();
    },

    handleSelectionChange(val) {
      this.selection = val;
    },

    // 确认订单
    async onConfirm(row) {
      const params = {
        purchaseOrderId: row.id
      };
      try {
        this.loadingList = true;
        await services.post(constants.Api.purchaseOrder.orderConfirm, params, { action: '确认订单' });
        this.$message({ message: '订单确认成功', type: 'success' });
        this.fetchData();
      } finally {
        this.loadingList = false;
      }
    },

    // 批量确定订单
    async onBatchConfirm() {
      const selectedList = this.selection.filter(i => i.orderStatus === 0);

      if (selectedList.length === 0) {
        this.$message({ message: '请选择需要确定的订单', type: 'error' });
        return;
      }

      // 筛选待确认的订单
      const purchaseOrderIds = selectedList.map(i => i.id).join(',');

      try {
        this.loadingList = true;
        await services.post(
          constants.Api.purchaseOrder.orderBatchConfirm + '?purchaseOrderIds=' + purchaseOrderIds,
          null,
          { action: '批量确认订单' }
        );

        this.fetchData();
      } finally {
        this.loadingList = false;
      }
    },

    // 查看详情
    goDetail(row) {
      this.$router.push({
        path: '/order-goods/list/detail',
        query: {
          orderId: row.id,
          orderNo: row.purchaseOrderNoStr
        }
      });
    },

    // 一键导出
    async handleExport() {
      const filter = this.$refs.filter.getFilter();
      try {
        await exportExcel.getDownload(constants.Api.purchaseOrder.orderExport, this.$refs.filter.getFilter());
        this.$message({ message: '文件导出成功下载中', type: 'success' });
      } catch (e) {
        this.$message({ message: '导出失败', type: 'error' });
      }
    },

    // 批量导出
    async handleBatchExport() {
      if (this.selection.length === 0) {
        this.$message({ message: '请选择需要导出的数据', type: 'error' });
        return;
      }

      const idList = this.selection.map(i => i.id).join(',');
      try {
        await exportExcel.getDownload(constants.Api.purchaseOrder.orderExport, { idList });
        this.$message({ message: '文件导出成功下载中', type: 'success' });
      } catch (e) {
        this.$message({ message: '导出失败', type: 'error' });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.table {
  padding: 20px;
  padding-top: 0;
}

.export {
  margin: 20px;
  margin-bottom: 0;
}
</style>
