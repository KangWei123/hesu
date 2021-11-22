<template>
  <div class="marketing-page goods-list-container live-page">
    <div class="live-filter">
      <el-form @submit.native.prevent inline>
        <el-form-item label="">
          <el-input placeholder="请输入直播名称" size="small" v-model.trim="filterForm.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select v-model="filterForm.liveStatus" size="small" @change="handleSearch">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="">
          <el-input placeholder="请输入主播昵称" size="small" v-model.trim="filterForm.anchorName" clearable></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="single-search-btn" type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="goods-list">
      <el-table :data="tableList" style="width: 100%" class="wkt-table" v-loading="loading">
        <el-table-column prop="name" label="方案名称"></el-table-column>
        <el-table-column prop="cover" label="分享图片" width="200">
          <template slot-scope="scope">
            <img :src="scope.row.shareImg" class="cover" referrerpolicy="no-referrer" />
          </template>
        </el-table-column>
        <el-table-column prop="beginTime" label="开始时间">
          <template slot-scope="scope">
            {{ (scope.row.startTime * 1000) | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间">
          <template slot-scope="scope">
            {{ (scope.row.endTime * 1000) | formatDate }}
          </template>
        </el-table-column>
        <el-table-column label="直播状态">
          <template slot-scope="scope">
            {{ (statusOptions.find(i => i.value == scope.row.liveStatus) || {}).label }}
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="上下架">
          <template slot-scope="scope">
            <el-switch
              :value="!!scope.row.activityStatus"
              active-text="上架"
              inactive-text="下架"
              @change="onToggleShelf(scope.row, scope.row.activityStatus ? 0 : 1)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="anchorName" label="主播昵称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a class="table-href" href="javascript:;" @click="gotoDetail(scope.row)">详情</a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :page-size="pageParams.pageSize"
        :total="totalCount"
        :current-page="pageParams.pageNo"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';

const statusOptions = [
  {
    value: null,
    label: '全部直播'
  },
  {
    value: 101,
    label: '正在直播'
  },
  {
    value: 102,
    label: '直播预告'
  },
  {
    value: 103,
    label: '直播结束'
  },
  {
    value: 104,
    label: '禁播'
  },
  {
    value: 105,
    label: '暂停'
  },
  {
    value: 106,
    label: '异常'
  },
  {
    value: 107,
    label: '已过期'
  }
];

export default {
  name: 'live-list',
  data() {
    return {
      loading: false,
      filterForm: {
        name: null,
        liveStatus: null,
        anchorName: null
      },
      statusOptions,
      tableList: [],
      pageParams: {
        pageSize: 10, //每页条数
        pageNo: 1 //页数
      },
      totalCount: 0
    };
  },

  filters: {
    formatDate(val) {
      if (!val) return '';
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchList(); // 根据直播列表
    });
  },

  methods: {
    // 搜索
    handleSearch() {
      // todo
      this.pageParams.pageNo = 1;
      this.fetchList();
    },
    fetchList() {
      this.loading = true;
      const params = { ...this.pageParams, ...this.filterForm };
      const url = constants.Api.live.list;
      services
        .get(url, {
          params,
          action: '直播列表'
        })
        .then(res => {
          this.totalCount = res.totalCount || 0;
          this.tableList = res.data || [];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.fetchList();
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.fetchList();
    },
    // 上下架
    async onToggleShelf(item, activityStatus) {
      this.loading = true;
      const params = { roomId: item.roomId, activityStatus };
      const url = constants.Api.live.shelf;

      try {
        await services.post(url, params, { action: '上下架' });
        this.fetchList();
      } finally {
        this.loading = false;
      }
    },
    gotoDetail(row) {
      this.$router.push({
        path: '/marketing/live/detail',
        query: { roomId: row.roomId }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.cover {
  max-width: 200px;
  max-height: 200px;
}
.marketing-page {
  padding: 24px;
  background: #ffffff;
}
</style>