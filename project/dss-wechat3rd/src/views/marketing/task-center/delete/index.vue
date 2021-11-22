<template>
  <div>
    <div class="task-filter-box" style="display:flex">
      <task-search :onSearch="onSearch" v-model="keyword" />
      <el-select placeholder='全部任务类型' v-model="type" style="margin-left:30px" clearable @change='onChangeType'>
        <el-option v-for="item in typeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="task-container">
      <!-- tabs -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list">
        <el-table-column :show-overflow-tooltip="true" align="left" width='170' label="任务名称" prop="taskName" >
          <template slot-scope="scope">
            <span>{{scope.row.taskName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="分享内容" prop="taskType">
           <template slot-scope="scope">
            <span v-if="scope.row.taskType===1">邀请新用户</span>
            <!-- <span v-if="scope.row.taskType===2">观看直播</span> -->
            <span v-if="scope.row.taskType===3">参与拼团</span>
            <span v-if="scope.row.taskType===4">参与秒杀</span>
            <span v-if="scope.row.taskType===5">参与砍价</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="任务目标" prop="targetTotal">
          <template slot-scope="scope">
            <span v-if="scope.row.targetTotal ===''">--</span>
            <span>{{ scope.row.targetTotal |people(scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="达标奖励" align="left" prop="awardInfo" />
        <el-table-column label="任务时间" width='200' align="left" prop="taskTime">
          <template slot-scope="scope" >
            <span>{{scope.row.startTime}}~</span><br>
            <span>{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分享人数" align="left" prop="shareCount" />
        <el-table-column label="邀请人数" align="left" prop="inviteCount" />
        <el-table-column label="创建时间" align="left" prop="createTime" width='200'/>
        <el-table-column label="任务状态" width='150' align="left" prop="status" >
          <span>已结束</span>
        </el-table-column>
        <!-- operation -->
        <el-table-column label="操作" align="left" width='250'>
          <template slot-scope="scope" >
            <el-button type='text'  @click="$router.push('/marketing/task-center/establish/detail?id=' + scope.row.id)">详情</el-button>
            <el-button type='text'  @click="$router.push('/marketing/task-center/operation?id=' + scope.row.id)">记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
     <el-pagination
        :current-page.sync="page.pageNo"
        :page-size.sync="page.pageSize"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        :total="page.totalCount"
        @current-change="onPageChange"
        @size-change="onSizeChange"
        layout="prev, pager, next, jumper, sizes, total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import TaskSearch from '../components/task-search/index';
import api from '@/dss-wechat3rd/src/api/task-center.js';
const TABLE_COLS_ENUM = {
  taskName: '任务名称',
  taskType: '分享内容',
  target: '任务目标',
  awardInfo: '达标奖励',
  taskTime: '任务时间',
  shareCount: '分享人数',
  inviteCount: '邀请人数',
  createTime: '创建时间',
  status: '任务状态'
};
export default {
  components: {
    TaskSearch
  },
  data() {
    return {
      tableData: [],
      TABLE_COLS_ENUM,
      typeList: [
        { value: 1, type: '邀请新用户' },
        // { value: 2, type: '观看直播' },
        { value: 3, type: '参与拼团' },
        { value: 4, type: '参与秒杀' },
        { value: 5, type: '参与砍价' }
      ],
      loading: {
        list: false,
        delete: false,
        end: false
      },
      keyword: '',
      state: '',
      type: '',
      form: {},
      rules: {},
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: null
      }
    };
  },
  filters: {
    people(val, scope) {
      if (scope.row.targetType == 1) {
        return `邀请${val}位新用户`;
      } else {
        return `邀请${val}位会员用户`;
      }
    }
  },
  methods: {
    getTableData() {
      this.loading.list = true;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        taskName: this.keyword,
        taskType: this.type,
        status: this.state,
        isDeleted: true
      };
      api
        .getTaskList(params)
        .then(res => {
          this.tableData = res.data || [];
          this.page.totalCount = (res || {}).totalCount || 0;
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading.list = false;
        });
    },
    onSearch(keyword) {
      this.page.pageNo = 1;
      if (typeof keyword === 'string') {
        this.keyword = keyword;
      }
      this.getTableData();
    },
    onChangeType() {
      this.page.pageNo = 1;
      this.getTableData();
    },
    onPageChange() {
      this.getTableData();
    },
    onSizeChange() {
      this.getTableData();
    }
  },
  mounted() {
    this.getTableData();
  }
};
</script>
<style lang='less' scoped>
/deep/ .task-container .el-button.is-disabled{
  color: #999;
  background: none;
  border: none;
}
</style>

