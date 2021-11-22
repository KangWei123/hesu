<template>
  <div class="rvisit-cycle" v-loading="loading">
    <card-title text="客户回访周期" tip-name="visitCycle"></card-title>
    <div class="customer-chart">
      <div class="none-data" v-if="!tableData.length">
        <i class="key-icon key-icon-btn key-icon-none"></i>暂无数据
      </div>
      <template v-if="tableData.length">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="日期"/>
          <el-table-column prop="customerNum" label="老客户数"/>
          <el-table-column prop="oneCycleRate" label="7日内"/>
          <el-table-column prop="twoCycleRate" label="15日内"/>
          <el-table-column prop="treeCycleRate" label="30日内"/>
          <el-table-column prop="fourCycleRate" label="60日内"/>
          <el-table-column prop="fiveCycleRate" label="90日内"/>
          <el-table-column prop="sixCycleRate" label="180日内"/>
        </el-table>
        <el-pagination
          class="key-pagination"
          @size-change="onPageSizeChange"
          @current-change="onPageNumChange"
          :current-page="pageNum"
          :page-size="pageSize"
          :page-sizes="[10, 15, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
        </el-pagination>
      </template>
    </div>
  </div>
</template>

<script>
  import storeApi from '@/dss-common/api/store';
  import utils from '@/dss-common/utils/index';

  import CardTitle from '../../../components/card-title/index';

  function formatDate(t) {
    return utils.timeFormat(t, 'YYYY-MM-DD');
  }

  export default {
    name: 'rvisit-cycle',
    components: {CardTitle},
    props: {
      dateRange: {
        type: Array,
        default: []
      },
      curStore: {
        type: Object,
        default: null
      }
    },
    data () {
      return {
        loading: false,
        totalNum: 0,
        pageNum: 1,
        pageSize: 10,
        tableData: []
      }
    },
    watch: {
      dateRange: {
        immediate: true,
        handler (val, oldVal) {
          if (!!val) {
            this.pageNum = 1;
            this.api();
          }
        }
      }
    },
    methods: {
      //客户回访周期
      api () {
        this.loading = true;
        storeApi.getCustomerRevisitRate(
          formatDate(this.dateRange[0]),
          formatDate(this.dateRange[1]),
          this.pageNum,
          this.pageSize
        )
          .then(result => {
            this.totalNum = result.totalCount || 0;
            this.tableData = result.data || [];
          })
          .always(() => {
            this.loading = false;
          });
      },
      // 页数
      onPageSizeChange (val) {
        this.pageSize = val;
        this.pageNum = 1;
      },
      // 页码
      onPageNumChange (val) {
        this.pageNum = val;
        this.api();
      }
    }
  }
</script>
