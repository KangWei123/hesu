<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="addActivity">新增活动</el-button>
    </template>
    <template #filters>
      <el-form ref="form" :model="form" @submit.prevent.native="$refs.table.search()" inline label-suffix=":">
        <el-form-item label="活动名称" prop="activityName">
          <el-input class="w220" v-model="form.activityName" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <el-select class="w220" v-model="form.status" placeholder="请选择活动状态">
            <el-option
              v-for="(item, index) in stateList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.form.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table ref="table" :fetch-handler="handleFetch" :remove-handler="handleRemove" :state.sync="form" row-key="id">
      <el-table-column header-align="center" align="center" prop="activityName" label="活动名称"> </el-table-column>
      <el-table-column header-align="center" align="center" prop="ruleName" label="积分规则"> </el-table-column>
      <el-table-column header-align="center" align="center" label="活动时间">
        <template slot-scope="scope">
          <span v-if="scope.row.endTime" v-text="scope.row.startTime + '至' + scope.row.endTime"></span>
          <span v-else>永久</span>
        </template>
      </el-table-column>
      <!-- <el-table-column header-align="center" align="center" label="触发条件">
        <template slot-scope="scope">
          <span v-text="JSON.parse(scope.row.triggerMemRuleJson).triggerConditionStr"></span>
        </template>
      </el-table-column> -->
      <el-table-column header-align="center" align="center" label="积分倍率">
        <template slot-scope="scope">
          <span v-text="scope.row.scoreMulti + '倍'"></span>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="operator" label="创建人"> </el-table-column>
      <el-table-column header-align="center" align="center" label="活动状态" width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1">
            <span class="span1">进行中 |</span>
            <el-button type="text" @click="onEnd(scope.row.id)" style="margin-left: 8px">结束</el-button>
          </div>
          <div v-else-if="scope.row.status === 2">已结束</div>
          <div v-else-if="scope.row.status === 0">
            <span>未开始 |</span>
            <el-button type="text" style="margin-left: 8px" @click="onStart(scope.row.id)">立即开始</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" prop="prop" label="操作" right v-slot="scope">
        <table-actions
          :options="[
            {
              // status 1 进行中 2已结束 0未开始
              name: scope.row.status !== 0 ? '详情' : '编辑',
              link: {
                path: '/score-center/multiplier-activity/add',
                query: { status: scope.row.status !== 0 ? 2 : 1, id: scope.row.id },
              },
            },
            scope.row.status !== 1
              ? {
                  name: '删除',
                  onClick: () => $refs.table.remove(scope.row.id),
                }
              : {},
          ]"
        ></table-actions>
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>
<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import memberApi from '@/mod-member/src/api/memberAPI';

  export default {
    name: 'MultiplierActivity',
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
    },
    data() {
      return {
        stateList: [
          {
            label: '全部',
            value: '',
          },
          {
            label: '未开始',
            value: '0',
          },
          {
            label: '进行中',
            value: '1',
          },
          {
            label: '已结束',
            value: '2',
          },
        ],
        form: {
          activityName: '',
          status: '',
        },
      };
    },
    methods: {
      async handleFetch(e) {
        const params = {
          ...this.form,
          pageSize: e.pagination.pageSize,
          pageNo: e.pagination.currentPage,
        };
        console.log('form:', params);
        const result = await memberApi.scoreCenter.scoreMultipleList(params);
        return {
          list: result.data,
          total: result.totalCount,
        };
      },
      handleRemove(ids) {
        return memberApi.scoreCenter.scoreMultipleOperating({ id: ids[0], status: '-1' });
      },
      addActivity() {
        this.$router.push({
          path: '/score-center/multiplier-activity/add',
          query: {
            status: 0,
          },
        });
      },
      onStart(id) {
        memberApi.scoreCenter.scoreMultipleOperating({ id, status: 1 }).then(res => {
          if (res.success) {
            this.$message.success('操作成功');
            this.$refs.table.search();
          } else {
            this.$message.success('操作失败');
          }
        });
      },
      onEnd(id) {
        memberApi.scoreCenter.scoreMultipleOperating({ id, status: 2 }).then(res => {
          if (res.success) {
            this.$message.success('操作成功');
            this.$refs.table.search();
          } else {
            this.$message.success('操作失败');
          }
        });
      },
    },
  };
</script>
<style lang="less">
  .span1 {
    color: @ui-theme-color-orange;
  }
</style>
