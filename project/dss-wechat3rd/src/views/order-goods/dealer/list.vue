<template>
  <div>
    <page-header>经销商列表</page-header>
    <list-filter @filter="handleFilter" />
    <div class="table">
      <el-table :data="dealerList" v-loading="loadingList">
        <el-table-column width="80" label="序号" type="index" />
        <el-table-column label="经销商名称" prop="dealerName" />
        <el-table-column label="经销商编码" prop="dealerNo" />
        <el-table-column label="经销商手机" prop="dealerPhone" />
        <el-table-column label="经销商所属区域" prop="region" />
        <el-table-column label="所属运营中心" prop="operationCenter" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a @click="goDetail(scope.row)">详情</a>
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
        class="wkt-pagination" />
    </div>
  </div>
</template>

<script>
import PageHeader from '@/dss-wechat3rd/src/components/page-header';
import ListFilter from './list-filter';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';

export default {
  components: { ListFilter, PageHeader },

  data() {
    return {
      loadingList: false,
      params: {}, // 筛选条件
      dealerList: [], // 经销商清单列表数据
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      totalOrderCount: 0
    };
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData(); // 获取经销商列表
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
        .get(constants.Api.purchaseOrder.dealerList, {
          params,
          action: '经销商列表'
        })
        .then(res => {
          const dealerList = res.data || [];
          this.dealerList = dealerList;
          this.totalOrderCount = res.totalCount;
        })
        .always(() => {
          this.loadingList = false;
        });
    },

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
    // 查看详情
    goDetail(row) {
      this.$router.push({
        path: '/order-goods/dealer-list/detail',
        query: {
          dealerId: row.id,
          dealerNo: row.dealerNo
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.table {
  padding: 20px;
}
</style>