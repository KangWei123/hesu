<template>
  <div class="order-detail"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   style="margin-bottom: 20px;">
      <el-breadcrumb-item :to="{ path: pagePath }">{{pageDesc}}</el-breadcrumb-item>
      <el-breadcrumb-item>订单明细</el-breadcrumb-item>
    </el-breadcrumb>

    <performance-filter @filter="onFilter"
                        class="wkt-opt-label-container"
                        filter-type="order-detail"
                        :params="params" />

    <div class="list-opt-box">
      <el-button class="btn"
                 type="primary"
                 @click="batchExport"
                 :disabled="disableBatchExport">批量导出</el-button>
      <el-button class="btn"
                 @click="oneKeyExport"
                 :disabled="disabledOneKeyExport">一键导出</el-button>
    </div>

    <!-- 订单明细列表 -->
    <div class="order-detail-table">
      <el-table class="wkt-table"
                ref="multipleTable"
                :data="dataList"
                stripe
                tooltip-effect="dark"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         v-if="dataList && dataList.length"
                         width="70"></el-table-column>

        <el-table-column label="购买人"
                         prop="orderUserNickname"
                         min-width="100"></el-table-column>

        <el-table-column label="手机号"
                         prop="orderUserPhone"
                         min-width="110"></el-table-column>

        <el-table-column label="下单店铺"
                         prop="storeName"
                         min-width="100"></el-table-column>

        <el-table-column label="订单编号"
                         prop="orderNo"
                         min-width="180"></el-table-column>

        <el-table-column label="订单支付时间"
                         prop="orderPayTime"
                         :formatter="timeFormatter"
                         min-width="150"></el-table-column>

        <el-table-column label="订单金额"
                         prop="orderFee"
                         min-width="90">
          <template slot-scope="scope">
            <span>￥{{scope.row.orderFee | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="佣金金额"
                         prop="commission"
                         min-width="90">
          <template slot-scope="scope">
            <span>￥{{scope.row.commission | price }}</span>
          </template>
        </el-table-column>

        <el-table-column label="佣金状态"
                         prop="status"
                         min-width="100">
          <template slot-scope="scope">
            <span>{{statusDesc(scope.row.status)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="订单商品"
                         min-width="100">
          <template slot-scope="scope">
            <div class="goods-desc-box">
              <img class="goods-img"
                   :src="scope.row.itemThumbnails[0]" />
            </div>
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
      <span style="font-size:14px;">订单明细正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>
<script>
import performanceFilter from './performance-filter.vue';
import utils from '@/dss-common/utils/index.js';
import placeHolder from '@/dss-common/components/placeholder/index.vue';
import tableCheckedHelperMixin from '@/dss-common/mixins/table-checked-helper.js';
import distributionApi from '@/dss-wechat3rd/src/api/distribution.js';
import exportExcel from '@/dss-common/utils/exportExcel.js';

const unionKeys = ['id']; // 统一标识key集合数组，唯一id标识，可能有多个key，用于记录选中的分页数据

export default {
  mixins: [tableCheckedHelperMixin],
  components: {
    performanceFilter,
    placeHolder
  },

  data() {
    return {
      loading: false,

      // 传给子组件的默认查询条件
      params: {
        storeId: null
      },

      // 列表查询条件
      queryParams: {
        activityType: 0, // 活动类型，0：全员分销；1：员工内购；-1：全部
        commissionMode: null, // 佣金模式 1：推广；2：服务
        storeId: null, // 佣金人所属门店id
        distributorId: null, // 佣金人id
        distributorPhone: null // 佣金人手机号
      },

      // 查询过滤条件
      filterParams: {},

      dataList: [], // 数据列表

      multipleSelection: [], // 当前页面选中维护的订单选项

      totalCount: 0, // 总条数
      pageParams: {
        pageSize: 10, // 每页条数
        pageNo: 1 // 页数
      },

      // 导出相关参数
      disableBatchExport: false, // 是否禁止批量导出操作按钮
      disabledOneKeyExport: false, // 是否禁止一件导出操作按钮
      showTipDialog: false // 是否显示一键导出温馨提示对话弹框
    };
  },

  computed: {
    // 分销类型Url
    pagePath() {
      // 根据分销类型，赋值面包屑跳转url
      if (this.queryParams.activityType === 0) {
        return '/distribution/performance-statistic/marketing';
      }
      return '/distribution/performance-statistic/purchase';
    },

    // 分销类型描述
    pageDesc() {
      // 根据分销类型，展示面包屑
      if (this.queryParams.activityType === 0) {
        return '全员营销';
      }
      return '员工内购';
    },

    // 佣金状态描述
    statusDesc() {
      return status => {
        if (!status) {
          return '冻结中';
        } else if (status === 1) {
          return '可提现';
        }
        return '已失效';
      };
    }
  },

  mounted() {
    // 传给子组件的默认查询条件赋值
    this.params = {
      storeId: this.$route.query.storeId || null // 佣金人所属门店id
    };

    // 列表查询条件赋值
    this.queryParams = {
      activityType: Number(this.$route.query.activityType) || 0, // 活动类型，0：全员分销；1：员工内购；-1：全部
      commissionMode: this.$route.query.commissionMode || null, // 佣金模式 1：推广；2：服务
      storeId: this.$route.query.storeId || null, // 佣金人所属门店id
      distributorId: this.$route.query.distributorId || null, // 佣金人id
      distributorPhone: this.$route.query.distributorPhone || null // 佣金人手机号
    };
    this.onFilter(); // 按条件查询
  },
  methods: {
    /**
     * 格式化时间
     */
    timeFormatter(row, column, cellValue, index) {
      return utils.timeFormat(cellValue);
    },

    // 按条件查询
    onFilter(filterParams) {
      // 添加列表查询条件
      this.filterParams = filterParams;

      this.pageParams.pageNo = 1;
      this.getDisOrderList(); // 查询订单明细列表
    },

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageNo = 1;
      this.pageParams.pageSize = size;
      this.getDisOrderList(); // 查询订单明细列表
    },
    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.getDisOrderList(); // 查询订单明细列表
    },

    /**
     * 查询订单明细列表
     */
    getDisOrderList() {
      // 获取数据之前，需要重新计算一次选中的item
      this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

      let params = {
        ...this.queryParams,
        ...this.filterParams,
        ...this.pageParams
      };

      this.loading = true;
      distributionApi.performanceStatistic
        .queryDisOrderList(params)
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
     * 批量导出订单明细
     */
    batchExport() {
      // 每次批量操作时，主动触发一次计算全部选择的列表
      this.mUpdateTotalListBySelection(this.dataList, this.multipleSelection, unionKeys);

      // 所有被选中的列表list长度小于1
      if (this.mTotalCheckedList.length < 1) {
        this.$message.error('请选择要导出的订单明细');
        return;
      }

      this.$confirm('确定批量导出过滤后的订单明细吗？', '批量导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            ...this.queryParams,
            ...this.filterParams
          };

          // 批量所有被选中的列表list的id集合
          let idList = [];
          this.mTotalCheckedList.forEach(item => {
            idList.push(item.id);
          });
          params.idList = idList;

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
            .getDownload(distributionApi.performanceStatistic.disOrderListExport, params)
            .then(res => {
              this.$message({
                message: '订单明细导出成功，正在下载',
                type: 'success'
              });

              this.emptyMultipleSelection(); // 批量操作成功之后，清空之前选中的操作数据列表
              this.getDisOrderList(); // 查询订单明细列表
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
     * 一键导出订单明细
     */
    oneKeyExport() {
      this.$confirm('确定一键导出过滤后的订单明细吗？', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            ...this.queryParams,
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
          exportExcel.getDownload(distributionApi.performanceStatistic.disOrderListExport, params).always(() => {
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

<style lang="less" scoped>
.order-detail-table {
  .goods-img {
    width: 50px;
    height: 50px;
  }
}
</style>

