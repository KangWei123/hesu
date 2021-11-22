<template>
  <div class="compare-table">
    <el-table :data="curPageData" stripe style="width: 100%">
      <el-table-column prop="tdate" label="日期"/>
      <el-table-column label="最高入店(整周)">
        <template slot-scope="scope">
          {{ scope.row.maxRate ? ((scope.row.maxRate-0) * 100).toFixed(2) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="最低入店(整周)">
        <template slot-scope="scope">
          {{ scope.row.minRate ? ((scope.row.minRate-0) * 100).toFixed(2) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="入店平均率(整周)">
        <template slot-scope="scope">
          {{ scope.row.avgRate ? ((scope.row.avgRate-0) * 100).toFixed(2) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="(工作日)">
        <template slot-scope="scope">
          {{ scope.row.workdayRate ? ((scope.row.workdayRate-0) * 100).toFixed(2) + '%' : '-' }}
        </template>
      </el-table-column>
      <el-table-column label="(节假日)">
        <template slot-scope="scope">
          {{ scope.row.holidayRate ? (scope.row.holidayRate * 100).toFixed(2) + '%' : '-' }}
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
    <!-- </template> -->
  </div>
</template>

<script>
  // import Placeholder from 'app/ori/components/placeholder';

  export default {
    // components: { Placeholder },
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
      }
    }
  };
</script>
