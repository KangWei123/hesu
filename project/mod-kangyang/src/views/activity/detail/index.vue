<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="form" inline @submit.native.prevent="search" :model="query">
        <el-form-item label="报名时间">
          <el-date-picker
            v-model="query.date"
            type="datetimerange"
            style="width: 380px"
            format="yyyy-MM-dd HH:mm"
            :value-format="FORMAT4ELM_24HOURS"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            clearable
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button plain type="primary" @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <div class="activity-detail">
      <div class="charts">
        <chart class="chart-inst" :options="signUpChart" />
        <chart class="chart-inst" :options="signInChart" />
      </div>

      <div class="table-wrapper">
        <div class="actions">
          <export-button
            type="primary"
            :params="{
              url: EXPORT_URL,
              data: {
                code: activityCode,
                startTime: query.date && query.date[0] ? query.date[0] : null,
                endTime: query.date && query.date[1] ? query.date[1] : null,
              },
            }"
          >
            导出
          </export-button>
        </div>

        <fat-table ref="table" :state.sync="query" :fetch-handler="handleFetch">
          <el-table-column label="报名人手机" prop="phone"> </el-table-column>
          <el-table-column label="更新时间" prop="updateTime"></el-table-column>
          <el-table-column label="签到时间" prop="signInTime"></el-table-column>
          <el-table-column label="参与人姓名" prop="name"></el-table-column>
          <el-table-column label="参与人手机" prop="orderUserPhone"></el-table-column>
          <el-table-column label="票种名称" prop="ticketName"></el-table-column>
          <el-table-column label="票种价格" prop="ticketPrice" v-slot="scope">
            {{ scope.row.ticketPrice && '￥' + scope.row.ticketPrice }}
          </el-table-column>
          <el-table-column label="核销编号" prop="signInNo"></el-table-column>
          <el-table-column label="状态" v-slot="scope">
            <span class="font-sign" v-if="scope.row.signInStatus === 1">已签到</span>
            <span v-else>未签到</span>
          </el-table-column>
        </fat-table>
      </div>
    </div>
  </list-page-layout>
</template>

<script>
  import { FORMAT4ELM_24HOURS, SignStatus } from '@/mod-kangyang/src/constants';
  import { activityApi } from '@/mod-kangyang/src/api';
  import { ListPageLayout, FatTable } from '@/dss-common/components/list-page';
  import ExportButton from '@/dss-common/components/export-button';
  import { Chart } from '@/dss-common/components';

  export default {
    name: 'ActivityDetail',
    components: {
      Chart,
      FatTable,
      ExportButton,
      ListPageLayout,
    },
    data() {
      return {
        FORMAT4ELM_24HOURS,
        SignStatus,
        EXPORT_URL: activityApi.EXPORT_USER_URL,
        query: {
          date: '',
        },
        detail: {},
        // 报名
        signUpList: [],
        // 签到
        signInList: [],
      };
    },
    computed: {
      id() {
        return this.$route.query.id;
      },
      activityCode() {
        return this.$route.params.code;
      },
      signUpChart() {
        return this.getChartOptions('报名人数', this.signUpList);
      },
      signInChart() {
        return this.getChartOptions('签到人数', this.signInList);
      },
    },
    methods: {
      resetForm() {
        this.$refs.form.resetFields();
        this.query.date = '';
      },
      getChartOptions(title, list) {
        const data = this.normalizeList(list);
        console.log(data);
        return {
          title: {
            text: title,
            textStyle: {
              fontSize: 13,
            },
          },
          tooltip: {
            trigger: 'axis',
          },
          // legend: {
          //   data: data.tickets,
          //   bottom: 10,
          // },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.dates,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
            },
          },
          series: [
            {
              data: data.tickets.map(item => data.group[item]),
              type: 'line',
            },
          ],
        };
      },
      /**
       * 规范化数据，便于表格输出
       * TODO: 测试
       * @param {Array<{date: string, num: number, ticketName: string}>} list
       */
      normalizeList(list) {
        const dateSet = new Set();
        const ticketMap = {};

        list.forEach(item => {
          if (item.date) {
            dateSet.add(item.date);
            if (!ticketMap.hasOwnProperty(item.date)) {
              ticketMap[item.date] = {};
            }
            ticketMap[item.date] = item.count;
          }
        });

        const group = {};
        const dates = Array.from(dateSet.values()).sort();
        const tickets = Object.keys(ticketMap);

        dates.forEach(date => {
          group[date] = ticketMap[date];
        });

        return {
          dates,
          tickets,
          group,
        };
      },
      async handleFetch(params) {
        const date = this.query.date;
        const payload = {
          pageNo: params.pagination.currentPage,
          pageSize: params.pagination.pageSize,
        };
        const userQueryParams = { ...payload };
        userQueryParams.code = this.activityCode;
        userQueryParams.isCancel = false;
        payload.activityCode = this.activityCode;

        if (date) {
          const [startTime, endTime] = date;
          userQueryParams.orderStartTime = startTime;
          userQueryParams.orderEndTime = endTime;
          payload.startTime = startTime;
          payload.endTime = endTime;
        }

        // 报名
        activityApi.signUpStatistic(payload).then(result => {
          const { data } = result;
          this.signUpList = data || [];
        });
        // 签到
        activityApi.signInStatistic(payload).then(result => {
          const { data } = result;
          this.signInList = data || [];
        });

        const { data: detail, totalCount } = await activityApi.getUsers(userQueryParams);

        return { list: detail, total: totalCount };
      },
      search() {
        this.$refs.table.search();
      },
    },
  };
</script>

<style scoped>
  .charts {
    height: 350px;
    display: flex;
    overflow: hidden;
  }

  .chart-inst {
    flex: 1;
    padding: 20px;
    border-radius: 4px;
    border-left: 8px solid #f5f7fa;
  }

  .chart-inst:first-child {
    border-left: none;
    border-right: 8px solid #f5f7fa;
  }

  .font-sign {
    color: #ff8400;
  }

  .table-wrapper {
    border-radius: 4px;
    border-top: 16px solid #f5f7fa;
  }

  .actions {
    display: flex;
    padding: 16px 24px;
    justify-content: flex-end;
  }
</style>
