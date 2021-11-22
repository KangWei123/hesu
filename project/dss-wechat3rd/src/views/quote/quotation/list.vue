<template>
  <div class="container">
    <div class="live-filter">
      <el-form @submit.native.prevent inline class="wkt-opt-label-container goods-list-filter">
        <el-form-item label="报价人">
          <el-input
            placeholder="请输入员工姓名"
            size="mini"
            v-model.trim="filterForm.employeeName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="客户">
          <el-input placeholder="请输入客户名称" size="mini" v-model.trim="filterForm.clientName" clearable></el-input>
        </el-form-item>
        <el-form-item label="报价单名称">
          <el-input
            placeholder="请输入报价单名称"
            size="mini"
            v-model.trim="filterForm.quotationName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="报价单单号">
          <el-input
            placeholder="请输入报价单单号"
            size="mini"
            v-model.trim="filterForm.outOrderNo"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="single-search-btn" type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="goods-list">
      <el-table :data="tableList" style="width: 100%" class="wkt-table" v-loading="loading">
        <el-table-column prop="createTime" label="创建日期">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="报价人"></el-table-column>
        <el-table-column prop="clientName" label="客户"></el-table-column>
        <el-table-column prop="outOrderNo" label="报价单单号"></el-table-column>
        <el-table-column prop="quotationName" label="报价单名称"></el-table-column>
        <el-table-column prop="totalFee" label="总金额">
          <template slot-scope="scope">{{ scope.row.totalFee | price }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a class="table-href" href="javascript:;" @click="gotoDetail(scope.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :page-size="pageParams.pageSize"
        :total="totalCount"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';

export default {
  name: 'quotation-list',
  data() {
    return {
      loading: false,
      filterForm: {
        startTime: null,
        endTime: null,
        clientName: null, // 客户名称
        employeeName: null, // 报价员工名称
        quotationName: null, // 报价单名称
        outOrderNo: null // 外部订单好
      },
      tableList: [],
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      totalCount: 0
    };
  },

  filters: {
    formatDate(val) {
      if (!val) return '';
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchList(); // 根据商品类型获取门店下的商品列表
    });
  },

  methods: {
    // 搜索
    handleSearch() {
      this.fetchList();
    },
    fetchList() {
      this.loading = true;
      const params = { ...this.pageParams, ...this.filterForm };
      const url = constants.Api.quote.quotationList;
      services
        .get(url, {
          params,
          action: '报价单列表'
        })
        .done(res => {
          this.totalCount = res.totalCount || 0;
          this.tableList = res.data || [];
        })
        .always(() => {
          this.loading = false;
        });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchList();
    },
    gotoDetail(row) {
      this.$router.push({
        path: '/quote/list/detail',
        query: {
          id: row.id
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.goods-list {
  padding: 10px 0;
}
</style>