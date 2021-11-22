<template>
  <div class="page-wrapper">
    <div class="Add-Manage-Button">
      <el-button class="form-btn" @click="toFormData">表单数据</el-button>
    </div>
    <el-breadcrumb separator="/"
                  class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: isDeleted ? '/marketing/form-utils/deleted' : '/marketing/form-utils/list'}">{{isDeleted ? '已删除' : '表单列表'}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/marketing/form-utils/' + (isDeleted ? 'deleted' : 'list') + '/submit-data?id=' + formId}">数据</el-breadcrumb-item>
      <el-breadcrumb-item >表单数据</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="page-toolbar">
      <search-input
        style="width: 320px"
        v-model="search.keyword"
        @search="onSearch"
        placeholder="请输入表单号和提交人手机号"
      />
      <el-select style="margin-left: 20px" v-model="search.storeId">
        <el-option v-for="item in storeList || []" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <main class="form-wrap">
      <el-table :data="tableData" v-loading="loading.list">
        <el-table-column label="表单号" prop="id" width="100px"></el-table-column>
        <el-table-column label="提交人" prop="name">
          <div slot-scope="scope" class="submit-info">
            <img :src="scope.row.avatar" alt="" class="avatar" />
            <div class="info">
              <span>{{ scope.row.name }}</span>
              <span>{{ scope.row.phone }}</span>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="提交时间" prop="createTime">
          <div slot-scope="scope">{{ scope.row.updateTime | time }}</div>
        </el-table-column>
        <el-table-column label="门店" prop="storeName"></el-table-column>
        <el-table-column label="关联活动">
          <template slot-scope="scope">{{ scope.row.activityName || '其他' }}</template>
        </el-table-column>
        <el-table-column label="跟进人" prop="employeeName">
          <div slot-scope="scope">
            {{ scope.row.employeeName }}
            <span v-if="scope.row.positionName">（{{ scope.row.positionName }}）</span>
          </div>
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="scope">
            <a @click="showDetail(scope.row)">详情</a>
          </div>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        hide-on-single-page
        :total="totalCount"
        :page-size.sync="pagination.pageSize"
        :current-pagination.sync="pagination.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
      ></el-pagination>
    </main>
    <form-detail-dialog :visible.sync="dialog.detail" :submit-data="currentDetail" :form-id="formId" :is-deleted="isDeleted"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SearchInput from '@/dss-wechat3rd/src/components/search-input';
import FormDetailDialog from './components/form-detail-dialog';
import { querySubmitListV2, querySubmitList } from './api/form';

export default {
  components: { SearchInput, FormDetailDialog },

  data() {
    return {
      isDeleted: this.$route.path.indexOf('deleted') > 0,
      search: {
        keyword: '',
        storeId: null
      },

      loading: {
        list: false,
        detail: false
      },

      tableData: [],

      dialog: {
        detail: false
      },

      pagination: {
        pageNo: 1,
        pageSize: 10
      },

      totalCount: 0,

      currentDetail: {}
    };
  },

  methods: {
    async fetchData() {
      try {
        this.loading.list = true;
        let res = null;
        if (this.activityId) {
          res = await querySubmitListV2({
            ...this.pagination,
            ...this.search,
            formId: this.formId,
            activityId: this.activityId
          });
        } else {
          res = await querySubmitList({
            ...this.pagination,
            ...this.search,
            formId: this.formId,
            isStoreForm:
              this.roleList &&
              (this.roleList.indexOf('common_role_storeKeeper') !== -1 ||
                this.roleList.indexOf('common_role_operator') !== -1)
          });
        }
        this.tableData = res.data || [];
        this.totalCount = res.totalCount;
      } finally {
        this.loading.list = false;
      }
    },

    toFormData() {
      this.$router.push(
        '/marketing/form-utils/' + (this.isDeleted ? 'deleted' : 'list') + '/form-data?id=' + this.formId
      );
    },

    showDetail(row) {
      this.currentDetail = row;
      this.dialog.detail = true;
    },

    onSizeChange() {
      this.pagination.pageNo = 1;
      this.fetchData();
    },

    onPageChange() {
      this.fetchData();
    },

    onSearch() {
      this.pagination.pageNo = 1;
      this.fetchData();
    }
  },

  computed: {
    ...mapState({
      storeList: 'storeList',
      roleList: 'roleList'
    }),
    formId() {
      return this.$route.query.id;
    },
    activityId() {
      return this.$route.query.activityId;
    }
  },

  watch: {
    'search.storeId'() {
      this.pagination.pageNo = 1;
      this.fetchData();
    }
  },

  mounted() {
    this.fetchData();
  },

  beforeRouteEnter(to, from, next) {
    let toRefresh = false;
    if (from.path === '/marketing/form-utils/deleted' || from.path === '/marketing/form-utils/list') {
      toRefresh = true;
    }
    console.log(toRefresh);
    next(vm => {
      if (toRefresh) {
        vm.isDeleted = vm.$route.path.indexOf('deleted') > 0;
        vm.search.keyword = '';
        vm.search.storeId = null;
        vm.fetchData();
      }
    });
  }
};
</script>

<style lang="less" scoped>
.page-wrapper {
  // padding: 18px 20px;
}

.page-header {
  width: 100%;
  height: 50px;
  font-family: PingFangSC-Semibold;
  font-size: 16px;
  color: #333;
}

.page-toolbar {
  background: #F5F7FA;
  padding: 30px 20px;
  display: flex;
  position: relative;
  background: #fff;
  box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.06);
  border-radius: 0px 0px 4px 4px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.form-btn {
  position: absolute;
  right: 20px;
}

.submit-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .avatar {
    flex-grow: 0;
    flex-shrink: 0;
    display: block;
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .info {
    display: flex;
    flex-direction: column;
  }
}

.form-wrap {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;
}
</style>
