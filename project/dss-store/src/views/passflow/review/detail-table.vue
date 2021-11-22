<template>
  <div class="compare-table">
    <el-table :data="curPageData" stripe style="width: 100%">
      <el-table-column prop="tdate" label="日期"/>
      <el-table-column label="总客流量">
        <template slot-scope="scope">
          {{ scope.row['allPassenger'] | number }}
        </template>
      </el-table-column>
      <el-table-column label="总客户量">
        <template slot-scope="scope">
          {{ scope.row['allCustomer'] | number }}
        </template>
      </el-table-column>
      <el-table-column label="新客户数">
        <template slot-scope="scope">
          {{ scope.row['newCustomer'] | number}}
        </template>
      </el-table-column>
      <el-table-column prop="p15" label="老客户数">
        <template slot-scope="scope">
          {{ scope.row['oldCustomer'] | number }}
        </template>
      </el-table-column>
      <el-table-column prop="p30" label="新客户占比">
        <template slot-scope="scope">
          {{ scope.row['newCustomerRate']==null ? '-' :  addTwoBit(Math.round(scope.row['newCustomerRate'] * 10000) / 100.00) +'%'}}
        </template>
      </el-table-column>
      <el-table-column prop="p90" label="老客户占比">
        <template slot-scope="scope">
          {{ scope.row['oldCustomerRate']==null ? '-' :  addTwoBit(Math.round(scope.row['oldCustomerRate'] * 10000) / 100.00)+'%'}}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="ori-pagination"
      @size-change="onPageSizeChange"
      @current-change="onPageNumChange"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[10, 15, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="data && data.length">
    </el-pagination>
  </div>
</template>

<script>

  import utils from '@/dss-common/utils/index';

  export default {
    props: {
      data: null
    },
    data () {
      return {
        pageNum: 1,
        pageSize: 10
      }
    },
    computed: {
      curPageData () {
        if (!this.data || !this.data.length) {
          return [];
        }
        let begin = (this.pageNum - 1) * this.pageSize;
        return this.data.slice(begin, begin + this.pageSize);
      }
    },
    watch: {
      data () {
        this.pageNum = 1;
      }
    },
    methods: {
      onPageSizeChange (val) {
        this.pageSize = val;
        this.pageNum = 1;
      },
      onPageNumChange (val) {
        this.pageNum = val;
      },
      addTwoBit (val) {
        return val.toFixed(2);
      }
    }
  };
</script>
