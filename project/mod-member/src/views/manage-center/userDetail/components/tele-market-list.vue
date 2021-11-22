<template>
  <div>
    <el-table :data="teleMarketList" class="wkt-table teleMarketList" v-loading="loading">
      <el-table-column label="类型" min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.status | teleType }}
        </template>
      </el-table-column>
      <el-table-column label="拨打时间" min-width="180px">
        <template slot-scope="scope">
          {{ scope.row.dialTime | time }}
        </template>
      </el-table-column>
      <el-table-column label="拨打时长" min-width="120px">
        <template slot-scope="scope">
          {{ scope.row.dialDuration | timeDuration }}
        </template>
      </el-table-column>
      <el-table-column label="跟进情况" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          {{ scope.row.followInfoDesc || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" show-overflow-tooltip min-width="200px">
        <template slot-scope="scope">
          {{ scope.row.remark || '--' }}
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
  import utils from '@/dss-common/utils/index.js';
  export default {
    name: 'TeleMarketList',
    data() {
      return {
        teleMarketList: [],
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
      teleType(type) {
        const typeText = ['无', '总部电销', '外包电销', '门店电销'];
        return typeText[type || 0];
      },
      timeDuration(duration) {
        return utils.formatTimeDuration(duration) || '--';
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
        this.loading = true;
        manageApi
          .getTeleMarketList({
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            clientId: this.id,
          })
          .then(res => {
            this.teleMarketList = res.data || [];
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
