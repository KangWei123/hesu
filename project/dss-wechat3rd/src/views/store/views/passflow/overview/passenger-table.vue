<template>
  <div class="passenger-table">
    <!--     <placeholder :height="250" type="noData" v-if="!data"></placeholder> -->
    <!-- <template v-else> -->
    <el-table
      :data="curPageData"
      stripe
    style="width: 100%;">
      <el-table-column
        label="日期">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="valueTitle">
        <template slot-scope="scope">
          <span>{{ scope.row[valueKey] === null ? '-' : addSeparator(scope.row[valueKey]) }}</span>
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
    // components: { Placeholder },
    props: {
      data: Array,
      valueTitle: String,
      valueKey: {
        type: String,
        default: 'count'
      }
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
        // data.reverse();

        let begin = (this.pageNum - 1) * this.pageSize;
        console.log(data.slice(begin, begin + this.pageSize));
        return data.slice(begin, begin + this.pageSize);
      }
    },
    watch: {
      data: {
        immediate: true,
        handler() {
          this.pageNum = 1;
        }
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
