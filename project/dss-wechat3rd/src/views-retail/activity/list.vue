<template>
  <div class="special-activity-list-container"
       v-loading="loading.update"
       element-loading-text="更新中...">
    
    <div class="Add-Manage-Button">
      <el-button icon="el-icon-plus" type="primary" @click="handleAddActivity">新建专题活动</el-button>
    </div>

    <div class="filter-container">
      <el-form inline class="wkt-opt-label-container" @submit.native.prevent>
        <el-form-item label="名称搜索：">
          <el-input style="width:200px"
                    prefix-icon="el-icon-search"
                    placeholder="请输入活动名称"
                    @input="handleFilterActivities"
                    v-model.trim="keyword"
                    clearable></el-input>
        </el-form-item>

        <div class="remcom-create">
      <div class="activity-tips">
          <span class="create-label">推荐创建：</span>
          <a href="javascript:void(0);"
            class="table-href">精选推荐</a>
          <a href="javascript:void(0);"
            class="table-href">特价专区</a>
          <a href="javascript:void(0);"
            class="table-href">人气活动</a>
        </div>
        <div class="activity-tips">注意：创建专题活动后，请到<a class="table-href" style="color: #2E8DFF" @click="toMiniIndex">页面装修</a>将专题活动配置</div>
      </div>
      </el-form>
    </div>

    <div class="table-list-container">
      <el-table :data="tableData"
                style="width: 100%"
                v-loading="loading.list"
                class="wkt-table">
        <el-table-column prop="topicName"
                         label="活动名称"
                         class-name="stress-font" />
        <el-table-column prop="createTime"
                         label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | datatime}}
          </template>
        </el-table-column>
        <el-table-column prop="id"
                         label="操作"
                         width="200">
        <span slot-scope="scope">
          <a class="table-href" href="javascript:void(0);" @click="handleModifyActivity(scope.row.topicId)">编辑</a>
        </span>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination> 
      
    </div>
  </div>
</template>

<script>
import datetime from '@/dss-common/utils/date.js';
import api from '@/dss-wechat3rd/src/api/activity.js';

const supplierApi = api.supplier;

export default {
  data() {
    return {
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      loading: {
        update: false,
        list: false
      },
      keyword: ''
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchSpecialActivityList(); // 获取主题活动列表
    });
  },

  mounted() {},
  filters: {
    datatime: function(value) {
      return datetime.format(new Date(value), 'YYYY-MM-DD HH:mm:ss');
    }
  },
  methods: {
    //to新建专题活动
    handleAddActivity() {
      this.$router.push('/marketing/activities/create');
    },
    //获取主题活动列表
    fetchSpecialActivityList() {
      const params = {
        ...this.page,
        keyword: this.keyword ? this.keyword : undefined
      };
      console.log(params, this.keyword);
      this.loading.list = true;
      supplierApi
        .query(params)
        .done(res => {
          this.tableData = res.data || [];
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.loading.list = false;
        });
    },
    //搜索
    handleFilterActivities() {
      this.page.pageNo = 1;
      this.fetchSpecialActivityList();
    },
    //跳转页面装修
    toMiniIndex() {
      this.$router.switchPage('/setting/homedecorate');
    },
    //编辑专题活动
    handleModifyActivity(topicId) {
      this.$router.push(`/marketing/activities/create?topicId=${topicId}`);
    },

    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchSpecialActivityList();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchSpecialActivityList();
    }
  }
};
</script>

<style lang="less">
.special-activity-list-container {
  border-radius: 2px;

  .filter-container {
    padding: 20px;
    background: #fff;
    padding-bottom: 5px;
    // position: relative;
    // .filter-box{
    //   position: absolute;
    //   right: 20px;
    //   top: 30px;
    // }
    .wkt-opt-label-container{
      padding-bottom: 10px;
      box-shadow: none;
    }
    .el-form-item {
      margin-bottom: 8px;
    }
  }

  .supplier-list {
    padding: 20px;
    background: white;
    border-radius: 4px;
  }

  .remcom-create {
    padding: 0;

    .create-label {
      color: @ui-font-color-darkGrey;
    }
    & > div:nth-child(n) {
      display: inline-block;
    }

    .activity-tips {
      // float: right;
      height: 17px;
      font-size: 12px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: @ui-font-color-darkGrey;
      line-height: 17px;
      a {
        color: @ui-font-color-darkGrey;
      }
    }
  }

  .table-list-container{
    background: #fff;
    margin-top: 16px;
    padding-bottom: 20px;
  }
  .el-table {
    padding-top: 0px;
  }
}
</style>
