<template>
  <div class="g-data-indicator">
    <div class="da-title">
      销售指标数据详情
    </div>

    <el-select v-model="period"
               @change="onPeriodChange"
               value-key="name"
               style="width: 60px; margin-left: 20px"
               size="mini"
               placeholder="请选择">
      <el-option v-for="item in periods"
                 :key="item.value"
                 :label="item.name"
                 :value="item">
      </el-option>
    </el-select>

    <date-range @pick="onSelectDateRange"
                class="date-range"
                visible-short-cut
                style="margin-left: 20px"/>

    <div class="da-block">
      <div class="da-block-title">数据详情
        <span class="da-download-btn"
              v-if="tableData && tableData.length"
              @click="exportData">导出报表</span>
      </div>

      <el-table :data="tableData"
                stripe
                class="da-table"
                style="width: 100%"
                v-loading="loading">
        <el-table-column prop="statDate"
                         label="日期"
                         align="center">
        </el-table-column>
        <el-table-column prop="storeId"
                         label="门店"
                         align="center">
          <template slot-scope="scope">
            {{getStoreName(scope.row.storeId)}}
          </template>
        </el-table-column>
        <el-table-column prop="saleFee"
                         label="销售额"
                         align="center">
          <template slot-scope="scope">
            {{scope.row.saleFee | thousands}}
          </template>
        </el-table-column>
        <el-table-column prop="saleFeeYOY"
                         align="center"
                         label="销售额同比增长">
          <template slot-scope="scope">
            <span :class="scope.row.saleFee - scope.row.saleFeeYOY > 0 ? 'increase': 'decrease'">
              {{computeRate(scope.row.saleFee, scope.row.saleFeeYOY) | Percentage}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="saleFeeDOD"
                         align="center"
                         label="销售额环比增长">
          <template slot-scope="scope">
            <span :class="scope.row.saleFee - scope.row.saleFeeDOD > 0 ? 'increase': 'decrease'">
              {{computeRate(scope.row.saleFee, scope.row.saleFeeDOD) | Percentage}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="orderCnt"
                         align="center"
                         label="订单量">
          <template slot-scope="scope">
            {{scope.row.orderCnt | thousands}}
          </template>
        </el-table-column>
        <el-table-column prop="pac"
                         align="center"
                         label="平均客单价">
          <template slot-scope="scope">
            {{scope.row.pac | thousands}}
          </template>
        </el-table-column>
        <el-table-column prop="unitPrice"
                         align="center"
                         label="平均件单价">
          <template slot-scope="scope">
            {{scope.row.unitPrice | thousands}}
          </template>
        </el-table-column>
        <el-table-column prop="apr"
                         align="center"
                         label="连带率">
        </el-table-column>

        <!-- 无数据 -->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>
      <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     v-if="totalCount"
                     :total="totalCount"
                     :page-size="queryParams.pageSize"
                     :current-page="queryParams.pageNo"
                     :page-sizes="[10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import { mapState } from 'vuex';
  import services from '@/dss-common/utils/services';
  import indicatorApi from '@/dss-da/src/api/indicator.js';
  import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
  import excel from '@/dss-common/utils/excel.js';
  import DateRange from '../../../components/date-range.vue';
  import filters from '@/dss-common/utils/filters.js';

  const PERIOD_TYPE = {
    TODAY: 1,
    WEEK: 2,
    MONTH: 3
  };

  export default {
    name: 'DataIndicator',

    components: {
      DateRange,
      PlaceHolder
    },

    data() {
      return {
        loading: false,
        tableData: [],
        periods: [
          {
            name: '日',
            value: 1,
            label: 'day'
          },
          {
            name: '周',
            value: 2,
            label: 'week'
          },
          {
            name: '月',
            value: 3,
            label: 'month'
          }
        ],
        period: {
          name: '日',
          value: 1,
          label: 'day'
        },
        dateRange: null,
        totalCount: 0,
        queryParams: {
          pageSize: 10,
          pageNo: 1
        },
        url: indicatorApi.URL_INDICATOR_KPI_DETAIL_D
      };
    },

    computed: {
      ...mapState({
        storeList: state => state.storeList
      })
    },

    mounted() {
      // this.apiGetData();
    },

    methods: {
      onSelectDateRange(dateRange) {
        console.log('onSelectDataRange', dateRange);
        this.dateRange = dateRange;
        this.queryParams.startTime = this.dateRange[0];
        this.queryParams.endTime = this.dateRange[1];
        this.apiGetData();
      },

      onPeriodChange(e) {
        console.log('onPeriodChange', e);
        let type = e.value;
        switch (type) {
          case PERIOD_TYPE.TODAY:
            this.url = indicatorApi.URL_INDICATOR_KPI_DETAIL_D;
            break;

          case PERIOD_TYPE.WEEK:
            this.url = indicatorApi.URL_INDICATOR_KPI_DETAIL_W;
            break;

          case PERIOD_TYPE.MONTH:
            this.url = indicatorApi.URL_INDICATOR_KPI_DETAIL_M;
            break;
        }
        this.apiGetData();
      },

      getStoreName(storeId) {
        let store = this.storeList.find(item => {
          return item.id === storeId;
        });
        if (store) {
          return store.name;
        }
      },

      exportData() {
        console.log('exportData');
        const downloadTableData = this.parseDownloadTableData();
        excel.export2Excel(
          [
            { key: 'statDate', label: '日期' },
            { key: 'storeId', label: '门店' },
            { key: 'saleFee', label: '销售额' },
            { key: 'saleFeeYOY', label: '销售额同比增长' },
            { key: 'saleFeeDOD', label: '销售额环比增长' },
            { key: 'orderCnt', label: '订单量' },
            { key: 'pac', label: '平均客单价' },
            { key: 'unitPrice', label: '平均件单价' },
            { key: 'apr', label: '连带率' }
          ],
          downloadTableData,
          '销售指标报表'
        );
      },

      apiGetData() {
        this.loading = true;
        let params = {
          ...this.queryParams
        };

        services
          .get(this.url, {
            params,
            action: '获取销售指标数据详情'
          })
          .then(res => {
            this.tableData = res.data || [];
            this.totalCount = res.totalCount || 0;
          })
          .catch(err => {
            console.error('getIndicatorKpiDetail error', err);
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 每页条数变化
      onSizeChange(size) {
        this.queryParams.pageSize = size;
        this.queryParams.pageNo = 1;
        this.apiGetData();
      },

      // 翻页
      onPageChange(page) {
        this.queryParams.pageNo = page;
        this.apiGetData();
      },

      parseDownloadTableData() {
        const downloadTableData = this.$plain(this.tableData);
        downloadTableData.forEach(item => {
          item.storeId = this.getStoreName(item.storeId);
          item.saleFeeYOY = filters.Percentage(this.computeRate(item.saleFee, item.saleFeeYOY));
          item.saleFeeDOD = filters.Percentage(this.computeRate(item.saleFee, item.saleFeeDOD));
          item.saleFee = filters.thousands(item.saleFee);
          item.orderCnt = filters.thousands(item.orderCnt);
          item.pac = filters.thousands(item.pac);
          item.unitPrice = filters.thousands(item.unitPrice);
        });
        return downloadTableData;
      },

      computeRate(cnt, olderCnt) {
        if (!olderCnt) {
          return 0;
        }
        return parseFloat((cnt - olderCnt) / olderCnt);
      }
    }
  };
</script>

<style lang="less">
  .g-data-indicator {
    .date-range {
      display: inline-block;
    }

    .increase {
      color: rgba(55, 190, 143, 1);
      margin-left: 5px;
    }

    .decrease {
      color: rgba(251, 73, 56, 1);
      margin-left: 5px;
    }
  }
</style>

