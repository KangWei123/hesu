<template>
  <div>
    <el-table :data="recordList" class="wkt-table">
      <el-table-column label="到店时间">
        <template slot-scope="scope">
          {{ scope.row.enterTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="门店">
        <template slot-scope="scope">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>
      <el-table-column label="导购员">
        <template slot-scope="scope">
          {{ scope.row.shoppingGuide || '无' }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      v-if="totalCount"
      :page-size="pageParams.pageSize"
      :current-page="pageParams.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
  import memberApi from '@/mod-member/src/api/memberAPI.js';
  import datetime from '@/dss-common/utils/date.js';
  export default {
    components: {},
    name: 'RecordList',
    data() {
      return {
        recordList: [],
        totalCount: 0,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
      };
    },

    props: {
      // 会员id
      id: {
        type: Number,
        default: null,
      },
    },
    watch: {
      id(newVal, oldVal) {
        if (newVal) {
          this.doSearch();
        }
      },
    },
    filters: {
      formatDate(time) {
        const date = new Date(time);
        return datetime.format(date, 'YYYY-MM-DD HH:mm:ss');
      },
    },
    methods: {
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.doSearch();
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.doSearch();
      },

      // 获取列表
      doSearch() {
        memberApi
          .getStoreLog({
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            customerId: this.id,
          })
          .then(rs => {
            this.recordList = rs.data || [];
            this.totalCount = rs.totalCount;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {});
      },
    },
  };
</script>

<style lang="less"></style>
