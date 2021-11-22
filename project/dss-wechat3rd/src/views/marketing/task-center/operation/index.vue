<template>
  <div>
    <div class="task-filter-box" style="display:flex">
      <task-search v-if="!ifSingle" :onSearch="onSearch" v-model="keyword" />
      <el-select v-if="!ifSingle"  placeholder='任务达标状态' v-model="stateId" style="margin-left:30px" clearable @change='onChangeState'>
        <el-option v-for="item in stateList" :key="item.value" :label="item.state" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="task-container">
      <el-table :data='tableData' style="width:100%" v-loading='loading'>
        <el-table-column align="left" :show-overflow-tooltip="true" label="任务名称" prop="taskName" />
        <el-table-column align="left" label="分享人" prop="shareItem" >
          <div slot-scope="scope" class="img-info">
            <div class="img-box">
              <img  class="img" :src='scope.row.shareUserAvatar' alt="" />
            </div>
            <p class="info">{{scope.row.shareUserName}}</p>
          </div>
        </el-table-column>
        <el-table-column align="left" label="邀请客户" prop="inviteList" >
          <template slot-scope="scope" >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              :disabled="scope.row.inviteList.length <= 2">
              <el-scrollbar class="scrollbar" style="height: 200px; overflow-x: hidden;">
                <div class="img-info" v-for="(item,index) in scope.row.inviteList" :key="index">
                    <div class="img-box">
                      <img class="img" :src='item.inviteUserAvatar' alt="" />
                    </div>
                    <p class="info">{{item.inviteUserName}}</p>
                </div>
              </el-scrollbar>
              <div slot="reference">
                <div class="img-info" v-for="(item,index) in scope.row.inviteList.slice(0, 2)" :key="index">
                  <div class="img-box">
                    <img class="img" :src='item.inviteUserAvatar' alt="" />
                  </div>
                  <p class="info">{{item.inviteUserName}}</p>
                </div>
              </div>
            </el-popover>
            <span v-if="scope.row.inviteList.length>2" style="margin-left:5px">...</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="任务状态" prop="isComplete">
          <template slot-scope="scope" >
            <p :class="scope.row.isComplete == true ? 'beendone':'undone'">{{scope.row.isComplete === true ? '已完成':'未完成'}}</p>
            <span>要求人数：{{scope.row.targetTotal}}</span><br>
            <span>当前人数：{{scope.row.inviteCount}}</span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="left" label="任务奖励" prop="awardInfo" />
        <!-- operation -->
        <el-table-column label="操作" align="left" width='200'>
          <template slot-scope="scope" >
            <el-button :disabled="scope.row.taskType == 1 || scope.row.taskType == 2 ? true : false" @click="handleDetail(scope) " type='text'>详情</el-button>
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
export default {
  name: 'TaskOperation',
  components: {
    TaskSearch
  },
  computed: {
    ifSingle() {
      let id = parseFloat(this.$route.query.id);
      return id;
    }
  },
  data() {
    return {
      stateId: '',
      keyword: '',
      tableData: [],
      stateList: [{ value: true, state: '已完成' }, { value: false, state: '未完成' }],
      loading: false,
      page: {
        pageNo: 1,
        pageSize: 10,
        totalCount: null
      }
    };
  },
  methods: {
    getTableData() {
      this.loading = true;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        taskId: this.ifSingle ? this.ifSingle : null,
        taskName: this.keyword,
        isComplete: this.stateId
      };
      api
        .getTaskRecordList(params)
        .then(res => {
          this.tableData = res.data || [];
          this.page.totalCount = (res || {}).totalCount || 0;
        })
        .catch(res => {
          this.$message.error(res.errorMessage);
        })
        .finally(_ => {
          this.loading = false;
        });
    },
    handleDetail(scope) {
      let id = scope.row.id;
      let typeId = scope.row.taskType;
      switch (typeId) {
        case 3: //拼团
          this.$router.push({
            path: `/marketing/task-center/operation/detail?id=${id}&typeId=${typeId}`
          });
          break;
        case 4: //秒杀
          this.$router.push({
            path: `/marketing/task-center/operation/detail?id=${id}&typeId=${typeId}`
          });
          break;
        case 5: //砍价
          this.$router.push({
            path: `/marketing/task-center/operation/detail?id=${id}&typeId=${typeId}`
          });
      }
    },
    onChangeState() {
      this.page.pageNo = 1;
      this.getTableData();
    },
    onSearch(keyword) {
      this.page.pageNo = 1;
      if (typeof keyword === 'string') {
        this.keyword = keyword;
      }
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

<style scoped lang='less'>
/deep/ .el-button.is-disabled{
  background: none;
  color: #999;
  border: none;
}
/deep/ .el-button.is-disabled:hover{
  background: none;
  color: #999;
  border: none;
}
.img-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  .info {
    padding-left: 10px;
  }
  .name {
    display: inline-block;
    color: #31343b;
    font-weight: bold;
  }
  .img-box {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    img {
      margin: 0 auto;
      max-width: 30px;
      max-height: 30px;
      border-radius: 15px;
    }
  }
}
.beendone{color:green}
.undone{color:red}

.scrollbar {
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
