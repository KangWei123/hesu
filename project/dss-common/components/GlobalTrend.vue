<template>
  <div class="trend-table">
    <el-table :data="curPageData" stripe style="width: 100%;">
      <el-table-column prop="tdate" label="日期" width="200px"> </el-table-column>
      <el-table-column
        v-for="(item, index) in data[0].compareData"
        :key="index"
        v-if="data[0].compareData"
        :label="item.name"
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.compareData[index].passenger === null ? '-' : addSeparator(scope.row.compareData[index].passenger)
          }}</span>
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
      :total="data && data.length"
    >
    </el-pagination>
  </div>
</template>

<script>
import utils from '../utils';

export default {
  props: {
    data: null,
    type: 0
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

      let data = utils.plain(this.data);
      // data.reverse();

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
