<template>
  <div>
    <div class="Add-Manage-Button">
      <el-button @click="onAddTask" type="primary">创建任务</el-button>
    </div>
    <div class="task-filter-box" style="display:flex">
      <task-search :onSearch="onSearch" v-model="keyword" />
      <el-select placeholder='全部任务类型' v-model="type" style="margin-left:30px" clearable @change='onChangeType'>
        <el-option v-for="item in typeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
      </el-select>
      <el-select placeholder='全部状态' v-model="state" style="margin-left:30px" clearable @change='onChangeState'>
        <el-option v-for="item in stateList" :key="item.value" :label="item.state" :value="item.value"></el-option>
      </el-select>
      <el-button style="margin-left: 15px" @click="handleReset">重置</el-button>
    </div>
    <div class="task-container">
      <!-- tabs -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list" class="task-center-table">
        <el-table-column :show-overflow-tooltip="true" align="left" width='170' label="任务名称" prop="taskName" >
          <template slot-scope="scope">
              <span>{{scope.row.taskName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" width='150' label="分享内容" prop="taskType">
           <template slot-scope="scope">
            <span v-if="scope.row.taskType===1">邀请新用户</span>
            <!-- <span v-if="scope.row.taskType===2">观看直播</span> -->
            <span v-if="scope.row.taskType===3">参与拼团</span>
            <span v-if="scope.row.taskType===4">参与秒杀</span>
            <span v-if="scope.row.taskType===5">参与砍价</span>
          </template>
        </el-table-column>

        <el-table-column :show-overflow-tooltip="true" width='150' align="left" label="任务目标" prop="targetTotal">
          <template slot-scope="scope">
            <span v-if="scope.row.targetTotal ===''">--</span>
            <span>{{ scope.row.targetTotal |people(scope) }}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" width='150' label="达标奖励" align="left" prop="awardInfo" />
        <el-table-column label="任务时间" width='200' align="left" prop="taskTime">
          <template slot-scope="scope" >
            <span>{{scope.row.startTime}}~</span><br>
            <span>{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="分享人数" width='150' align="left" prop="shareCount" />
        <el-table-column label="邀请人数" width='150' align="left" prop="inviteCount" />
        <el-table-column label="创建时间" align="left" prop="createTime" width='200'/>
        <el-table-column label="任务状态" width='150' align="left" prop="status" >
          <template slot-scope="scope">
            <span v-if="scope.row.status===1">未开始</span>
            <span v-if="scope.row.status===2">进行中</span>
            <span v-if="scope.row.status===3">时间结束</span>
            <span v-if="scope.row.status===4">手动结束</span>
            <span v-if="scope.row.status===5">奖励池瓜分结束</span>
          </template>
        </el-table-column>
        <!-- operation -->
        <el-table-column label="操作" align="left" width='200'>
          <template slot-scope="scope" >
            <el-button type='text' v-if="scope.row.status =='1'"  @click="$router.push('/marketing/task-center/establish?id=' + scope.row.id)" >编辑</el-button>
            <el-button type='text' v-if="scope.row.status !='1'"  @click="$router.push('/marketing/task-center/establish/detail?id=' + scope.row.id)" >详情</el-button>
            <el-button type='text' v-if="scope.row.status !='1'"   @click="$router.push('/marketing/task-center/operation?id=' + scope.row.id)">记录</el-button>
            <el-popover v-if="scope.row.status == '2'" placement="top" width="200" target="click" v-model="scope.row.finishPopover">
              <p class="dialog-text">点击结束后，会提前结束任务进程，确定结束当前任务吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope.row.finishPopover = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleFinish(scope)" :loading="loading.end">确定</el-button>
              </div>
              <el-button type='text' slot="reference">结束</el-button>
            </el-popover>

            <el-popover v-if="scope.row.status != '2'" placement="top" width="200" target="click" v-model="scope.row.popover">
              <p class="dialog-text">确定删除当前任务吗？</p>
              <div style="text-align: right; margin:0">
                <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDelete(scope)" :loading="loading.delete" >确定</el-button>
              </div>
              <el-button style="color: #F5222D" type='text' slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination -->
      <el-pagination
        hide-on-single-page
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
import { mapState } from 'vuex';
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
  filters: {
    people(val, scope) {
      if (scope.row.targetType == 1) {
        return `邀请${val}位新用户`;
      } else {
        return `邀请${val}位会员用户`;
      }
    }
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
      stateList: [
        { value: 1, state: '未开始' },
        { value: 2, state: '进行中' },
        { value: 3, state: '时间结束' },
        { value: 4, state: '手动结束' },
        { value: 5, state: '奖励池瓜分结束' }
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
  methods: {
    onAddTask() {
      this.$router.push({
        path: '/marketing/task-center/establish'
      });
    },
    getTableData() {
      this.loading.list = true;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        taskName: this.keyword,
        taskType: this.type,
        status: this.state,
        isDeleted: ''
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
    handleFinish(scope) {
      this.loading.end = true;
      api
        .finishTaskById({ taskId: scope.row.id })
        .then(res => {
          this.$message.success('提前结束任务成功');
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(_ => {
          this.loading.end = false;
          scope.row.finishPopover = false;
          this.getTableData();
        });
    },
    handleDelete(scope) {
      this.loading.delete = true;
      api
        .deleteTaskById({ taskIdList: scope.row.id })
        .then(res => {
          this.$message.success('删除成功');
        })
        .catch(e => {
          this.$message.error(e.errorMessage);
        })
        .finally(_ => {
          this.loading.delete = false;
          scope.row.popover = false;
          this.getTableData();
        });
    },
    onSearch(keyword) {
      this.page.pageNo = 1;
      if (typeof keyword === 'string') {
        this.keyword = keyword;
      }
      this.getTableData();
    },
    onChangeState() {
      this.page.pageNo = 1;
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
    },
    handleReset() {
      this.keyword = '';
      this.state = '';
      this.type = '';
      this.onSearch();
    }
  },
  mounted() {
    this.getTableData();
  },
  computed: {
    ...mapState({ roleList: 'roleList' }),
    isEnterprise() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    }
  }
};
</script>
<style lang='less' scoped>
/deep/ .task-container .el-button.is-disabled{
  color: #999;
  background: none;
  border: none;
}
.task-center-table {
  td:last-child {
    .el-button--text {
      color: #2E8DFF;
    }
    .el-button+.el-button {
      margin-left: 0px;
    }
    .el-button {
      margin-right: 12px;
    }
  }
}
.task-filter-box {
  
}
</style>
