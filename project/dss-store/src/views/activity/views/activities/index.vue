<template>
  <div class="dss-card" v-loading="loading">
    <list-filter @filter="onFilter"></list-filter>
    <activity-list-table :activityList="activityList"></activity-list-table>
    <div>
      <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="activityTotalCount"
                     :page-size="pageParams.pageSize"
                     :current-page="pageParams.pageNo"
                     @size-change="onSizeChange"
                     @current-change="onPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import ListFilter from './ListFilter';
  import ActivityListTable from './ActivityListTable';
  import activityRequestor from '../../api/activityRequestor';
  import utils from '@/dss-common/utils';

  export default {
    name: 'ActivityList',
    components: {
      ListFilter,
      ActivityListTable
    },

    data() {
      return {
        loading: true,
        pageParams: {
          pageSize: 10, //每页条数
          pageNo: 1 //页数
        },
        queryParams: null,
        activityList: null,
        activityTotalCount: 0
      };
    },

    methods: {
      onFilter(filterParams) {
        this.queryParams = filterParams;
        this.fetchData();
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.fetchData();
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.fetchData();
      },

      fetchData() {
        this.loading = true;

        const reqParams = { ...this.pageParams, ...this.queryParams };

        activityRequestor
          .listActivity(reqParams)
          .done(
            res => {
              if (res && res.data && res.data.length) {
                this.activityList = res.data.map(item => {
                  item.dateRange = `${utils.timeFormat(new Date(item.startTime), 'YYYY-MM-DD')} 至 ${utils.timeFormat(
                    new Date(item.endTime),
                    'YYYY-MM-DD'
                  )}`;
                  item.passengerNum = utils.addSeparator(item.passengerNum);
                  item.customerNum = utils.addSeparator(item.customerNum);
                  item.newCustomerNum = utils.addSeparator(item.newCustomerNum);
                  item.oldCustomerNum = utils.addSeparator(item.oldCustomerNum);
                  return item;
                });
                this.activityTotalCount = res.totalCount;
              } else {
                this.activityList = null;
                this.activityTotalCount = 0;
              }
            },
            error => {
              this.activityList = null;
              this.activityTotalCount = 0;
            }
          )
          .always(() => {
            this.loading = false;
          });
      }
    }
};
</script>

<style lang="less" scoped>

</style>
