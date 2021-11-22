<template>
  <div class="discount-list marketing-page">
    <div class="Add-Manage-Button">
      <el-button type="primary" @click="handleAdd">创建活动</el-button>
    </div>
    <div class="discount-head wkt-opt-label-container ">
      <el-form :model="filter" inline ref="filter" label-width="80px">
        <el-form-item label="名称搜索:" prop="keyword">
          <el-input class="filter-input"
                    placeholder="请输入活动名称"
                    v-model="filter.keyword"
                    maxlength="80"
                    @keyup.enter.native="onFliter"
                    @input="onFliter"/>
        </el-form-item>
        
        <el-form-item label="状态搜索:" prop="activityStatus">
          <el-select clearable
                      v-model="filter.activityStatus"
                      placeholder="选择活动状态"
                      @change="onFliter">
            <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button class="search-btn"
                     @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <div class="head-btn-box">
        <div class="marketing-tips">
          注意：创建活动后，请到
          <a class="table-href" @click="toMiniIndex" href="javascript:void(0)">页面装修</a>
          配置活动
        </div>
      </div>
    </div>

    <div class="goods-list">
      <el-row>
        <el-table :data="list" class="wkt-table">
          <el-table-column label="活动名称" width="140" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column label="优惠内容" width="140">
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

          <el-table-column  width="160" prop="status" label="状态">
            <template slot-scope="scope">
              <div :style="{color: scope.row.status === status.NOT_STARTED ? '#333' : ''}" class="goods-shlef" :class="scope.row.status === status.ON_GOING ? 'status-shelf' : 'status-unshelf'">
                {{getActivityStatusDesc(scope.row.status)}}
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="storeCount" width="200" label="参与门店" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.storeBriefs == null">全部门店</span>
              <span v-else class="unit-tags">{{ scope.row.partIn }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="storeCount" width="180" label="创建人">
            <template slot-scope="scope">
              {{ scope.row.sellerName }}
            </template>
          </el-table-column>

         <el-table-column prop="activityLevel" width="120" label="活动类型">
            <template slot-scope="scope">
              <span v-if="scope.row.suitStoreType == 0">全部门店</span>
              <span v-else >部分门店</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" min-width="200" fixed="right">
            <template slot-scope="scope">
              <div>
                <a
                  href="javascript:void(0);"
                  class="table-href market-shelf"
                  @click="setActivityStatus(scope.row, status.ENDED)"
                  v-if="scope.row.status === status.ON_GOING && !!isAreaManger"
                  >结束</a
                >
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-else-if="scope.row.status === status.ON_GOING && !!isAreaManger"
                  content="当前角色无法结束活动"
                >
                  <a href="javascript:;" slot="reference" class="popover-a">结束</a>
                </el-popover>
                <a href="javascript:;" class="table-href" @click="handleEdit(scope.row.id,1)">复制</a>
                <a href="javascript:;" class="table-href" @click="handleDetail(scope.row.id)">详情</a>
                <a type="text" v-if="!!isAreaManger && scope.row.status === status.NOT_STARTED" @click="handleEdit(scope.row.id)">编辑</a>
                <el-popover placement="top-start" width="200" trigger="hover" v-else-if="scope.row.status === status.NOT_STARTED" content="当前角色无法进行编辑">
                  <a href="javascript:;" slot="reference" class="popover-a">编辑</a>
                </el-popover>

                <a
                  href="javascript:;"
                  class="table-href"
                  style="color: #F5222D;"
                  v-if="!!isAreaManger"
                  @click="handleRemove(scope.row.id,status.DELETED)"
                  >删除</a
                >
                <el-popover placement="top-start" width="200" trigger="hover" v-else content="当前角色无法进行删除">
                  <a href="javascript:;" slot="reference" class="popover-a">删除</a>
                </el-popover>
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
      options: distcountEnum.ActivityOptions,
      filter: {
        activityStatus: null,
        keyword: ''
      },
      list: [],
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
    },
    // 活动状态描述计算属性
    getActivityStatusDesc() {
      return status => {
        if (status === distcountEnum.ActivityStatus.NOT_STARTED) {
          return '未开始';
        } else if (status === distcountEnum.ActivityStatus.ON_GOING) {
          return '进行中';
        } else if (status === distcountEnum.ActivityStatus.EXPIRE) {
          return '已过期';
        } else {
          return '已结束';
        }
      };
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
      vm.doSearch();
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
     * 设置活动结束或者开始状态
     */
    setActivityStatus(row, status) {
      let title, msg, successMsg;
      title = '结束提醒';
      msg = '活动结束后，<span style="color:red">则不可以重新发起，</span>是否确认结束';
      successMsg = '活动结束成功';

      this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          discountApi
            .update_status({
              id: row.id,
              status: status
            })
            .then(rs => {
              this.doSearch();
            });
        })
        .catch(() => {
          console.log('取消');
        });
    },

    /**
     * 获取优惠券列表
     */
    doSearch: function(key) {
      this.isLoading = true;
      let statusList = [];
      if (this.filter.activityStatus == null) {
        Object.keys(distcountEnum.ActivityStatus).forEach(key => {
          if (key !== 'DELETED') {
            statusList.push(distcountEnum.ActivityStatus[key]);
          }
        });
      } else {
        statusList.push(this.filter.activityStatus);
      }

      discountApi
        .queryList({
          statusList: statusList,
          name: this.filter.keyword ? this.filter.keyword : undefined,
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          activityType: distcountEnum.activityTypeEnum.MUCH_BY_MORE_DISCOUNT.value
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

    handleAdd() {
      this.$router.push({
        path: '/marketing/full-reduction/activity/list/edit'
      });
    },

    handleEdit(id, copy) {
      this.$router.push({
        path: '/marketing/full-reduction/activity/list/edit',
        query: { id: id, copy: copy }
      });
    },

    handleRemove(id, status) {
      this.$confirm('确定删除活动吗？', '删除活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.isLoading = true;
          discountApi
            .update_status({
              id: id,
              status: status
            })
            .then(rs => {
              if (rs.data) {
                this.doSearch();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            });
        })
        .catch(() => {});
    },

    handleDetail(id) {
      this.$router.push({
        path: '/marketing/full-reduction/activity/list/edit',
        query: {
          id: id,
          isDisabled: 1
        }
      });
    },
    handleReset() {
      this.$refs.filter.resetFields();
      this.pageParams.pageNo = 1;
      this.doSearch();
    }
  }
};
</script>
