<template>
  <div class="activities">
    <div class="conditions">
      <el-form ref="form" :model="query" inline>
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="query.datetime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :value-format="FORMAT4ELM_24HOURS"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="活动类型" prop="activityType">
          <el-select v-model="query.activityType" placeholder="全部类型" clearable>
            <el-option v-for="type of types" :key="type.id" :label="type.name" :value="type.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="签到状态" prop="signInStatus">
          <el-select v-model="query.signInStatus" placeholder="全部状态" clearable>
            <el-option label="已签到" :value="1"></el-option>
            <el-option label="未签到" :value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain type="primary" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
      <el-table-column label="活动时间" v-slot="scope">
        {{ scope.row.activityStartTime }} 至 {{ scope.row.activityEndTime }}
      </el-table-column>
      <el-table-column label="报名时间" prop="createTime"></el-table-column>
      <el-table-column label="下单人" prop="orderUserName"></el-table-column>
      <el-table-column label="参与人" prop="name"></el-table-column>
      <el-table-column label="活动类型" prop="activityTypeName"></el-table-column>
      <el-table-column label="活动名称" prop="activityName"></el-table-column>
      <el-table-column label="签到状态" v-slot="scope">
        <span v-if="scope.row.signInStatus == 1" class="font-sign">已签到</span>
        <span v-if="scope.row.signInStatus == 0">未签到</span>
      </el-table-column>
    </fat-table>
  </div>
</template>

<script>
  import { FatTable } from '@/dss-common/components/list-page/index';
  import { elderApi, activityApi } from '@/mod-kangyang/src/api';
  import { FORMAT4ELM_24HOURS } from '@/mod-kangyang/src/constants';
  /**
   * 活动记录
   */
  export default {
    components: {
      FatTable,
    },
    props: {
      value: {
        type: Number,
        required: true,
      },
    },
    data() {
      return {
        types: [],
        FORMAT4ELM_24HOURS,
        query: {
          datetime: null,
          activityType: null,
          signInStatus: null,
        },
      };
    },
    computed: {
      memberId() {
        return this.value;
      },
    },
    mounted() {
      this.getAllTypes();
    },
    methods: {
      reset() {
        this.$refs.form.resetFields();
        this.query.datetime = '';
      },
      handleSearch() {
        this.$refs.table.search();
      },
      async handleFetch(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        const { datetime, activityType, signInStatus } = this.query;
        const payload = {
          signInStatus,
          activityType,
          userId: +this.memberId,
          pageNo,
          pageSize,
        };
        if (datetime) {
          const [start, end] = datetime;
          console.log(start, end);
          payload.orderStartTime = start;
          payload.orderEndTime = end;
        }
        const { data, totalCount } = await elderApi.getActivityList(payload);
        return {
          list: data || [],
          total: totalCount || 0,
        };
      },
      async getAllTypes() {
        const { data } = await activityApi.getTypes({
          pageNo: 1,
          pageSize: 100,
        });
        this.types = data || [];
      },
    },
  };
</script>

<style scoped>
  .conditions {
    padding: 0 24px;
  }

  .font-sign {
    color: #2e8dff;
  }
</style>
