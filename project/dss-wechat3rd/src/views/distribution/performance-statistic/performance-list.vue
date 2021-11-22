<template>
  <div class="performance-list-table"
       v-loading="loading">
    <div class="list-opt-box">
      <el-button class="btn"
                 type="primary"
                 @click="batchExport"
                 :disabled="disableBatchExport">批量导出</el-button>
      <el-button class="btn"
                 @click="oneKeyExport"
                 :disabled="disabledOneKeyExport">一键导出</el-button>
    </div>

    <!-- 业绩统计列表 -->
    <div class="performance-list">
      <el-table class="wkt-table"
                ref="multipleTable"
                :data="dataList"
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         v-if="dataList && dataList.length"
                         width="70"></el-table-column>

        <el-table-column label="所属门店"
                         prop="storeName"
                         min-width="120"></el-table-column>

        <el-table-column :label="staffTypeDesc"
                         prop="distributorName"
                         min-width="80"></el-table-column>

        <el-table-column label="手机号"
                         prop="distributorPhone"
                         min-width="110"></el-table-column>

        <el-table-column label="总佣金"
                         prop="commissionTotal">
          <template slot-scope="scope">
            <span>￥{{scope.row.commissionTotal | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="150">
          <template slot-scope="scope">
            <a @click="handleDisOrderList(scope.row)">分销订单明细</a>
          </template>
        </el-table-column>

        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align: center">
        <el-pagination v-if="totalCount"
                       layout="prev, pager, next, jumper, sizes, total"
                       :total="totalCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"></el-pagination>
      </div>
    </div>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示"
               :visible.sync="showTipDialog"
               width="500px">
      <span style="font-size:14px;">业绩统计正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/dss-common/utils/index.js';
import placeHolder from '@/dss-common/components/placeholder/index.vue';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
import exportExcel from '@/dss-common/utils/exportExcel.js';

const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

export default {
  name: 'performanceList',
  mixins: [tableCheckedHelperMixin],
  components: {
    placeHolder
  },

  props: {
    // 搜索列表类型
    listType: {
      type: String,
      default: 'marketing'
    },
    // 列表查询条件
    filterParams: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      loading: false,

      activityType: 0, // 活动类型，0：全员分销；1：员工内购；-1：全部

      totalCount: 0, // 总条数
      pageParams: {
        pageSize: 10, // 每页条数
        pageNo: 1 // 页数
      },

      dataList: [], // 数据列表

      multipleSelection: [], // 当前页面选中维护的业绩选项

      // 导出相关参数
      disableBatchExport: false, // 是否禁止批量导出操作按钮
      disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
      showTipDialog: false // 是否显示一键导出温馨提示对话弹框
    };
  },

  computed: {
    /**
     * 员工类型描述
     */
    staffTypeDesc() {
      if (this.filterParams.commissionMode && this.filterParams.commissionMode === 1) {
        return '推广人';
      }
      return '服务员工';
    }
  },
  watch: {
    // 监听父组件传过来的列表查询条件，以便实时查询
    filterParams: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        // 判断父组件传过来的列表类型设置activityType活动类型参数（0：全员分销；1：员工内购；-1：全部）
        if (this.listType === 'marketing') {
          this.activityType = 0;
        } else if (this.listType === 'purchase') {
          this.activityType = 1;
        }

        this.pageParams.pageNo = 1;
        this.getPerformanceList(); // 查询业绩列表
      }
    }
  },

  methods: {
    /**
     * 格式化时间
     */
    timeFormatter(row, column, cellValue, index) {
      return utils.timeFormat(cellValue);
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageNo = 1;
      this.pageParams.pageSize = size;
      this.getPerformanceList(); // 查询业绩列表
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getPerformanceList(); // 查询业绩列表
    },

    /**
     * 查询业绩列表
     */
    getPerformanceList() {
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

      let params = {
        activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
        ...this.filterParams,
        ...this.pageParams
      };

      this.loading = true;
      distributionApi.performanceStatistic
        .queryDisCommission(params)
        .done(res => {
          this.dataList = res.data || [];
          this.totalCount = res.totalCount || 0;

          // 成功获取数据之后，重新构建pageList的选中状态
          this.mBuildMultipleTableSelection(this.dataList, 'multipleTable', unionKeys);
        })
        .always(res => {
          this.loading = false;
        });
    },

    /**
     * 跳转对应的分销订单明细页面
     */
    handleDisOrderList(row) {
      // 跳转的页面链接
      let url = '/distribution/performance-statistic/marketing/order-detail';
      // 根据请求的列表类型设置对应的跳转链接
      if (row.activityType === 1) {
        url = '/distribution/performance-statistic/purchase/order-detail';
      }

      this.$router.push({
        path: url,
        query: {
          activityType: row.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
          commissionMode: row.commissionMode, // 佣金模式 1：推广；2：服务
          storeId: row.storeId,
          distributorId: row.distributorId,
          distributorPhone: row.distributorPhone
        }
      });
    },

    /**
     * 改变列表选项
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 批量操作成功之后，清空之前选中的操作数据列表
     */
    emptyMultipleSelection() {
      // 清除之前已选中的状态，重新计算选中的item。
      this.multipleSelection = [];
      this.mResetCheckedData();
      this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);
    },

    /**
     * 批量导出佣金业绩
     */
    batchExport() {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

      // 所有被选中的列表list长度小于1
      if (this.mTotalCheckedList.length < 1) {
        this.$message.error('请选择要导出的佣金业绩');
        return;
      }

      this.$confirm('确定批量导出过滤后的佣金业绩吗？', '批量导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
            ...this.filterParams
          };

          // 批量所有被选中的列表list的参数集合
          let distributorIdAndStoreIdList = [];
          this.mTotalCheckedList.forEach(item => {
            distributorIdAndStoreIdList.push({ distributorId: item.distributorId, storeId: item.storeId });
          });
          params.distributorIdAndStoreIdList = distributorIdAndStoreIdList;

          if (params.startDate && params.endDate) {
            let day = this.gatDateInterval(params); // 获取时间间隔
            if (day > 31) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error'
              });
            }
          }

          //post下载
          this.disableBatchExport = true;
          exportExcel
            .download(distributionApi.performanceStatistic.disCommissionExport, params)
            .then(res => {
              this.$message({
                message: '佣金业绩导出成功，正在下载',
                type: 'success'
              });

              this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
              this.getPerformanceList(); // 查询业绩列表
            })
            .always(() => {
              this.disableBatchExport = false;
            });
        })
        .catch(() => {
          console.log('取消导出');
        });
    },

    /**
     * 一键导出佣金业绩
     */
    oneKeyExport() {
      this.$confirm('确定一键导出过滤后的佣金业绩吗？', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
            ...this.filterParams
          };

          // 判断是否选择了时间
          if (!params.startDate || !params.endDate) {
            return this.$message({
              message: '请选择导出数据的时间',
              type: 'error'
            });
          }

          let day = this.gatDateInterval(params); // 获取时间间隔
          if (day > 31) {
            return this.$message({
              message: '时间跨度不得超过31天',
              type: 'error'
            });
          }

          //post下载
          this.disabledOneKeyExport = true;
          this.showTipDialog = true;
          exportExcel.download(distributionApi.performanceStatistic.disCommissionExport, params).always(() => {
            this.disabledOneKeyExport = false;
            this.showTipDialog = false;
          });
        })
        .catch(() => {
          console.log('取消一键导出');
        });
    },

    /**
     * 获取时间间隔
     */
    gatDateInterval(params) {
      let startDate = new Date(params.startDate);
      let endDate = new Date(params.endDate);
      let time = endDate.getTime() - startDate.getTime();
      let day = parseInt(time / (1000 * 60 * 60 * 24));
      return day;
    }
  }
};
</script>
