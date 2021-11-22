<template>
  <div class="compare-table">
    <!--     <placeholder :height="250" type="noData" v-if="!data"></placeholder> -->
    <!-- <template v-else> -->
    <el-table
      :data="curPageData"
      stripe
      style="width: 100%;">
      <el-table-column
        label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.tdate}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(period,index) in periods"
        :key="index"
        v-if="curPageData[0].compareData"
        :label="'时段：'+period">
        <template slot-scope="scope">
          <span>{{ scope.row.compareData[index].passenger === null ? '-' : addSeparator(scope.row.compareData[index].passenger) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="onPageSizeChange"
      @current-change="onPageNumChange"
      :current-page="pageNum"
      :page-size="pageSize"
      :page-sizes="[10, 15, 50, 100]"
      layout="prev, pager, next, jumper, sizes, total"
      :total="data && data.length">
    </el-pagination>
    <!-- </template> -->
  </div>
</template>

<script>
  import utils from '@/dss-common/utils/index';

  export default {
    props: {
      data: null,
      periods: null
    },
    data() {
      return {
        pageNum: 1,
        pageSize: 10
      };
    },
    computed: {
      curPageData() {
        if (!this.data || !this.data.length) {
          return [];
        }

        let data = this.$plain(this.data);

        let begin = (this.pageNum - 1) * this.pageSize;
        return data.slice(begin, begin + this.pageSize);
      }
    },
    watch: {
      data() {
        this.pageNum = 1;
      }
    },
    methods: {
      onPageSizeChange(val) {
        this.pageSize = val;
        this.pageNum = 1;
      },
      onPageNumChange(val) {
        this.pageNum = val;
      },
      addSeparator(val) {
        return utils.addSeparator(val);
      }
    }
  };
</script>
