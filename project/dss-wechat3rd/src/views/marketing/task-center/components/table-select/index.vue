<template>
  <div>
    <el-table :data="tableData" class="table" v-loading="loading" :border="true">
      <el-table-column prop="name" label="名称" align="center"></el-table-column>
      <el-table-column prop="spellGroup" label="拼团人数" align="center"></el-table-column>
      <el-table-column prop="groupPrice" label="团购价格" align="center"></el-table-column>
      <el-table-column prop="originalPrice" label="原价" align="center">
        <template slot-scope="scope">
          <span>￥{{scope.row.originalPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="realSales" label="真实销量" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="onClickSelect(scope.row)"
            size="mini"
            style="font-weight: 400"
          >选择</el-button>
        </template>
      </el-table-column>
      <template slot="empty">
        <place-holder></place-holder>
      </template>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      v-if="totalCount"
      :total="totalCount"
      :page-size="pageSize"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="wkt-pagination"
    ></el-pagination>
  </div>
</template>

<script>
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
export default {
  name: 'table-dialog',
  props: {
    groupDialogVisible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },

  data() {
    return {
      dialogVisible: null,
      loading: false,
      tableData: [],
      totalCount: 0,
      pageSize: 10,
      pageNo: 1
    };
  },
  components: { PlaceHolder },
  computed: {},
  watch: {
    groupDialogVisible: {
      handler: function(val, newVal) {
        console.log(val, newVal, '>>>');
        if (val != newVal) {
          this.dialogVisible = this.groupDialogVisible;
        }
      }
    }
  },
  mounted() {
    console.log(this.dialogVisible);
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageSize = size;
      this.pageNo = 1;
    },
    // 翻页
    onPageChange(page) {
      this.pageNo = page;
    },
    onClickSelect(val) {}
  }
};
</script>
<style lang='less' scoped>
.dialog-footer {
  text-align: right;
}
</style>
