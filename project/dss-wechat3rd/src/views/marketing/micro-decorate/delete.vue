<template>
  <div class="courtesy marketing-page goods-list-container">
    <div class="courtesy-filter">
      <el-input
        placeholder="请输入方案名称"
        style="width: 200px; margin-right: 20px"
        v-model.trim="keyword.name"
        @change="handleSearch"
        clearable
      ></el-input>
      <el-button class="single-search-btn" type="primary">
        搜索
      </el-button>
    </div>
    <div class="courtesy-list element-tags goods-list">
      <el-table :data="tableData" 
                style="width: 100%" 
                class="wkt-table" 
                @sort-change="sortChange"
                v-loading="loading">

        <el-table-column prop="name" label="方案名称" :show-overflow-tooltip="true" />

        <el-table-column prop="appointmentNum" sortable="custom" label="预约人数" />

        <el-table-column label="创建人">
          <template slot-scope="scope">
             {{scope.row.createUserName}}
          </template>
        </el-table-column>

        <el-table-column label="创建门店">
          <template slot-scope="scope">
            {{scope.row.storeName || '总部'}}
          </template>
        </el-table-column>

        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | datatime}}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <div slot-scope="scope">
            <a @click="viewData(scope.row.formId)">预约详情</a>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import datetime from '@/dss-common/utils/date.js';
import microDecorate from '@/dss-wechat3rd/src/api/micro-decorate';

export default {
  data() {
    return {
      keyword: {
        isShelf: null,
        name: '',
        orderByAN: null
      },
      statusOptions: [
        {
          value: null,
          label: '全部状态'
        },
        {
          value: 1,
          label: '上架'
        },
        {
          value: 0,
          label: '下架'
        }
      ],
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      isLoading: false,
      loading: false
    };
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  mounted() {
    this.getList();
  },

  computed: {
    ...mapState({
      roleList: 'roleList'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    }
  },

  filters: {
    datatime: function(value) {
      return datetime.format(new Date(value), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  methods: {
    getList() {
      this.loading = true;
      return microDecorate
        .list({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          name: this.keyword.name,
          orderByAN: this.keyword.orderByAN,
          status: 0
        })
        .then(res => {
          this.tableData = res.data || [];
          this.totalCount = res.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    },

    reLoad() {
      this.page.pageNo = 1;
      this.getList();
    },

    handleSearch() {
      this.reLoad();
    },

    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getList();
    },

    onPageChange(page) {
      this.page.pageNo = page;
      this.getList();
    },

    sortChange(info) {
      let sortParms = {
        ascending: 1,
        descending: 2
      };

      this.keyword.orderByAN = sortParms[info.order];
      this.reLoad();
    },

    viewData(id) {
      this.$router.push({
        path: '/marketing/form-utils/deleted/submit-data',
        query: {
          id
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.courtesy-filter {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 16px 20px;
}

.courtesy-box{
  display: flex;
  .el-button{
    margin-left: 20px;
  }
}
</style>
