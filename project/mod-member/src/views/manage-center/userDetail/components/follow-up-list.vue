<template>
  <div>
    <el-table :data="followUpList" class="wkt-table followUpList" v-loading="loading">
      <el-table-column label="跟进人" min-width="120px">
        <template slot-scope="scope">
          {{ scope.row.employeeName || '无' }}
        </template>
      </el-table-column>
      <el-table-column label="跟进人角色" min-width="120px">
        <template slot-scope="scope">
          {{ scope.row.positionName || '无' }}
        </template>
      </el-table-column>
      <el-table-column label="跟进时间" min-width="150px">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          {{ scope.row.message || '无' }}
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
  import manageApi from '@/mod-member/src/api/manage.js';
  import datetime from '@/dss-common/utils/date.js';
  export default {
    name: 'FollowUpList',
    data() {
      return {
        followUpList: [],
        loading: false,
        totalCount: 0,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
      };
    },
    props: {
      // 用户id
      id: {
        type: Number,
        default: null,
      },
    },
    watch: {
      id(newVal, oldVal) {
        console.log(newVal);
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
        // TODO: 跟进记录
        this.loading = true;
        manageApi
          .getFollowUpList({
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            clientId: this.id,
          })
          .then(res => {
            this.followUpList = res.data || [];
            this.totalCount = res.totalCount;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
    mounted() {
      if (this.id) {
        this.doSearch();
      }
    },
  };
</script>

<style lang="less"></style>
