<template>
  <div class="discount-list marketing-page">
    <div class="discount-head wkt-opt-label-container ">
      <div>
        <el-input
          class="filter-input"
          size="mini"
          placeholder="请输入活动名称"
          v-model="keyword"
          maxlength="80"
          @keyup.enter.native="onFliter"
          @input="onFliter" />
      </div>
    </div>

    <div class="goods-list">
      <el-row>
        <el-table :data="list" class="wkt-table">
          <el-table-column label="活动名称" width="160" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠内容" width="120">
            <template slot-scope="scope">
                <span>{{ scope.row.ruleName  }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="periodStartTime" label="开始时间" min-width="150">
            <template slot-scope="scope">
              <span>{{  scope.row.startTime  }}</span>
            </template>
          </el-table-column>

           <el-table-column prop="periodEndTime" label="结束时间" min-width="150">
            <template slot-scope="scope">
              <span>{{  scope.row.endTime  }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="storeCount" width="200" label="参与门店" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.suitStoreType == 0">全部门店</span>
              <span v-else >部分门店</span>
            </template>
          </el-table-column>

          <el-table-column prop="storeCount" width="180" label="创建人">
            <template slot-scope="scope">
              {{ scope.row.sellerName }}
            </template>
          </el-table-column>

         <el-table-column prop="activityLevel" width="120" label="活动类型">
            <template slot-scope="scope">
              <span v-if="scope.row.activityLevel == 1">品牌活动</span>
              <span v-if="scope.row.activityLevel == 10">门店活动</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="120" fixed="right">
            <template slot-scope="scope">
              <div>
                <a href="javascript:;" class="table-href" @click="handleDetail(scope.row.id)">详情</a>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="block">
          <el-pagination
            v-if="totalMemberCount"
            hide-on-single-page
            layout="prev, pager, next, jumper, sizes, total"
            :total="totalMemberCount"
            :page-size="pageParams.pageSize"
            :current-page="pageParams.pageNo"
            :page-sizes="[5, 10, 20, 30, 40, 50]"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            class="wkt-pagination"
          >
          </el-pagination>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import '@/dss-wechat3rd/src/views/marketing/marketing.less';
import { mapState } from 'vuex';
import discountApi from '@/dss-wechat3rd/src/api/discount';
import dateUtil from '@/dss-common/utils/date';
import distcountEnum from '@/dss-wechat3rd/src/constants/distcountEnum.js';

export default {
  name: 'list',
  components: {},
  data() {
    return {
      list: [],
      keyword: '',
      type: '',
      totalMemberCount: 0,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      status: distcountEnum.ActivityStatus,
      userId: '',
      isLoading: false,
      typeList: [
        { value: 1, type: '品牌活动' },
        { value: 10, type: '门店活动' }
      ]
    };
  },
  computed: {
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo'
    }),
    //高级管理员身份
    isAreaManger() {
      return true;
      // return (!!~this.roleList.split(',').indexOf('common_role_area_manager') || !!~this.roleList.split(',').indexOf('common_role_dealer_manager'));
    }
  },
  filters: {
    time(val) {
      return dateUtil.format(new Date(val), 'YYYY-MM-DD HH:mm');
    }
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.doSearch(); // 获取优惠券列表
    });
  },

  mounted() {
    this.userId = this.userInfo.userId || null;
    this.doSearch();
  },

  methods: {
    onFliter: function(key) {
      this.pageParams.pageNo = 1;
      this.doSearch(key);
    },

    //跳转页面装修
    toMiniIndex() {
      this.$router.switchPage('/setting/homedecorate');
    },

    /**
     * 获取优惠券列表
     */
    doSearch: function(key) {
      this.isLoading = true;

      discountApi
        .queryList({
          statusList: [distcountEnum.ActivityStatus.DELETED],
          name: this.keyword ? this.keyword : undefined,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          activityType: distcountEnum.activityTypeEnum.FIXED_PRICE.value
        })
        .then(rs => {
          this.list = rs.data || [];
          this.totalMemberCount = rs.totalCount;
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

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

    onChangeType() {
      this.pageParams.pageNo = 1;
      this.doSearch();
    },

    handleDetail(id) {
      this.$router.push({
        path: '/marketing/mouthful/activity/list/edit',
        query: {
          id: id,
          isDisabled: 1,
          deleteShow: 1
        }
      });
    }
  }
};
</script>
