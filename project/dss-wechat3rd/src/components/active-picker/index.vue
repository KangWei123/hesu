<template>
  <el-dialog class="activity-picker-dialog" :visible.sync="dialogVisible" :close-on-click-modal="false" width="70%">
    <div class="condition">
      <el-form inline @submit.native.prevent="search">
        <el-form-item label="活动名称"><el-input v-model="query.activityName"></el-input></el-form-item>
        <el-form-item label="活动编号"><el-input v-model="query.activityNo"></el-input></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="body">
      <fat-table
        ref="table"
        :fetch-handler="handleFetch"
        selectable
        :selected.sync="selected"
        row-key="id"
        :fetch-on-mounted="false"
      >
        <el-table-column v-slot="{ row }" label="活动封面" width="150px">
          <img :src="row.imgUrl" style="width: 150px; height: 75px; object-fit: cover" />
        </el-table-column>
        <el-table-column label="活动名称" prop="activityTitle" min-width="200px"></el-table-column>
        <el-table-column label="报名时间" width="200px" v-slot="{ row }">
          {{ row.startTime }} - {{ row.endTime }}
        </el-table-column>
        <el-table-column label="活动编号" prop="activityNo" width="200px"> </el-table-column>
        <el-table-column label="报名状态" prop="applyStatusStr" width="120px"></el-table-column>
        <el-table-column label="活动状态" prop="activityStatusStr" width="120px"></el-table-column>
        <el-table-column label="创建人" prop="createByUserName" width="120px"> </el-table-column>
        <el-table-column label="创建组织" prop="createDeptName" width="120px"> </el-table-column>
      </fat-table>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
  import FatTable from '@/dss-common/components/list-page/fat-table/index';
  import api from '@/dss-wechat3rd/src/api/campaign';
  export default {
    name: 'ActivityPicker',
    components: {
      FatTable,
    },
    props: {
      value: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        dialogVisible: false,
        selected: [],
        query: {
          activityName: '',
          activityNo: '',
        },
      };
    },
    watch: {
      dialogVisible(show) {
        if (show) {
          // 初始化
          if (this.$refs.table) {
            this.$refs.table.reset();
          }
          this.query.activityName = '';
          this.query.activityNo = '';
          this.selected = this.value;

          this.$nextTick(() => {
            this.search();
          });
        }
      },
    },
    methods: {
      show() {
        this.dialogVisible = true;
      },
      async handleFetch(params) {
        const payload = {
          ...this.query,
          pageNo: params.pagination.currentPage,
          pageSize: params.pagination.pageSize,
        };
        const { data, totalCount } = await api.activity.getDecorateableActivities(payload);

        return {
          list: data || [],
          total: totalCount || 0,
        };
      },
      search() {
        this.$refs.table.search();
      },
      handleConfirm() {
        this.dialogVisible = false;
        console.log(this.selected, 'this.selected');
        this.$emit('input', this.selected);
      },
    },
  };
</script>

<style lang="less">
  .activity-picker-dialog {
    .el-dialog__body {
      text-align: left;
    }
  }
</style>
