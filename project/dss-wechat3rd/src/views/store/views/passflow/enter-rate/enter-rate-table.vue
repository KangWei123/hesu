<template>
  <div class="compare-table">
    <el-table :data="curPageData" stripe style="width: 100%">
      <el-table-column prop="tdate" label="日期"/>
      <el-table-column prop="customer" label="进店人数"/>
      <el-table-column prop="passenger" label="路过人数"/>
      <el-table-column prop="enterRate" label="入店率"/>
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
