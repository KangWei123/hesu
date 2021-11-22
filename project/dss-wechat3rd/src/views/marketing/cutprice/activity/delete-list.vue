<template>
  <div class="cut-price-container marketing-page">
    <div class="filter-box">
      <div class="search-box">
        <div class="filter-field">
          <span>活动名称：</span>
          <el-input v-model="searchName" style="width: 200px" placeholder="活动名称" @keypress.native.enter="onSearch" />
        </div>

        <div v-if="!singleStore" class="filter-field">
          <span>活动门店：</span>
          <store-select
            :select-stores.sync="selectStores"
            :show-dept="isEnterManger"
            :show-store="!isEnterManger"
            class="store-select"
            @change="onSearch"
          />
        </div>
      </div>
    </div>

    <div class="activity-list">
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list" class="wkt-table">
        <el-table-column prop="activityName" label="活动名称" width="180" class-name="stress-font"  min-width="180" />

        <el-table-column prop="thumbnail" label="商品图片" min-width="180">
          <img class="activity-list-img" slot-scope="scope" :src="scope.row.thumbnail" />
        </el-table-column>

        <el-table-column prop="priceRange" label="售价" width="100">
          <span slot-scope="scope">{{ scope.row.salePrice | price }}</span>
        </el-table-column>

        <el-table-column prop="priceRange" label="可砍最低价" min-width="120">
          <span slot-scope="scope">{{ scope.row.lowestPrice | price }}</span>
        </el-table-column>

        <el-table-column prop="priceRange" label="发起砍价的次数" align="center" width="160">
          <span slot-scope="scope">{{ scope.row.bargainTimes }}</span>
        </el-table-column>

        <el-table-column prop="storeCount" label="活动门店" :show-overflow-tooltip="true" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.suitStoreType == 0">全部门店</span>
            <span v-else class="unit-tags">{{ scope.row.partIn }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="storeCount" width="180" label="创建组织">
          <template slot-scope="scope">
            {{ scope.row.employeeName }}({{ scope.row.roleName }})
          </template>
        </el-table-column>

        <el-table-column prop="updateName" label="删除人" min-width="200" />

        <el-table-column prop="address" label="操作" align="center" min-width="200">
          <span slot-scope="scope">
            <a @click="onAlter(scope.row)">详情</a>
            <a @click="onGotoDetail(scope.row)">查看活动</a>
          </span>
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
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/cutprice.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';
import { mapState } from 'vuex';

const bargainApi = api.bargain;

export default {
  components: { StoreSelect },

  data() {
    return {
      selectStores: [],
      searchName: '',
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 20
      },
      totalCount: 0,
      loading: {
        list: false
      }
    };
  },

  computed: {
    ...mapState({
      roleList: 'roleList',
      epStoreList: 'storeList'
    }),

    singleStore() {
      return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
    },

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    // key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  },

  mounted() {
    this.getActivityList(); //获取砍价活动列表
  },

  methods: {
    onSearch() {
      this.page.pageNo = 1;
      this.getActivityList();
    },
    // 每页条数变化
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getActivityList();
    },
    // 翻页
    onPageChange(page) {
      this.page.pageNo = page;
      this.getActivityList();
    },
    formatRange(range) {
      return range;
    },

    /**
     * 获取砍价活动列表
     */
    getActivityList() {
      const params = {
        status: -1,
        storeIds: this.selectStores.join(','),
        activityName: this.searchName,
        ...this.page
      };
      this.loading.list = true;
      bargainApi
        .list(params)
        .done(res => {
          this.tableData = res.data || [];
          this.tableData.forEach(item => {
            let arr = (item.storeBriefVOS || []).map(node => {
              return node.name;
            });
            item.partIn = arr.join(',');
          });
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.loading.list = false;
        });
    },

    /**
     * 编辑及详情跳转
     */
    onAlter(row) {
      this.$router.push(`/marketing/cutprice/activity/edit?id=${row.id}`);
    },

    /**
     * 查看活动详情
     */
    onGotoDetail(row) {
      this.$router.push(`/marketing/cutprice/management/list?activityId=${row.id}&activityStatus=-1`);
    }
  }
};
</script>

<style lang="less" scoped>
.wkt-one-opt-label-container {
  &,
  & .filter-field {
    display: flex;
    align-items: center;
  }
}
</style>