<template>
  <div class="commission-list-table" v-loading="loading">
    <div class="list-opt-box">
      <el-button class="btn" type="primary" @click="batchExport" :disabled="disableBatchExport">批量导出</el-button>
      <el-button class="btn" @click="oneKeyExport" :disabled="disabledOneKeyExport">一键导出</el-button>
      <el-tooltip
        :disabled="!!ruleData.isSettleManually"
        content="当前结算方式为自动结算，不可手动标记结算"
        placement="bottom"
        effect="light"
        style="margin-left: 10px"
      >
        <span>
          <el-button
            class="btn"
            @click="batchWithDraw"
            :disabled="!ruleData.isSettleManually"
            :loading="drawLoading || ruleLoading"
            >标记为人工结算</el-button
          >
        </span>
      </el-tooltip>
      <a style="margin-left: 10px" @click="handleDrawAll" v-loading="drawAllLoading || ruleLoading">一键结算所有订单</a>
    </div>

    <!-- 佣金列表 -->
    <div class="commission-list">
      <el-table
        class="wkt-table"
        ref="multipleTable"
        :data="dataList"
        stripe
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" v-if="dataList && dataList.length" width="70"></el-table-column>

        <el-table-column label="订单编号" prop="copyOrderNo" min-width="120"></el-table-column>

        <el-table-column label="外部订单号" prop="outTransactionId" show-overflow-tooltip></el-table-column>

        <el-table-column label="订单金额" prop="orderFee">
          <span slot-scope="scope">￥{{ scope.row.orderFee | price }}</span>
        </el-table-column>

        <el-table-column label="收益比例" prop="commission" :formatter="percentFormatter" />

        <el-table-column label="提现佣金金额" prop="commission">
          <template slot-scope="scope">
            <span>￥{{ scope.row.commission | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="分销员" prop="distributorName" />

        <el-table-column label="角色" prop="jobName" />

        <el-table-column label="门店" prop="storeName" />

        <el-table-column label="部门" prop="department" />

        <el-table-column label="订单支付时间" prop="orderPayTime" min-width="140px">
          <span slot-scope="scope">{{ scope.row.orderPayTime | time }}</span>
        </el-table-column>

        <el-table-column label="佣金状态" fixed="right">
          <template slot="header">
            <el-popover title="佣金状态" width="420" trigger="hover">
              <div class="question-detail">
                <p><span>冻结中：</span>如未超过退货期或未确认收货，则佣金还在冻结中；</p>
                <p><span>待结算：</span>佣金已解除冻结，允许发放；</p>
                <p><span>不结算：</span>订单发生退款退货等情况；</p>
                <p><span>已自动结算：</span>在员工的分销中心自动结算，即可提现状态；</p>
                <p><span>已人工结算：</span>在线下结算，人工标记已结算。</p>
              </div>
              <span slot="reference">佣金状态<i class="el-icon-question" /></span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">冻结中</span>
            <span v-if="scope.row.status == 1">已自动结算</span>
            <span v-if="scope.row.status == 2">不结算</span>
            <span v-if="scope.row.status == 3">待结算</span>
            <span v-if="scope.row.status == 4">已人工结算</span>
          </template>
        </el-table-column>

        <!--修改无数据时的展示-->
        <template slot="empty">
          <place-holder></place-holder>
        </template>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align: center">
        <el-pagination
          v-if="totalCount"
          layout="prev, pager, next, jumper, sizes, total"
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          @size-change="onSizeChange"
          @current-change="onPageChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 一键导出温馨提示对话弹框 -->
    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">提现记录正在导出，请等候...</span>
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
    name: 'CommissionListTable',
    mixins: [tableCheckedHelperMixin],
    components: {
      placeHolder,
    },

    props: {
      // 搜索列表类型
      listType: {
        type: String,
        default: 'all',
      },
      // 列表查询条件
      filterParams: {
        type: Object,
        default: {},
      },
    },

    data() {
      return {
        loading: false,
        drawLoading: false,
        drawAllLoading: false,
        ruleLoading: false,

        activityType: 0, // 活动类型，0：全员分销；1：员工内购；-1：全部

        totalCount: 0, // 总条数
        pageParams: {
          pageSize: 10, // 每页条数
          pageNo: 1, // 页数
        },

        dataList: [], // 数据列表

        multipleSelection: [], // 当前页面选中维护的佣金选项

        // 导出相关参数
        disableBatchExport: false, // 是否禁止批量导出操作按钮
        disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
        showTipDialog: false, // 是否显示一键导出温馨提示对话弹框
        ruleData: {},
      };
    },

    computed: {
      // 判断是否禁止底部批量操作按钮
      disableBatchButton() {
        if (
          this.multipleSelection.length > 0 || // 当前页选中操作的数据数组长度大于0
          this.mTotalCheckedList.length > 0 // 所有被选中的列表list长度大于0
        ) {
          return false;
        }
        return true;
      },
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
          this.getCashOutList(); // 查询提现记录列表
        },
      },
    },

    methods: {
      /**
       * 格式化时间
       */
      timeFormatter(row, column, cellValue, index) {
        return utils.timeFormat(cellValue);
      },

      // 收益比例
      percentFormatter(row, column, cellValue, index) {
        const percent = row.commission / row.orderFee;
        if (Number.isNaN(percent)) {
          return '0.00' + '%';
        } else {
          return (percent.toFixed(4) * 100).toFixed(2) + '%';
        }
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageNo = 1;
        this.pageParams.pageSize = size;
        this.getCashOutList(); // 查询提现记录列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getCashOutList(); // 查询提现记录列表
      },

      /**
       * 查询提现记录列表
       */
      getCashOutList() {
        // 获取数据之前，需要重新计算一次选中的item
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

        const params = {
          activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
          ...this.filterParams,
          ...this.pageParams,
          departmentIds: this.filterParams.departmentIds ? this.filterParams.departmentIds.slice(-1)[0] : null,
        };

        // 变更请求参数中员工名字的参数key值
        if (params.name) {
          params.distributorName = params.name;
          delete params.name;
        }

        this.loading = true;
        distributionApi.performanceStatistic
          .queryDisOrderList(params)
          .then(res => {
            this.dataList = res.data || [];
            this.totalCount = res.totalCount || 0;
            // 成功获取数据之后，重新构建pageList的选中状态
            this.mBuildMultipleTableSelection(this.dataList, 'multipleTable', unionKeys);
          })
          .finally(res => {
            this.loading = false;
          });
      },

      /**
       * 改变佣金列表选项
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
       * 批量导出佣金列表
       */
      batchExport() {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

        // 所有被选中的列表list长度小于1
        if (this.mTotalCheckedList.length < 1) {
          this.$message.error('请选择要导出的佣金列表');
          return;
        }

        this.$confirm('确定批量导出过滤后的佣金列表吗？', '批量导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
              ...this.filterParams,
            };

            // 批量所有被选中的列表list的flowNo集合
            const idList = [];
            this.mTotalCheckedList.forEach(item => {
              idList.push(item.id);
            });
            params.idList = idList;

            // // 变更请求参数中员工名字的参数key值
            // if (params.name) {
            //   params.distributorName = params.name;
            //   delete params.name;
            // }

            if (params.startDate && params.endDate) {
              const day = this.gatDateInterval(params); // 获取时间间隔
              if (day > 31) {
                return this.$message({
                  message: '时间跨度不得超过31天',
                  type: 'error',
                });
              }
            }

            // post下载
            this.disableBatchExport = true;
            exportExcel
              .getDownload(distributionApi.performanceStatistic.exportCommissionRecord, params)
              .then(res => {
                this.$message({
                  message: '佣金列表导出成功，正在下载',
                  type: 'success',
                });

                this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
                this.getCashOutList(); // 查询提现记录列表
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
       * 批量标记为人工结算
       */
      async batchWithDraw() {
        // 每次批量操作时，主动触发一次计算全部选择的列表
        this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);
        // 所有被选中的列表list长度小于1
        if (this.mTotalCheckedList.length < 1) {
          this.$message.error('请选择要标记的订单');
          return;
        }
        this.$confirm('即将批量结算选中的待结算订单，请确认是否进行批量结算操作？', '标记为人工结算', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(async () => {
          try {
            this.drawLoading = true;
            const commissionIds = this.mTotalCheckedList
              .filter(i => i.status === 3)
              .map(i => i.id)
              .join(',');
            if (commissionIds) {
              await distributionApi.batchWithDraw({ commissionIds });
              this.$message({ type: 'success', message: '操作成功' });
              this.getCashOutList();
            } else {
              this.$message({ type: 'error', message: '当前订单无法人工结算' });
            }
          } finally {
            this.drawLoading = false;
          }
        });
      },

      async handleDrawAll() {
        if (!this.ruleData.isSettleManually) {
          this.$message({ type: 'error', message: '当前结算方式为自动结算，不可手动标记结算' });
          return;
        }
        this.$confirm('即将一键结算所有待结算订单，请确认是否进行批量结算操作？', '一键结算所有订单', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        }).then(async () => {
          try {
            this.drawAllLoading = true;
            await distributionApi.drawAll();
            this.$message({ type: 'success', message: '标记成功' });
            this.getCashOutList();
          } finally {
            this.drawAllLoading = false;
          }
        });
      },

      /**
       * 一键导出佣金列表
       */
      oneKeyExport() {
        this.$confirm('确定一键导出过滤后的佣金列表吗？', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = {
              activityType: this.activityType, // 活动类型，0：全员分销；1：员工内购；-1：全部
              ...this.filterParams,
            };

            // // 变更请求参数中员工名字的参数key值
            // if (params.name) {
            //   params.distributorName = params.name;
            //   delete params.name;
            // }

            // 判断是否选择了时间
            if (!params.startDate || !params.endDate) {
              return this.$message({
                message: '请选择导出数据的时间',
                type: 'error',
              });
            }

            const day = this.gatDateInterval(params); // 获取时间间隔
            if (day > 31) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }

            // post下载
            this.disabledOneKeyExport = true;
            this.showTipDialog = true;
            exportExcel
              .getDownload(distributionApi.performanceStatistic.exportCommissionRecord, params)
              .then(res => {})
              .finally(() => {
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
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        const time = endDate.getTime() - startDate.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },
    },

    async mounted() {
      this.ruleLoading = true;
      try {
        const { data } = await distributionApi.queryItemSetting();
        this.ruleData = data;
      } finally {
        this.ruleLoading = false;
      }
    },
  };
</script>

<style lang="less" scoped>
  .question-detail {
    span {
      font-weight: bold;
    }
    margin-bottom: 20px;
  }
</style>
